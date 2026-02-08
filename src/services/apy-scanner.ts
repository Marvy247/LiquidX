// APY Comparison & Opportunity Scanner Service
// Compares yields across Ethereum and SUI to find arbitrage opportunities

export interface Protocol {
  name: string;
  chain: 'ethereum' | 'sui';
  apy: number;
  tvl: bigint;
  riskScore: number; // 1-10 (1=safest, 10=highest risk)
  contractAddress: string;
  category: 'lending' | 'liquidity' | 'leverage';
}

export interface OpportunityAlert {
  ethereumAPY: number;
  suiAPY: number;
  bridgeBonus: number;
  totalAPY: number;
  protocolName: string;
  protocol: Protocol;
  spread: number; // Difference in APY
  tvl: bigint;
  riskScore: number;
  estimatedEarnings: {
    daily: number;
    monthly: number;
    yearly: number;
  };
}

class APYScanner {
  private ethereumProtocols: Protocol[] = [];
  private suiProtocols: Protocol[] = [];
  private lastUpdate: Date = new Date();

  constructor() {
    this.initializeProtocols();
  }

  // Initialize known protocols with mock data (replace with real API calls)
  private initializeProtocols() {
    // Ethereum protocols (Sepolia testnet)
    this.ethereumProtocols = [
      {
        name: 'Aave V3',
        chain: 'ethereum',
        apy: 5.2,
        tvl: BigInt(1000000000), // $1B
        riskScore: 2,
        contractAddress: '0x...',
        category: 'lending',
      },
      {
        name: 'Compound V3',
        chain: 'ethereum',
        apy: 4.8,
        tvl: BigInt(500000000),
        riskScore: 2,
        contractAddress: '0x...',
        category: 'lending',
      },
      {
        name: 'Curve USDC Pool',
        chain: 'ethereum',
        apy: 3.5,
        tvl: BigInt(2000000000),
        riskScore: 1,
        contractAddress: '0x...',
        category: 'liquidity',
      },
    ];

    // SUI protocols (Testnet)
    this.suiProtocols = [
      {
        name: 'Cetus USDC-SUI Pool',
        chain: 'sui',
        apy: 18.0,
        tvl: BigInt(10000000), // $10M
        riskScore: 7,
        contractAddress: '0x0', // Set after deployment
        category: 'liquidity',
      },
      {
        name: 'Turbos Finance',
        chain: 'sui',
        apy: 22.5,
        tvl: BigInt(5000000),
        riskScore: 8,
        contractAddress: '0x0', // Set after deployment
        category: 'leverage',
      },
      {
        name: 'Scallop Lending',
        chain: 'sui',
        apy: 14.5,
        tvl: BigInt(8000000),
        riskScore: 6,
        contractAddress: '0x0', // Set after deployment
        category: 'lending',
      },
    ];
  }

  // Fetch real-time APYs from protocols (in production, call actual APIs)
  async fetchLiveAPYs(): Promise<void> {
    try {
      // Ethereum protocols - would call:
      // - Aave API: https://aave-api-v2.aave.com/data/rates
      // - Compound API: https://api.compound.finance/api/v2/ctoken
      // - DeFiLlama: https://yields.llama.fi/pools
      
      // SUI protocols - would call:
      // - Cetus API: https://api-sui.cetus.zone/v2/sui/pools
      // - Turbos Finance API
      // - Scallop API
      // - Or fetch on-chain data via SUI RPC

      // For now, simulate with random variations
      this.simulateLiveData();
      
      this.lastUpdate = new Date();
    } catch (error) {
      console.error('Failed to fetch live APYs:', error);
    }
  }

  // Simulate live data changes (remove in production)
  private simulateLiveData() {
    this.ethereumProtocols = this.ethereumProtocols.map(p => ({
      ...p,
      apy: p.apy + (Math.random() - 0.5) * 0.5, // ±0.25% variation
    }));

    this.suiProtocols = this.suiProtocols.map(p => ({
      ...p,
      apy: p.apy + (Math.random() - 0.5) * 2, // ±1% variation
    }));
  }

  // Calculate bridge bonus based on amount and protocol TVL
  private calculateBridgeBonus(amount: number, protocol: Protocol): number {
    // Base bridge bonus: 3% APY
    const basebonus = 3.0;
    
    // Early bird bonus (first 30 days of protocol launch): +1%
    const earlyBirdBonus = 1.0;
    
    // Large deposit bonus (>$10k): +0.5%
    const largeDepositBonus = amount >= 10000 ? 0.5 : 0;
    
    // Low TVL bonus (incentivize new protocols): up to +1%
    const tvlBonusMultiplier = Number(protocol.tvl) < 10000000 ? 1.0 : 0;
    
    return basebonus + earlyBirdBonus + largeDepositBonus + tvlBonusMultiplier;
  }

  // Calculate estimated earnings
  private calculateEarnings(amount: number, apy: number): {
    daily: number;
    monthly: number;
    yearly: number;
  } {
    const yearly = (amount * apy) / 100;
    const monthly = yearly / 12;
    const daily = yearly / 365;

    return { daily, monthly, yearly };
  }

  // Scan for arbitrage opportunities
  async scanOpportunities(amount: number = 5000): Promise<OpportunityAlert[]> {
    await this.fetchLiveAPYs();

    const bestEthAPY = Math.max(...this.ethereumProtocols.map(p => p.apy));
    
    const opportunities: OpportunityAlert[] = this.suiProtocols
      .filter(suiProtocol => {
        // Only show if SUI APY is significantly better (>2% spread)
        return suiProtocol.apy > bestEthAPY + 2;
      })
      .map(suiProtocol => {
        const bridgeBonus = this.calculateBridgeBonus(amount, suiProtocol);
        const totalAPY = suiProtocol.apy + bridgeBonus;
        const spread = suiProtocol.apy - bestEthAPY;

        return {
          ethereumAPY: bestEthAPY,
          suiAPY: suiProtocol.apy,
          bridgeBonus,
          totalAPY,
          protocolName: suiProtocol.name,
          protocol: suiProtocol,
          spread,
          tvl: suiProtocol.tvl,
          riskScore: suiProtocol.riskScore,
          estimatedEarnings: this.calculateEarnings(amount, totalAPY),
        };
      })
      .sort((a, b) => b.totalAPY - a.totalAPY); // Sort by highest total APY

    return opportunities;
  }

  // Get best opportunity
  async getBestOpportunity(amount: number = 5000): Promise<OpportunityAlert | null> {
    const opportunities = await this.scanOpportunities(amount);
    return opportunities.length > 0 ? opportunities[0] : null;
  }

  // Get all SUI protocols
  getSuiProtocols(): Protocol[] {
    return this.suiProtocols;
  }

  // Get all Ethereum protocols
  getEthereumProtocols(): Protocol[] {
    return this.ethereumProtocols;
  }

  // Get last update time
  getLastUpdate(): Date {
    return this.lastUpdate;
  }

  // Format time since last update
  getTimeSinceUpdate(): string {
    const seconds = Math.floor((Date.now() - this.lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }
}

// Singleton instance
export const apyScanner = new APYScanner();

// Helper function to format APY
export function formatAPY(apy: number | undefined): string {
  if (apy === undefined || apy === null || isNaN(apy)) {
    return '0.0%';
  }
  return `${apy.toFixed(1)}%`;
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Helper function to format large numbers (TVL)
export function formatTVL(tvl: bigint): string {
  const num = Number(tvl);
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num}`;
}

// Risk score to label
export function getRiskLabel(score: number): {
  label: string;
  color: string;
} {
  if (score <= 2) return { label: 'Very Low', color: 'text-green-500' };
  if (score <= 4) return { label: 'Low', color: 'text-blue-500' };
  if (score <= 6) return { label: 'Medium', color: 'text-yellow-500' };
  if (score <= 8) return { label: 'High', color: 'text-orange-500' };
  return { label: 'Very High', color: 'text-red-500' };
}
