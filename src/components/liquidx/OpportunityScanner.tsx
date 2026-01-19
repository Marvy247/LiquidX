import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Zap, Shield, DollarSign, RefreshCw } from "lucide-react";
import { 
  apyScanner, 
  formatAPY, 
  formatCurrency, 
  formatTVL, 
  getRiskLabel,
  type OpportunityAlert 
} from "@/services/apy-scanner";

interface OpportunityScannerProps {
  amount: number;
  onSelectOpportunity: (opportunity: OpportunityAlert) => void;
}

export function OpportunityScanner({ amount, onSelectOpportunity }: OpportunityScannerProps) {
  const [opportunities, setOpportunities] = useState<OpportunityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const ops = await apyScanner.scanOpportunities(amount);
      setOpportunities(ops);
      setLastUpdate(apyScanner.getTimeSinceUpdate());
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchOpportunities();
    }, 30000);

    return () => clearInterval(interval);
  }, [amount]);

  // Update "time since" every second
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(apyScanner.getTimeSinceUpdate());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading && opportunities.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-lg text-muted-foreground">Scanning opportunities...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hottest = opportunities[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Live Opportunities
          </h2>
          <p className="text-sm text-muted-foreground">
            Updated {lastUpdate} • Auto-refreshes every 30s
          </p>
        </div>
        <Button
          onClick={fetchOpportunities}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Hottest Deal Card */}
      {hottest && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-red-500/10 to-background border-orange-500/30 glow-orange">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl" />
          
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
                    🔥 HOTTEST DEAL
                  </Badge>
                  <Badge variant="outline" className={getRiskLabel(hottest.riskScore).color}>
                    {getRiskLabel(hottest.riskScore).label} Risk
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-1">{hottest.protocolName}</CardTitle>
                <CardDescription>{hottest.protocol.category.toUpperCase()} • {formatTVL(hottest.tvl)} TVL</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-gradient-bitcoin">
                  {formatAPY(hottest.totalAPY)}
                </div>
                <p className="text-xs text-muted-foreground">Total APY</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* APY Breakdown */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-xl border border-border/50">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Stacks APY</div>
                <div className="text-xl font-bold text-foreground">{formatAPY(hottest.stacksAPY)}</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-sm text-muted-foreground mb-1">Bridge Bonus</div>
                <div className="text-xl font-bold text-green-500">+{formatAPY(hottest.bridgeBonus)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">vs. Ethereum</div>
                <div className="text-xl font-bold text-orange-500">+{formatAPY(hottest.spread)}</div>
              </div>
            </div>

            {/* Earnings Projection */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-foreground">Your Earnings Projection</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Daily</p>
                  <p className="text-lg font-bold text-green-500">{formatCurrency(hottest.estimatedEarnings.daily)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                  <p className="text-lg font-bold text-green-500">{formatCurrency(hottest.estimatedEarnings.monthly)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Yearly</p>
                  <p className="text-lg font-bold text-green-500">{formatCurrency(hottest.estimatedEarnings.yearly)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Based on {formatCurrency(amount)} USDCx deposit
              </p>
            </div>

            {/* CTA */}
            <Button 
              onClick={() => onSelectOpportunity(hottest)}
              className="w-full gradient-bitcoin text-primary-foreground font-semibold text-lg py-6 rounded-xl glow-orange hover:opacity-90 transition-opacity"
            >
              <Zap className="w-5 h-5 mr-2" />
              Bridge & Auto-Deploy Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              🎁 Early Bird: 2x rewards for the next 23 hours
            </p>
          </CardContent>
        </Card>
      )}

      {/* Other Opportunities */}
      {opportunities.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">More Opportunities</h3>
          {opportunities.slice(1, 4).map((opp, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onSelectOpportunity(opp)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{opp.protocolName}</h4>
                      <Badge variant="outline" className={`text-xs ${getRiskLabel(opp.riskScore).color}`}>
                        {getRiskLabel(opp.riskScore).label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Stacks: </span>
                        <span className="font-medium text-foreground">{formatAPY(opp.stacksAPY)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bonus: </span>
                        <span className="font-medium text-green-500">+{formatAPY(opp.bridgeBonus)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">TVL: </span>
                        <span className="font-medium text-foreground">{formatTVL(opp.tvl)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-gradient-bitcoin">{formatAPY(opp.totalAPY)}</div>
                    <p className="text-xs text-muted-foreground">Total APY</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No opportunities message */}
      {opportunities.length === 0 && !isLoading && (
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No opportunities found at the moment</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your deposit amount or check back later
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
