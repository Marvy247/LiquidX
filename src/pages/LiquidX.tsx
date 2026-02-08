import { useState, useEffect } from "react";
import { useBridge } from "@/hooks/useBridge";
import { ConnectWalletButton } from "@/components/bridge/ConnectWalletButton";
import { OpportunityScanner } from "@/components/liquidx/OpportunityScanner";
import { EnhancedBridgeForm } from "@/components/liquidx/EnhancedBridgeForm";
import { RewardsDashboard } from "@/components/liquidx/RewardsDashboard";
import { Leaderboard } from "@/components/liquidx/Leaderboard";
import { OnboardingTutorial } from "@/components/liquidx/OnboardingTutorial";
import { GlobalStatsSkeleton } from "@/components/liquidx/LoadingSkeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRightLeft,
  ExternalLink
} from "lucide-react";
import { LogoInline } from "@/components/Logo";
import { getGlobalStats } from "@/services/contract-service";
import { formatCurrency } from "@/services/apy-scanner";
import { isDemoMode, DEMO_STATS, getDemoBalance } from "@/lib/demo-mode";
import type { OpportunityAlert } from "@/services/apy-scanner";

const LiquidX = () => {
  const demoMode = isDemoMode();
  
  const {
    isConnected: isEthConnected,
    address: ethAddress,
    ethBalance,
    usdcBalance,
    approveUSDC,
    depositToSui,
  } = useBridge();

  // In demo mode with wallet: use real wallet connection but demo balances (optional)
  const effectiveEthBalance = getDemoBalance(ethBalance, 'eth');
  const effectiveUsdcBalance = getDemoBalance(usdcBalance, 'usdc');

  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityAlert | undefined>();
  const [bridgeAmount, setBridgeAmount] = useState<number>(5000);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const [globalStats, setGlobalStats] = useState({
    totalLiquidityBridged: 0,
    totalRewardsDistributed: 0,
    totalUsers: 0,
    averageAPY: 16.2,
  });

  // Fetch global stats from contract
  useEffect(() => {
    async function fetchGlobalStats() {
      setIsLoadingStats(true);
      try {
        if (demoMode) {
          // Use demo stats
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
          setGlobalStats(DEMO_STATS);
        } else {
          const stats = await getGlobalStats();
          setGlobalStats({
            ...stats,
            averageAPY: 16.2, // Calculate from protocols
          });
        }
      } catch (error) {
        console.error('Failed to fetch global stats:', error);
        // Fallback to demo stats on error
        setGlobalStats(DEMO_STATS);
      } finally {
        setIsLoadingStats(false);
      }
    }

    fetchGlobalStats();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchGlobalStats, 60000);
    return () => clearInterval(interval);
  }, [demoMode]);

  const handleClaimRewards = async () => {
    // TODO: Implement actual claim rewards contract call
    console.log("Claiming rewards...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Onboarding Tutorial */}
      <OnboardingTutorial />
      
      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 py-2 animate-slide-down">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 font-medium">
              🎭 Demo Mode Active - Transactions are simulated (connect your wallet to see the full flow)
            </p>
          </div>
        </div>
      )}

      {/* Elegant Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ 
               backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }} 
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-md bg-background/95 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <LogoInline className="w-12 h-12" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight" style={{ 
                    background: 'linear-gradient(135deg, #000000 0%, #404040 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    LiquidX
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium">
                    Premium Bridge • Ethereum → SUI
                  </p>
                </div>
                <Badge className="ml-2 bg-black text-white border-none px-3 py-1">
                  <span className="text-xs font-semibold">LIVE</span>
                </Badge>
              </div>
              
              <ConnectWalletButton />
            </div>
          </div>
        </header>

        {/* Global Stats Banner */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-border">
          <div className="container mx-auto px-4 py-6">
            {isLoadingStats ? (
              <GlobalStatsSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-black" />
                    <span className="text-sm text-muted-foreground font-medium">Total Bridged</span>
                  </div>
                  <div className="text-3xl font-bold text-black">
                    {formatCurrency(globalStats.totalLiquidityBridged)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">USDCx on SUI</p>
                </div>

                <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-black" />
                    <span className="text-sm text-muted-foreground font-medium">Rewards Paid</span>
                  </div>
                  <div className="text-3xl font-bold text-black">
                    {globalStats.totalRewardsDistributed.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">$LQX Tokens</p>
                </div>

                <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-black" />
                    <span className="text-sm text-muted-foreground font-medium">Active Users</span>
                  </div>
                  <div className="text-3xl font-bold text-black">
                    {globalStats.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Liquidity Providers</p>
                </div>

                <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-black" />
                    <span className="text-sm text-muted-foreground font-medium">Avg APY</span>
                  </div>
                  <div className="text-3xl font-bold text-black">
                    {globalStats.averageAPY}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">With Bonuses</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            {!isEthConnected && (
              <div className="text-center mb-12 animate-slide-up">
                <h2 className="text-5xl font-bold mb-4 text-black">
                  Earn While You Bridge
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
                  Bridge USDC from Ethereum to SUI and earn $LQX rewards. 
                  Auto-deploy to the highest yields. Climb the leaderboard. Get paid.
                </p>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Badge className="text-sm px-4 py-2 bg-black text-white border-none font-medium">
                    Powered by Wormhole
                  </Badge>
                  <Badge className="text-sm px-4 py-2 bg-gray-100 text-black border border-gray-200 font-medium">
                    Up to 3x Rewards Multiplier
                  </Badge>
                </div>
              </div>
            )}

            <Tabs defaultValue="bridge" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-14">
                <TabsTrigger value="bridge" className="flex items-center gap-2 text-base">
                  <ArrowRightLeft className="w-5 h-5" />
                  Bridge & Earn
                </TabsTrigger>
                <TabsTrigger value="rewards" className="flex items-center gap-2 text-base" disabled={!isEthConnected}>
                  <Zap className="w-5 h-5" />
                  My Rewards
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="flex items-center gap-2 text-base">
                  <Users className="w-5 h-5" />
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bridge" className="space-y-8 animate-fade-in">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left: Opportunity Scanner */}
                  <div>
                    <OpportunityScanner
                      amount={bridgeAmount}
                      onSelectOpportunity={(opp) => {
                        setSelectedOpportunity(opp);
                        setBridgeAmount(5000); // Reset to default for the selected opportunity
                      }}
                    />
                  </div>

                  {/* Right: Bridge Form */}
                  <div className="space-y-6">
                    <EnhancedBridgeForm
                      isConnected={isEthConnected}
                      usdcBalance={effectiveUsdcBalance}
                      ethBalance={effectiveEthBalance}
                      onApprove={approveUSDC}
                      onDeposit={depositToSui}
                      selectedOpportunity={selectedOpportunity}
                    />

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <a
                        href="https://faucet.circle.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
                      >
                        <p className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                          Get Test USDC
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          Circle Faucet <ExternalLink className="w-3 h-3" />
                        </p>
                      </a>
                      <a
                        href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors group"
                      >
                        <p className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                          Get Test ETH
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          Sepolia Faucet <ExternalLink className="w-3 h-3" />
                        </p>
                      </a>
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                      How LiquidX Works
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">1</span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">Bridge USDC</h4>
                        <p className="text-sm text-muted-foreground">
                          Transfer USDC from Ethereum to SUI via Circle's xReserve protocol
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">2</span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">Auto-Deploy & Earn</h4>
                        <p className="text-sm text-muted-foreground">
                          Automatically enter the highest-yield DeFi protocols on SUI
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">3</span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">Get Rewarded</h4>
                        <p className="text-sm text-muted-foreground">
                          Earn $LQX tokens for bridging liquidity, climb the leaderboard, unlock multipliers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="space-y-8 animate-fade-in">
                {isEthConnected && ethAddress && (
                  <RewardsDashboard
                    userAddress={ethAddress}
                    onClaimRewards={handleClaimRewards}
                  />
                )}
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-8 animate-fade-in">
                <Leaderboard userAddress={ethAddress} />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8 mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-muted-foreground">
                  Powered by{" "}
                  <a
                    href="https://www.circle.com/en/xreserve"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Wormhole
                  </a>
                  {" "}+{" "}
                  <a
                    href="https://www.sui.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    SUI
                  </a>
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>Network: Ethereum Sepolia ↔ SUI Testnet</span>
                <span>•</span>
                <span>Built for The SUI Ecosystem</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LiquidX;
