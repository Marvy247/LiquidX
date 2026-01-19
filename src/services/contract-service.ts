// LiquidX Contract Service
// Handles all interactions with the deployed liquidity-rewards contract

import {
  cvToValue,
  standardPrincipalCV,
  uintCV,
  bufferCV,
  someCV,
  noneCV,
  stringAsciiCV,
  trueCV,
  falseCV,
  ClarityType,
  cvToString,
  deserializeCV,
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';
import { LIQUIDX_CONFIG } from '@/lib/liquidx-config';

// Use the testnet network constant
const network = STACKS_TESTNET;
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

// Read user's bridge position using Stacks API
export async function getUserPosition(userAddress: string): Promise<UserPosition | null> {
  try {
    const principalCV = standardPrincipalCV(userAddress);
    const principalHex = `0x${Buffer.from(cvToString(principalCV)).toString('hex')}`;
    
    const response = await fetch(
      `${STACKS_TESTNET.client.baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-user-position`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: userAddress,
          arguments: [principalHex],
        }),
      }
    );

    if (!response.ok) {
      console.error('API error:', await response.text());
      return null;
    }

    const data = await response.json();
    
    // Check if the result is an optional none
    if (!data.okay || data.result.startsWith('0x09')) { // 0x09 = none
      return null;
    }

    // Deserialize the Clarity value
    const resultCV = deserializeCV(Buffer.from(data.result.slice(2), 'hex'));
    const position = cvToValue(resultCV);
    
    if (!position || typeof position !== 'object') {
      return null;
    }

    return {
      totalBridged: Number(position['total-bridged'] || 0) / 1_000_000,
      rewardMultiplier: Number(position['reward-multiplier'] || 10000) / 10000,
      unclaimedRewards: Number(position['unclaimed-rewards'] || 0) / 1_000_000,
      lastClaim: Number(position['last-claim'] || 0),
      autoDeployed: Boolean(position['auto-deployed']),
      targetProtocol: String(position['target-protocol'] || ''),
      totalEarned: Number(position['total-earned'] || 0) / 1_000_000,
      referrer: position.referrer || null,
    };
  } catch (error) {
    console.error('Error fetching user position:', error);
    return null;
  }
}

// Read global statistics using Stacks API
export async function getGlobalStats(): Promise<GlobalStats> {
  try {
    const response = await fetch(
      `${STACKS_TESTNET.client.baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-global-stats`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: contractAddress,
          arguments: [],
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch global stats');
    }

    const data = await response.json();
    const resultCV = deserializeCV(Buffer.from(data.result.slice(2), 'hex'));
    const stats = cvToValue(resultCV);

    return {
      totalLiquidityBridged: Number(stats['total-liquidity-bridged'] || 0) / 1_000_000,
      totalRewardsDistributed: Number(stats['total-rewards-distributed'] || 0) / 1_000_000,
      totalUsers: Number(stats['total-users'] || 0),
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

// Read leaderboard entry by rank using Stacks API
export async function getLeaderboardRank(rank: number): Promise<LeaderboardEntry | null> {
  try {
    const rankCV = uintCV(rank);
    const rankHex = `0x${Buffer.from(cvToString(rankCV)).toString('hex')}`;
    
    const response = await fetch(
      `${STACKS_TESTNET.client.baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-leaderboard-rank`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: contractAddress,
          arguments: [rankHex],
        }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.okay || data.result.startsWith('0x09')) {
      return null;
    }

    const resultCV = deserializeCV(Buffer.from(data.result.slice(2), 'hex'));
    const entry = cvToValue(resultCV);

    return {
      user: String(entry.user || ''),
      amountBridged: Number(entry['amount-bridged'] || 0) / 1_000_000,
      totalRewards: Number(entry['total-rewards'] || 0) / 1_000_000,
    };
  } catch (error) {
    console.error('Error fetching leaderboard rank:', error);
    return null;
  }
}

// Get protocol information using Stacks API
export async function getProtocolInfo(protocolName: string): Promise<any> {
  try {
    const nameCV = stringAsciiCV(protocolName);
    const nameHex = `0x${Buffer.from(cvToString(nameCV)).toString('hex')}`;
    
    const response = await fetch(
      `${STACKS_TESTNET.client.baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-protocol`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: contractAddress,
          arguments: [nameHex],
        }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const resultCV = deserializeCV(Buffer.from(data.result.slice(2), 'hex'));
    return cvToValue(resultCV);
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
