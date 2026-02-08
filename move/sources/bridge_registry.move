/// Bridge Registry - Tracks cross-chain bridge positions and calculates rewards
module liquidx::bridge_registry {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use std::option::{Self, Option};

    /// Bridge position for a user
    public struct BridgePosition has store {
        user: address,
        total_bridged: u64,           // Total USDC bridged (6 decimals)
        bridge_timestamp: u64,        // First bridge time in ms
        reward_multiplier: u64,       // Multiplier in basis points (10000 = 1x)
        unclaimed_rewards: u64,       // $LQX tokens earned but not claimed
        last_claim: u64,              // Last claim timestamp
        auto_deployed: bool,          // Whether auto-deployed to DeFi
        target_protocol: String,      // Target DeFi protocol name
        total_earned: u64,            // Lifetime $LQX earnings
        referrer: Option<address>,    // Who referred this user
    }

    /// Global registry holding all bridge positions
    public struct BridgeRegistry has key {
        id: UID,
        positions: Table<address, BridgePosition>,
        total_liquidity_bridged: u64,
        total_rewards_distributed: u64,
        total_users: u64,
        admin: address,
    }

    /// Admin capability
    public struct AdminCap has key, store {
        id: UID,
    }

    /// Leaderboard entry
    public struct LeaderboardEntry has copy, drop, store {
        user: address,
        amount_bridged: u64,
        total_rewards: u64,
        rank: u64,
    }

    // Constants for reward calculation
    const BASE_REWARD_BPS: u64 = 75;           // 0.75% = 75 basis points
    const AUTO_DEPLOY_BONUS_BPS: u64 = 3000;   // 30% bonus = 3000 basis points
    const REFERRAL_BONUS_BPS: u64 = 1000;      // 10% bonus = 1000 basis points
    const BPS_DENOMINATOR: u64 = 10000;

    // Multiplier tiers (in USDC with 6 decimals)
    const TIER_1_THRESHOLD: u64 = 0;           // < $1,000
    const TIER_2_THRESHOLD: u64 = 1000000000;  // $1,000
    const TIER_3_THRESHOLD: u64 = 10000000000; // $10,000
    const TIER_4_THRESHOLD: u64 = 50000000000; // $50,000

    const MULTIPLIER_TIER_1: u64 = 10000;  // 1.0x
    const MULTIPLIER_TIER_2: u64 = 15000;  // 1.5x
    const MULTIPLIER_TIER_3: u64 = 20000;  // 2.0x
    const MULTIPLIER_TIER_4: u64 = 30000;  // 3.0x

    // Error codes
    const E_NOT_ADMIN: u64 = 0;
    const E_USER_NOT_FOUND: u64 = 1;
    const E_INSUFFICIENT_REWARDS: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;

    // Events
    public struct BridgeRegistered has copy, drop {
        user: address,
        amount: u64,
        eth_tx_hash: vector<u8>,
        auto_deployed: bool,
        target_protocol: String,
        rewards_earned: u64,
        new_multiplier: u64,
    }

    public struct RewardsClaimed has copy, drop {
        user: address,
        amount: u64,
        timestamp: u64,
    }

    /// Initialize the registry
    fun init(ctx: &mut TxContext) {
        let registry = BridgeRegistry {
            id: object::new(ctx),
            positions: table::new(ctx),
            total_liquidity_bridged: 0,
            total_rewards_distributed: 0,
            total_users: 0,
            admin: tx_context::sender(ctx),
        };
        transfer::share_object(registry);

        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    /// Register a bridge transaction
    public entry fun register_bridge(
        registry: &mut BridgeRegistry,
        amount: u64,
        eth_tx_hash: vector<u8>,
        auto_deploy: bool,
        target_protocol: vector<u8>,
        referrer: Option<address>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        let protocol_string = string::utf8(target_protocol);

        // Get or create position
        let (new_total, existing_earned, existing_referrer) = if (table::contains(&registry.positions, user)) {
            let pos = table::borrow(&registry.positions, user);
            (pos.total_bridged + amount, pos.total_earned, pos.referrer)
        } else {
            registry.total_users = registry.total_users + 1;
            (amount, 0, referrer)
        };

        // Calculate rewards
        let base_rewards = calculate_base_rewards(amount);
        let bonus_rewards = if (auto_deploy) {
            (base_rewards * AUTO_DEPLOY_BONUS_BPS) / BPS_DENOMINATOR
        } else {
            0
        };
        let total_rewards = base_rewards + bonus_rewards;
        
        // Apply multiplier
        let multiplier = calculate_multiplier(new_total);
        let final_rewards = (total_rewards * multiplier) / BPS_DENOMINATOR;

        // Create or update position
        let position = BridgePosition {
            user,
            total_bridged: new_total,
            bridge_timestamp: current_time,
            reward_multiplier: multiplier,
            unclaimed_rewards: final_rewards,
            last_claim: current_time,
            auto_deployed: auto_deploy,
            target_protocol: protocol_string,
            total_earned: existing_earned + final_rewards,
            referrer: existing_referrer,
        };

        if (table::contains(&registry.positions, user)) {
            let old_pos = table::remove(&mut registry.positions, user);
            position.unclaimed_rewards = position.unclaimed_rewards + old_pos.unclaimed_rewards;
            position.bridge_timestamp = old_pos.bridge_timestamp; // Keep original timestamp
        };

        table::add(&mut registry.positions, user, position);

        // Update global stats
        registry.total_liquidity_bridged = registry.total_liquidity_bridged + amount;
        registry.total_rewards_distributed = registry.total_rewards_distributed + final_rewards;

        // Handle referrer bonus
        if (option::is_some(&referrer)) {
            let referrer_addr = *option::borrow(&referrer);
            if (table::contains(&registry.positions, referrer_addr)) {
                let referrer_pos = table::borrow_mut(&mut registry.positions, referrer_addr);
                let referrer_bonus = (final_rewards * REFERRAL_BONUS_BPS) / BPS_DENOMINATOR;
                referrer_pos.unclaimed_rewards = referrer_pos.unclaimed_rewards + referrer_bonus;
                referrer_pos.total_earned = referrer_pos.total_earned + referrer_bonus;
            };
        };

        // Emit event
        event::emit(BridgeRegistered {
            user,
            amount,
            eth_tx_hash,
            auto_deployed: auto_deploy,
            target_protocol: protocol_string,
            rewards_earned: final_rewards,
            new_multiplier: multiplier,
        });
    }

    /// Calculate base rewards (0.75% of bridged amount)
    fun calculate_base_rewards(amount: u64): u64 {
        (amount * BASE_REWARD_BPS) / BPS_DENOMINATOR
    }

    /// Calculate multiplier based on total bridged amount
    fun calculate_multiplier(total_amount: u64): u64 {
        if (total_amount >= TIER_4_THRESHOLD) {
            MULTIPLIER_TIER_4
        } else if (total_amount >= TIER_3_THRESHOLD) {
            MULTIPLIER_TIER_3
        } else if (total_amount >= TIER_2_THRESHOLD) {
            MULTIPLIER_TIER_2
        } else {
            MULTIPLIER_TIER_1
        }
    }

    /// Claim accumulated rewards (updates position, actual token distribution handled separately)
    public entry fun claim_rewards(
        registry: &mut BridgeRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        assert!(table::contains(&registry.positions, user), E_USER_NOT_FOUND);

        let position = table::borrow_mut(&mut registry.positions, user);
        assert!(position.unclaimed_rewards > 0, E_INSUFFICIENT_REWARDS);

        let claimable = position.unclaimed_rewards;
        position.unclaimed_rewards = 0;
        position.last_claim = clock::timestamp_ms(clock);

        event::emit(RewardsClaimed {
            user,
            amount: claimable,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Get user position (read-only)
    public fun get_user_position(
        registry: &BridgeRegistry,
        user: address
    ): (u64, u64, u64, u64, bool, vector<u8>) {
        if (!table::contains(&registry.positions, user)) {
            return (0, 0, 0, 0, false, b"")
        };

        let pos = table::borrow(&registry.positions, user);
        (
            pos.total_bridged,
            pos.unclaimed_rewards,
            pos.total_earned,
            pos.reward_multiplier,
            pos.auto_deployed,
            *string::bytes(&pos.target_protocol)
        )
    }

    /// Get global stats (read-only)
    public fun get_global_stats(
        registry: &BridgeRegistry
    ): (u64, u64, u64) {
        (
            registry.total_liquidity_bridged,
            registry.total_rewards_distributed,
            registry.total_users
        )
    }

    /// Get user's unclaimed rewards
    public fun get_unclaimed_rewards(
        registry: &BridgeRegistry,
        user: address
    ): u64 {
        if (!table::contains(&registry.positions, user)) {
            return 0
        };
        table::borrow(&registry.positions, user).unclaimed_rewards
    }

    // Test-only initialization
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
