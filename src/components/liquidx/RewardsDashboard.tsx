import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  TrendingUp, 
  Award, 
  Clock, 
  Zap, 
  Users, 
  DollarSign,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { formatCurrency } from "@/services/apy-scanner";
import { toast } from "sonner";

interface UserRewards {
  totalBridged: number;
  rewardMultiplier: number;
  unclaimedRewards: number;
  totalEarned: number;
  lastClaim: Date;
  autoDeployed: boolean;
  targetProtocol: string;
  leaderboardRank: number;
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
}

interface RewardsDashboardProps {
  userAddress: string;
  onClaimRewards: () => Promise<void>;
}

export function RewardsDashboard({ userAddress, onClaimRewards }: RewardsDashboardProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);

  // Mock data - replace with actual contract calls
  const rewards: UserRewards = {
    totalBridged: 12500,
    rewardMultiplier: 1.5,
    unclaimedRewards: 450.75,
    totalEarned: 987.50,
    lastClaim: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    autoDeployed: true,
    targetProtocol: "ALEX USDCx-STX Pool",
    leaderboardRank: 47,
    referralCode: `LOS-${userAddress.slice(-6).toUpperCase()}`,
    referralCount: 3,
    referralEarnings: 87.25,
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await onClaimRewards();
      toast.success(`🎉 Claimed ${rewards.unclaimedRewards.toFixed(2)} $LOS tokens!`);
    } catch (error) {
      toast.error("Failed to claim rewards");
    } finally {
      setIsClaiming(false);
    }
  };

  const copyReferralCode = () => {
    const referralLink = `https://liquidityos.app?ref=${rewards.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setReferralCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const daysUntilFullVest = 90 - Math.floor((Date.now() - rewards.lastClaim.getTime()) / (1000 * 60 * 60 * 24));
  const vestingProgress = Math.min(100, ((90 - daysUntilFullVest) / 90) * 100);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Unclaimed Rewards */}
        <Card className="bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-background border-yellow-500/30 glow-orange">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-yellow-500" />
              </div>
              <Badge className="bg-yellow-500 text-white border-none">Claimable</Badge>
            </div>
            <div className="text-3xl font-bold text-gradient-bitcoin mb-1">
              {rewards.unclaimedRewards.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">$LQX Tokens</p>
            <Button 
              onClick={handleClaim}
              disabled={isClaiming || rewards.unclaimedRewards === 0}
              className="w-full mt-4 gradient-bitcoin text-primary-foreground font-semibold"
            >
              {isClaiming ? "Claiming..." : "Claim Rewards"}
            </Button>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <Badge variant="outline" className="text-green-500">Lifetime</Badge>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {rewards.totalEarned.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">$LQX Earned</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                ≈ {formatCurrency(rewards.totalEarned * 0.5)} USD
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Rank */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              {rewards.leaderboardRank <= 10 && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
                  Top 10 🏆
                </Badge>
              )}
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              #{rewards.leaderboardRank}
            </div>
            <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              {rewards.rewardMultiplier}x Multiplier
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bridge Stats */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Bridge Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Bridged */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Total Bridged</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(rewards.totalBridged)} USDCx
              </span>
            </div>
            <Progress value={(rewards.totalBridged / 50000) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(50000 - rewards.totalBridged)} more to reach 3x multiplier
            </p>
          </div>

          {/* Current Deployment */}
          {rewards.autoDeployed && (
            <div className="bg-secondary rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Deployed To</span>
                <Badge variant="outline" className="text-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{rewards.targetProtocol}</span>
                <a 
                  href="#" 
                  className="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Vesting Status */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Vesting Progress
              </span>
              <span className="font-semibold text-foreground">
                {daysUntilFullVest} days remaining
              </span>
            </div>
            <Progress value={vestingProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Rewards vest over 90 days to keep liquidity on Stacks
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-secondary rounded-xl">
              <div className="text-3xl font-bold text-gradient-bitcoin mb-1">
                {rewards.referralCount}
              </div>
              <p className="text-sm text-muted-foreground">Referrals</p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-xl">
              <div className="text-3xl font-bold text-gradient-bitcoin mb-1">
                {rewards.referralEarnings.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">$LOS Earned</p>
            </div>
          </div>

          <div className="bg-secondary rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-background rounded border border-border font-mono text-sm">
                {rewards.referralCode}
              </code>
              <Button 
                onClick={copyReferralCode}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {referralCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💰 Earn 10% of your referrals' rewards
            </p>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
            <p className="text-sm text-foreground font-medium mb-2">
              🎁 Bonus: Both you and your referrals get +10% rewards!
            </p>
            <p className="text-xs text-muted-foreground">
              Share your link with friends to multiply your earnings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Multiplier Tiers */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Reward Multipliers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { tier: "1.0x", min: 0, max: 1000, active: rewards.totalBridged < 1000 },
              { tier: "1.5x", min: 1000, max: 10000, active: rewards.totalBridged >= 1000 && rewards.totalBridged < 10000 },
              { tier: "2.0x", min: 10000, max: 50000, active: rewards.totalBridged >= 10000 && rewards.totalBridged < 50000 },
              { tier: "3.0x", min: 50000, max: Infinity, active: rewards.totalBridged >= 50000 },
            ].map((tier, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border-2 ${
                  tier.active 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-secondary border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-2xl font-bold ${tier.active ? 'text-gradient-bitcoin' : 'text-muted-foreground'}`}>
                      {tier.tier}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatCurrency(tier.min)} - {tier.max === Infinity ? '∞' : formatCurrency(tier.max)}
                    </p>
                  </div>
                  {tier.active && (
                    <Badge className="bg-primary text-primary-foreground">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
