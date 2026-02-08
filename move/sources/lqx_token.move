/// LiquidX Token ($LQX) - Reward token for cross-chain liquidity providers
/// Implements a fungible token with vesting functionality
module liquidx::lqx_token {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance::{Self, Balance};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};

    /// Token witness type
    public struct LQX_TOKEN has drop {}

    /// Vesting schedule for a user
    public struct VestingSchedule has key, store {
        id: UID,
        beneficiary: address,
        total_amount: u64,
        claimed_amount: u64,
        start_time_ms: u64,
        vesting_duration_ms: u64, // 90 days = 7,776,000,000 ms
    }

    /// Shared object holding all vesting schedules
    public struct VestingRegistry has key {
        id: UID,
        schedules: Table<address, vector<VestingSchedule>>,
        admin: address,
    }

    /// Treasury and admin capability
    public struct AdminCap has key, store {
        id: UID,
    }

    /// One-time witness initialization
    fun init(witness: LQX_TOKEN, ctx: &mut TxContext) {
        // Create the currency with 6 decimals (to match USDC)
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            6,
            b"LQX",
            b"LiquidX Token",
            b"Reward token for LiquidX cross-chain liquidity providers",
            option::none(),
            ctx
        );

        // Transfer treasury cap to the deployer
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));

        // Create vesting registry
        let registry = VestingRegistry {
            id: object::new(ctx),
            schedules: table::new(ctx),
            admin: tx_context::sender(ctx),
        };
        transfer::share_object(registry);

        // Create and transfer admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    /// Mint new $LQX tokens (admin only)
    public entry fun mint(
        _: &AdminCap,
        treasury_cap: &mut TreasuryCap<LQX_TOKEN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let coin = coin::mint(treasury_cap, amount, ctx);
        transfer::public_transfer(coin, recipient);
    }

    /// Create a vesting schedule for bridge rewards
    public entry fun create_vesting(
        _: &AdminCap,
        registry: &mut VestingRegistry,
        treasury_cap: &mut TreasuryCap<LQX_TOKEN>,
        beneficiary: address,
        amount: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Mint tokens to vesting contract
        let coins = coin::mint(treasury_cap, amount, ctx);
        
        // Create vesting schedule (90 days)
        let vesting = VestingSchedule {
            id: object::new(ctx),
            beneficiary,
            total_amount: amount,
            claimed_amount: 0,
            start_time_ms: clock::timestamp_ms(clock),
            vesting_duration_ms: 7776000000, // 90 days in milliseconds
        };

        // Add to registry
        if (!table::contains(&registry.schedules, beneficiary)) {
            table::add(&mut registry.schedules, beneficiary, vector::empty());
        };
        
        let user_schedules = table::borrow_mut(&mut registry.schedules, beneficiary);
        vector::push_back(user_schedules, vesting);

        // Store the coins in the vesting schedule object
        // Note: In production, you'd want to hold the coins in the vesting schedule
        // For simplicity, we're just burning them here - in real implementation,
        // you'd store them properly
        transfer::public_transfer(coins, beneficiary);
    }

    /// Calculate claimable amount based on time elapsed
    public fun calculate_claimable(
        schedule: &VestingSchedule,
        current_time_ms: u64
    ): u64 {
        let time_elapsed = if (current_time_ms > schedule.start_time_ms) {
            current_time_ms - schedule.start_time_ms
        } else {
            0
        };

        if (time_elapsed >= schedule.vesting_duration_ms) {
            // Fully vested
            schedule.total_amount - schedule.claimed_amount
        } else {
            // Partial vesting (linear)
            let vested_amount = (schedule.total_amount * time_elapsed) / schedule.vesting_duration_ms;
            if (vested_amount > schedule.claimed_amount) {
                vested_amount - schedule.claimed_amount
            } else {
                0
            }
        }
    }

    /// Claim vested rewards
    public entry fun claim_vested(
        registry: &mut VestingRegistry,
        schedule_index: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(table::contains(&registry.schedules, sender), 0); // User has no vesting schedules

        let user_schedules = table::borrow_mut(&mut registry.schedules, sender);
        assert!(vector::length(user_schedules) > schedule_index, 1); // Invalid schedule index

        let schedule = vector::borrow_mut(user_schedules, schedule_index);
        let current_time = clock::timestamp_ms(clock);
        let claimable = calculate_claimable(schedule, current_time);

        assert!(claimable > 0, 2); // No tokens available to claim

        schedule.claimed_amount = schedule.claimed_amount + claimable;
        
        // In production, transfer the actual tokens here
        // For now, this is a placeholder
    }

    /// Get user's total vesting schedules
    public fun get_vesting_info(
        registry: &VestingRegistry,
        user: address,
        clock: &Clock
    ): (u64, u64) {
        if (!table::contains(&registry.schedules, user)) {
            return (0, 0)
        };

        let schedules = table::borrow(&registry.schedules, user);
        let total_vested = 0u64;
        let total_claimable = 0u64;
        let current_time = clock::timestamp_ms(clock);

        let i = 0;
        let len = vector::length(schedules);
        while (i < len) {
            let schedule = vector::borrow(schedules, i);
            total_vested = total_vested + schedule.total_amount;
            total_claimable = total_claimable + calculate_claimable(schedule, current_time);
            i = i + 1;
        };

        (total_vested, total_claimable)
    }

    // Test-only functions
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(LQX_TOKEN {}, ctx);
    }
}
