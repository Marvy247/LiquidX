// LiquidX Contract Service
// Handles all interactions with the deployed liquidity-rewards contract

import {
  callReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV,
  bufferCV,
  someCV,
  noneCV,
  stringAsciiCV,
  trueCV,
  falseCV,
  ClarityType,
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { LIQUIDX_CONFIG } from '@/lib/liquidx-config';

const network = new StacksTestnet();
const { address: contractAddress, name: contractName } = LIQUIDX_CONFIG.REWARDS_CONTRACT;

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

// Read user's bridge position
export async function getUserPosition(userAddress: string): Promise<UserPosition | null> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-user-position',
      functionArgs: [standardPrincipalCV(userAddress)],
      network,
      senderAddress: userAddress,
    });

    const jsonResult = cvToJSON(result);
    
    // Check if user has a position
    if (jsonResult.type === ClarityType.OptionalNone) {
      return null;
    }

    const position = jsonResult.value.value;
    
    return {
      totalBridged: parseInt(position['total-bridged'].value) / 1_000_000, // Convert from microunits
      rewardMultiplier: parseInt(position['reward-multiplier'].value) / 10000, // Convert from basis points
      unclaimedRewards: parseInt(position['unclaimed-rewards'].value) / 1_000_000,
      lastClaim: parseInt(position['last-claim'].value),
      autoDeployed: position['auto-deployed'].value,
      targetProtocol: position['target-protocol'].value || '',
      totalEarned: parseInt(position['total-earned'].value) / 1_000_000,
      referrer: position.referrer.type === ClarityType.OptionalSome 
        ? position.referrer.value.value 
        : null,
    };
  } catch (error) {
    console.error('Error fetching user position:', error);
    return null;
  }
}

// Read global statistics
export async function getGlobalStats(): Promise<GlobalStats> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-global-stats',
      functionArgs: [],
      network,
      senderAddress: contractAddress,
    });

    const jsonResult = cvToJSON(result);
    const stats = jsonResult.value;

    return {
      totalLiquidityBridged: parseInt(stats['total-liquidity-bridged'].value) / 1_000_000,
      totalRewardsDistributed: parseInt(stats['total-rewards-distributed'].value) / 1_000_000,
      totalUsers: parseInt(stats['total-users'].value),
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

// Read leaderboard entry by rank
export async function getLeaderboardRank(rank: number): Promise<LeaderboardEntry | null> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-leaderboard-rank',
      functionArgs: [uintCV(rank)],
      network,
      senderAddress: contractAddress,
    });

    const jsonResult = cvToJSON(result);
    
    if (jsonResult.type === ClarityType.OptionalNone) {
      return null;
    }

    const entry = jsonResult.value.value;

    return {
      user: entry.user.value,
      amountBridged: parseInt(entry['amount-bridged'].value) / 1_000_000,
      totalRewards: parseInt(entry['total-rewards'].value) / 1_000_000,
    };
  } catch (error) {
    console.error('Error fetching leaderboard rank:', error);
    return null;
  }
}

// Get protocol information
export async function getProtocolInfo(protocolName: string): Promise<any> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-protocol',
      functionArgs: [stringAsciiCV(protocolName)],
      network,
      senderAddress: contractAddress,
    });

    return cvToJSON(result);
  } catch (error) {
    console.error('Error fetching protocol info:', error);
    return null;
  }
}

// Helper function to prepare register-bridge transaction data
// This prepares the data but doesn't submit - that's done via Stacks Connect
export function prepareRegisterBridgeTransaction(
  userAddress: string,
  amount: number, // in USDC (will be converted to microunits)
  ethTxHash: string,
  autoDeploy: boolean,
  targetProtocol: string,
  referrerAddress?: string
) {
  const functionArgs = [
    standardPrincipalCV(userAddress),
    uintCV(Math.floor(amount * 1_000_000)), // Convert to microunits
    bufferCV(Buffer.from(ethTxHash.replace('0x', ''), 'hex')),
    autoDeploy ? trueCV() : falseCV(),
    stringAsciiCV(targetProtocol),
    referrerAddress ? someCV(standardPrincipalCV(referrerAddress)) : noneCV(),
  ];

  return {
    contractAddress,
    contractName,
    functionName: 'register-bridge',
    functionArgs,
    network,
  };
}

// Helper function to prepare claim-rewards transaction data
export function prepareClaimRewardsTransaction() {
  return {
    contractAddress,
    contractName,
    functionName: 'claim-rewards',
    functionArgs: [],
    network,
  };
}

// Polling helper for waiting for transaction confirmation
export async function waitForTransactionConfirmation(
  txId: string,
  maxAttempts: number = 30,
  delayMs: number = 2000
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(
        `https://api.testnet.hiro.so/extended/v1/tx/${txId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.tx_status === 'success') {
          return true;
        } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
          console.error('Transaction failed:', data.tx_status);
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  return false;
}

// Format contract address for display
export function formatContractAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

// Get contract explorer URL
export function getContractExplorerUrl(): string {
  return `${LIQUIDX_CONFIG.NETWORK.explorerUrl}/txid/${contractAddress}.${contractName}?chain=testnet`;
}

// Get transaction explorer URL
export function getTxExplorerUrl(txId: string): string {
  return `${LIQUIDX_CONFIG.NETWORK.explorerUrl}/txid/${txId}?chain=testnet`;
}
