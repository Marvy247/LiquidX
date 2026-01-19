import { useState } from "react";
import { useBridge } from "@/hooks/useBridge";
import { ConnectWalletButton } from "@/components/bridge/ConnectWalletButton";
import { OpportunityScanner } from "@/components/liquidx/OpportunityScanner";
import { EnhancedBridgeForm } from "@/components/liquidx/EnhancedBridgeForm";
import { RewardsDashboard } from "@/components/liquidx/RewardsDashboard";
import { Leaderboard } from "@/components/liquidx/Leaderboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowRightLeft,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { formatCurrency } from "@/services/apy-scanner";
import type { OpportunityAlert } from "@/services/apy-scanner";

const LiquidX = () => {
  const {
    isConnected: isEthConnected,
    address: ethAddress,
    ethBalance,
    usdcBalance,
    approveUSDC,
    depositToStacks,
  } = useBridge();

  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityAlert | undefined>();
  const [bridgeAmount, setBridgeAmount] = useState<number>(5000);

  // Mock global stats - replace with actual contract calls
  const globalStats = {
    totalLiquidityBridged: 2547892,
    totalRewardsDistributed: 76436,
    totalUsers: 1203,
    averageAPY: 16.2,
  };

  const handleClaimRewards = async () => {
    // TODO: Implement actual claim rewards contract call
    console.log("Claiming rewards...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg glow-orange">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gradient-bitcoin tracking-tight">
                    LiquidX
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Earn While Bridging to Stacks
                  </p>
                </div>
                <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none animate-pulse">
                  🔥 2x Rewards Active
                </Badge>
              </div>
              
              <ConnectWalletButton />
            </div>
          </div>
        </header>

        {/* Global Stats Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-yellow-500/10 to-orange-500/10 border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Total Bridged</span>
                </div>
                <div className="text-3xl font-bold text-gradient-bitcoin">
                  {formatCurrency(globalStats.totalLiquidityBridged)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">USDCx on Stacks</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Rewards Paid</span>
                </div>
                <div className="text-3xl font-bold text-gradient-bitcoin">
                  {globalStats.totalRewardsDistributed.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">$LOS Tokens</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Active Users</span>
                </div>
                <div className="text-3xl font-bold text-gradient-bitcoin">
                  {globalStats.totalUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Liquidity Providers</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Avg APY</span>
                </div>
                <div className="text-3xl font-bold text-gradient-bitcoin">
                  {globalStats.averageAPY}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">With Bonuses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            {!isEthConnected && (
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold mb-4">
                  <span className="text-gradient-bitcoin">Earn While You Bridge</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Bridge USDC from Ethereum to Stacks and earn $LQX rewards. 
                  Auto-deploy to the highest yields. Climb the leaderboard. Get paid.
                </p>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Badge className="text-base px-4 py-2 bg-green-500/10 text-green-500 border-green-500/30">
                    ✅ Powered by Circle xReserve
                  </Badge>
                  <Badge className="text-base px-4 py-2 bg-primary/10 text-primary border-primary/30">
                    🎁 Up to 3x Rewards Multiplier
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

              <TabsContent value="bridge" className="space-y-8">
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
                      usdcBalance={usdcBalance}
                      ethBalance={ethBalance}
                      onApprove={approveUSDC}
                      onDeposit={depositToStacks}
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
                          Transfer USDC from Ethereum to Stacks via Circle's xReserve protocol
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">2</span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">Auto-Deploy & Earn</h4>
                        <p className="text-sm text-muted-foreground">
                          Automatically enter the highest-yield DeFi protocols on Stacks
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

              <TabsContent value="rewards" className="space-y-8">
                {isEthConnected && ethAddress && (
                  <RewardsDashboard
                    userAddress={ethAddress}
                    onClaimRewards={handleClaimRewards}
                  />
                )}
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-8">
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
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <p className="text-sm text-muted-foreground">
                  Powered by{" "}
                  <a
                    href="https://www.circle.com/en/xreserve"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Circle xReserve
                  </a>
                  {" "}+{" "}
                  <a
                    href="https://www.stacks.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Stacks
                  </a>
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>Network: Ethereum Sepolia ↔ Stacks Testnet</span>
                <span>•</span>
                <span>Built for USDCx Hackathon 2026</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LiquidX;
