// LiquidX Configuration
// Deployed Smart Contracts and Constants

export const LIQUIDX_CONFIG = {
  // SUI Network Configuration
  SUI_NETWORK: (import.meta.env.VITE_SUI_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  
  // Move Package IDs (Set after deployment)
  // NOTE: These are placeholder values. Deploy Move contracts and update .env file
  BRIDGE_REGISTRY_PACKAGE: import.meta.env.VITE_BRIDGE_REGISTRY_PACKAGE || '',
  LQX_TOKEN_PACKAGE: import.meta.env.VITE_LQX_TOKEN_PACKAGE || '',
  
  // Shared Object IDs
  BRIDGE_REGISTRY_OBJECT: import.meta.env.VITE_BRIDGE_REGISTRY_OBJECT || '',

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

  // Wormhole Bridge Configuration
  BRIDGE: {
    WORMHOLE_CONTRACT: import.meta.env.VITE_WORMHOLE_CONTRACT || "0x0",
    ETH_USDC_CONTRACT: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const,
    ETH_RPC_URL: "https://ethereum-sepolia.publicnode.com",
    CHAIN_ID: 11155111, // Sepolia
    SUI_CHAIN_ID: 21, // Wormhole SUI chain ID
  },

  // USDC on SUI
  USDC_SUI: {
    type: import.meta.env.VITE_USDC_TYPE || '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
    decimals: 6,
  },

  // Approved DeFi Protocols on SUI (MVP: Top 3)
  PROTOCOLS: {
    cetus: {
      name: 'Cetus DEX',
      packageId: '0x0', // Set after deployment
      category: 'liquidity',
      riskScore: 7,
      description: 'Concentrated liquidity AMM on SUI',
      estimatedAPY: 18.0,
    },
    turbos: {
      name: 'Turbos Finance',
      packageId: '0x0', // Set after deployment
      category: 'leverage',
      riskScore: 8,
      description: 'Leveraged yield farming',
      estimatedAPY: 22.5,
    },
    scallop: {
      name: 'Scallop',
      packageId: '0x0', // Set after deployment
      category: 'lending',
      riskScore: 6,
      description: 'Lending and borrowing platform',
      estimatedAPY: 14.5,
    },
  },

  // Network URLs
  NETWORK: {
    name: 'testnet' as 'testnet' | 'mainnet',
    rpcUrl: 'https://fullnode.testnet.sui.io:443',
    explorerUrl: 'https://testnet.suivision.xyz',
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
  explorer: `${LIQUIDX_CONFIG.NETWORK.explorerUrl}/package/${LIQUIDX_CONFIG.BRIDGE_REGISTRY_PACKAGE}`,
  bridgeRegistry: `${LIQUIDX_CONFIG.NETWORK.explorerUrl}/object/${LIQUIDX_CONFIG.BRIDGE_REGISTRY_OBJECT}`,
};
