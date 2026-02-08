// LiquidX Contract Service
// Handles all interactions with the SUI Move smart contracts

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { LIQUIDX_CONFIG } from '@/lib/liquidx-config';

// Initialize SUI client
const suiClient = new SuiClient({ 
  url: LIQUIDX_CONFIG.SUI_NETWORK === 'mainnet' 
    ? getFullnodeUrl('mainnet') 
    : getFullnodeUrl('testnet')
});

// Contract addresses (will be set after deployment)
const BRIDGE_REGISTRY_PACKAGE = LIQUIDX_CONFIG.BRIDGE_REGISTRY_PACKAGE;
const LQX_TOKEN_PACKAGE = LIQUIDX_CONFIG.LQX_TOKEN_PACKAGE;
const BRIDGE_REGISTRY_OBJECT = LIQUIDX_CONFIG.BRIDGE_REGISTRY_OBJECT;

// Types
export interface UserPosition {
  totalBridged: number;
  rewardMultiplier: number;
  unclaimedRewards: number;
  lastClaim: number;
  autoDeployed: boolean;
  targetProtocol: string;
  totalEarned: number;
  referrer: string | null;
}

export interface GlobalStats {
  totalLiquidityBridged: number;
  totalRewardsDistributed: number;
  totalUsers: number;
}

export interface LeaderboardEntry {
  user: string;
  amountBridged: number;
  totalRewards: number;
}

// Read user's bridge position from SUI blockchain
export async function getUserPosition(userAddress: string): Promise<UserPosition | null> {
  try {
    // Check if contracts are deployed
    if (!BRIDGE_REGISTRY_PACKAGE || !BRIDGE_REGISTRY_OBJECT) {
      console.warn('SUI contracts not deployed. Please deploy Move contracts and update .env');
      return null;
    }

    // Call the get_user_position function on the bridge registry
    const tx = new Transaction();
    tx.moveCall({
      target: `${BRIDGE_REGISTRY_PACKAGE}::bridge_registry::get_user_position`,
      arguments: [
        tx.object(BRIDGE_REGISTRY_OBJECT),
        tx.pure(userAddress, 'address'),
      ],
    });

    const result = await suiClient.devInspectTransaction({
      transactionBlock: tx,
      sender: userAddress,
    });

    if (!result.results || result.results.length === 0) {
      return null;
    }

    // Parse the return values (total_bridged, unclaimed_rewards, total_earned, reward_multiplier, auto_deployed, target_protocol)
    const returnValues = result.results[0].returnValues;
    if (!returnValues || returnValues.length < 6) {
      return null;
    }

    // Decode the values (assuming they're in the correct order)
    const totalBridged = Number(returnValues[0][0]) / 1_000_000; // Convert from microunits
    const unclaimedRewards = Number(returnValues[1][0]) / 1_000_000;
    const totalEarned = Number(returnValues[2][0]) / 1_000_000;
    const rewardMultiplier = Number(returnValues[3][0]) / 10000; // Convert from basis points
    const autoDeployed = Boolean(returnValues[4][0]);
    const targetProtocol = new TextDecoder().decode(new Uint8Array(returnValues[5][0]));

    return {
      totalBridged,
      rewardMultiplier,
      unclaimedRewards,
      lastClaim: 0, // Not returned by contract, can be fetched from events if needed
      autoDeployed,
      targetProtocol,
      totalEarned,
      referrer: null, // Not returned by contract
    };
  } catch (error) {
    console.error('Error fetching user position:', error);
    return null;
  }
}

// Read global statistics from SUI blockchain
export async function getGlobalStats(): Promise<GlobalStats> {
  try {
    // Check if contracts are deployed
    if (!BRIDGE_REGISTRY_PACKAGE || !BRIDGE_REGISTRY_OBJECT) {
      console.warn('SUI contracts not deployed. Returning mock data.');
      return {
        totalLiquidityBridged: 0,
        totalRewardsDistributed: 0,
        totalUsers: 0,
      };
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${BRIDGE_REGISTRY_PACKAGE}::bridge_registry::get_global_stats`,
      arguments: [tx.object(BRIDGE_REGISTRY_OBJECT)],
    });

    // Use a dummy address for dev inspect
    const dummyAddress = '0x0000000000000000000000000000000000000000000000000000000000000000';
    const result = await suiClient.devInspectTransaction({
      transactionBlock: tx,
      sender: dummyAddress,
    });

    if (!result.results || result.results.length === 0) {
      throw new Error('No results returned');
    }

    const returnValues = result.results[0].returnValues;
    if (!returnValues || returnValues.length < 3) {
      throw new Error('Invalid return values');
    }

    return {
      totalLiquidityBridged: Number(returnValues[0][0]) / 1_000_000,
      totalRewardsDistributed: Number(returnValues[1][0]) / 1_000_000,
      totalUsers: Number(returnValues[2][0]),
    };
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return {
      totalLiquidityBridged: 0,
      totalRewardsDistributed: 0,
      totalUsers: 0,
    };
  }
}

// Read leaderboard entry by rank (placeholder - leaderboard not yet implemented in contract)
export async function getLeaderboardRank(rank: number): Promise<LeaderboardEntry | null> {
  // TODO: Implement leaderboard query when contract supports it
  // For now, return mock data
  return null;
}

// Prepare register-bridge transaction for SUI
export function prepareRegisterBridgeTransaction(
  amount: number, // in USDC
  ethTxHash: string,
  autoDeploy: boolean,
  targetProtocol: string,
  referrerAddress?: string
): Transaction {
  const tx = new Transaction();
  
  // Convert amount to microunits (6 decimals)
  const amountMicro = Math.floor(amount * 1_000_000);
  
  // Convert eth tx hash to vector<u8>
  const txHashBytes = Array.from(Buffer.from(ethTxHash.replace('0x', ''), 'hex'));
  
  // Convert target protocol to vector<u8>
  const protocolBytes = Array.from(new TextEncoder().encode(targetProtocol));

  tx.moveCall({
    target: `${BRIDGE_REGISTRY_PACKAGE}::bridge_registry::register_bridge`,
    arguments: [
      tx.object(BRIDGE_REGISTRY_OBJECT),
      tx.pure(amountMicro, 'u64'),
      tx.pure(txHashBytes, 'vector<u8>'),
      tx.pure(autoDeploy, 'bool'),
      tx.pure(protocolBytes, 'vector<u8>'),
      referrerAddress ? tx.pure([referrerAddress], 'vector<address>') : tx.pure([], 'vector<address>'),
      tx.object('0x6'), // Clock object
    ],
  });

  return tx;
}

// Prepare claim-rewards transaction for SUI
export function prepareClaimRewardsTransaction(): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${BRIDGE_REGISTRY_PACKAGE}::bridge_registry::claim_rewards`,
    arguments: [
      tx.object(BRIDGE_REGISTRY_OBJECT),
      tx.object('0x6'), // Clock object
    ],
  });

  return tx;
}

// Polling helper for waiting for SUI transaction confirmation
export async function waitForTransactionConfirmation(
  digest: string,
  maxAttempts: number = 30,
  delayMs: number = 2000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const txResponse = await suiClient.getTransaction({
        digest,
        options: { showEffects: true },
      });
      
      if (txResponse.effects?.status.status === 'success') {
        return true;
      } else if (txResponse.effects?.status.status === 'failure') {
        console.error('Transaction failed:', txResponse.effects.status.error);
        return false;
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  return false;
}

// Format SUI address for display
export function formatContractAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

// Get SUI contract explorer URL
export function getContractExplorerUrl(): string {
  const network = LIQUIDX_CONFIG.SUI_NETWORK === 'mainnet' ? '' : 'testnet.';
  return `https://${network}suivision.xyz/package/${BRIDGE_REGISTRY_PACKAGE}`;
}

// Get SUI transaction explorer URL
export function getTxExplorerUrl(digest: string): string {
  const network = LIQUIDX_CONFIG.SUI_NETWORK === 'mainnet' ? '' : 'testnet.';
  return `https://${network}suivision.xyz/txblock/${digest}`;
}
