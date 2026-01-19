// LiquidX Configuration
// Deployed Smart Contracts and Constants

export const LIQUIDX_CONFIG = {
  // LiquidX Rewards Contract (Deployed to Stacks Testnet)
  REWARDS_CONTRACT: {
    address: 'ST3Q4NCCEW1PGYRT6EV78HX8NZH07S1DXZG2SCP88',
    name: 'liquidity-rewards',
    fullAddress: 'ST3Q4NCCEW1PGYRT6EV78HX8NZH07S1DXZG2SCP88.liquidity-rewards',
  },

  // $LQX Token Details
  TOKEN: {
    name: 'LiquidX',
    symbol: 'LQX',
    decimals: 6,
  },

  // Reward Parameters
  REWARDS: {
    baseRate: 0.0075, // 0.75% base reward
    autoDeployBonus: 0.30, // 30% bonus for auto-deploy
    referralBonus: 0.10, // 10% bonus for referrals
  },

  // Multiplier Tiers (based on total bridged)
  MULTIPLIERS: {
    tier1: { min: 0, max: 1000, multiplier: 1.0 },
    tier2: { min: 1000, max: 10000, multiplier: 1.5 },
    tier3: { min: 10000, max: 50000, multiplier: 2.0 },
    tier4: { min: 50000, max: Infinity, multiplier: 3.0 },
  },

  // Existing Bridge Configuration (from BRIDGE_CONFIG)
  BRIDGE: {
    X_RESERVE_CONTRACT: "0x008888878f94C0d87defdf0B07f46B93C1934442" as const,
    ETH_USDC_CONTRACT: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const,
    STACKS_DOMAIN: 10003,
    ETH_RPC_URL: "https://ethereum-sepolia.publicnode.com",
    CHAIN_ID: 11155111, // Sepolia
  },

  // USDCx Contract on Stacks (Testnet)
  USDCX: {
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    name: 'usdcx',
    assetName: 'usdcx-token',
    fullAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx',
  },

  // Approved DeFi Protocols on Stacks
  PROTOCOLS: {
    alex: {
      name: 'ALEX USDCx-STX Pool',
      contractAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
      category: 'liquidity',
      riskScore: 5,
    },
    arkadiko: {
      name: 'Arkadiko Lending',
      contractAddress: 'SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11',
      category: 'lending',
      riskScore: 4,
    },
    stackswap: {
      name: 'Stackswap USDCx Pool',
      contractAddress: 'SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275',
      category: 'liquidity',
      riskScore: 6,
    },
    velar: {
      name: 'Velar Finance',
      contractAddress: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1',
      category: 'staking',
      riskScore: 5,
    },
  },

  // Network Configuration
  NETWORK: {
    name: 'testnet',
    stacksApi: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
  },

  // Vesting Period (in days)
  VESTING_PERIOD: 90,
} as const;

// Helper function to get multiplier for amount
export function getMultiplier(amount: number): number {
  const { MULTIPLIERS } = LIQUIDX_CONFIG;
  
  if (amount >= MULTIPLIERS.tier4.min) return MULTIPLIERS.tier4.multiplier;
  if (amount >= MULTIPLIERS.tier3.min) return MULTIPLIERS.tier3.multiplier;
  if (amount >= MULTIPLIERS.tier2.min) return MULTIPLIERS.tier2.multiplier;
  return MULTIPLIERS.tier1.multiplier;
}

// Helper function to calculate rewards
export function calculateRewards(
  amount: number,
  autoDeploy: boolean = false,
  hasReferral: boolean = false
): {
  baseRewards: number;
  autoDeployBonus: number;
  referralBonus: number;
  multiplier: number;
  totalRewards: number;
} {
  const { REWARDS } = LIQUIDX_CONFIG;
  
  const baseRewards = amount * REWARDS.baseRate;
  const autoDeployBonus = autoDeploy ? baseRewards * REWARDS.autoDeployBonus : 0;
  const referralBonus = hasReferral ? baseRewards * REWARDS.referralBonus : 0;
  const multiplier = getMultiplier(amount);
  const totalRewards = (baseRewards + autoDeployBonus + referralBonus) * multiplier;

  return {
    baseRewards,
    autoDeployBonus,
    referralBonus,
    multiplier,
    totalRewards,
  };
}

// Contract URLs
export const CONTRACT_URLS = {
  explorer: `${LIQUIDX_CONFIG.NETWORK.explorerUrl}/txid/${LIQUIDX_CONFIG.REWARDS_CONTRACT.fullAddress}?chain=testnet`,
  api: `${LIQUIDX_CONFIG.NETWORK.stacksApi}/v2/contracts/interface/${LIQUIDX_CONFIG.REWARDS_CONTRACT.fullAddress}`,
};
