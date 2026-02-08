/**
 * Demo Mode Configuration
 * Enables seamless demo experience with wallet connections but simulated transactions
 */

export const DEMO_MODE = {
  enabled: import.meta.env.VITE_DEMO_MODE === 'true',
  requireWallet: true, // Set to true to require wallet connection
  simulateTransactions: true, // Simulate blockchain transactions
  useMockBalances: false, // Set to true to override real balances with mock data
};

export const DEMO_USER = {
  ethAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  suiAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  ethBalance: '2.5',
  usdcBalance: '10000.00',
};

export const DEMO_STATS = {
  totalLiquidityBridged: 2547892,
  totalRewardsDistributed: 76436,
  totalUsers: 1203,
  averageAPY: 16.2,
};

export const DEMO_USER_POSITION = {
  totalBridged: 15000,
  rewardMultiplier: 1.5,
  unclaimedRewards: 450.75,
  totalEarned: 987.50,
  lastClaim: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  autoDeployed: true,
  targetProtocol: 'Cetus USDC Pool',
  referrer: null,
};

export function isDemoMode(): boolean {
  return DEMO_MODE.enabled || window.location.search.includes('demo=true');
}

export function shouldSimulateTransactions(): boolean {
  return isDemoMode() && DEMO_MODE.simulateTransactions;
}

export function shouldUseMockBalances(): boolean {
  return isDemoMode() && DEMO_MODE.useMockBalances;
}

export function requiresWalletConnection(): boolean {
  return !isDemoMode() || DEMO_MODE.requireWallet;
}

export function simulateTransaction(duration = 2000): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
      resolve(mockTxHash);
    }, duration);
  });
}

export function getDemoBalance(realBalance: string, type: 'eth' | 'usdc'): string {
  if (shouldUseMockBalances()) {
    return type === 'eth' ? DEMO_USER.ethBalance : DEMO_USER.usdcBalance;
  }
  return realBalance;
}
