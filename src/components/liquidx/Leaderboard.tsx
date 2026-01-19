import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, Zap } from "lucide-react";
import { formatCurrency } from "@/services/apy-scanner";

interface LeaderboardEntry {
  rank: number;
  address: string;
  totalBridged: number;
  totalRewards: number;
  multiplier: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  userAddress?: string;
}

export function Leaderboard({ userAddress }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual contract calls
    const mockEntries: LeaderboardEntry[] = [
      {
        rank: 1,
        address: "SP2F70QJ9J57YSSZE76KC1A3X718ADXSZPG8581EP",
        totalBridged: 500000,
        totalRewards: 15000,
        multiplier: 3.0,
      },
      {
        rank: 2,
        address: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
        totalBridged: 250000,
        totalRewards: 7500,
        multiplier: 2.5,
      },
      {
        rank: 3,
        address: "SP1Z92MPDQEWZXW36VX71Q25HKF5K2EPCJ304F275",
        totalBridged: 150000,
        totalRewards: 4500,
        multiplier: 2.0,
      },
      {
        rank: 4,
        address: "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C",
        totalBridged: 100000,
        totalRewards: 3000,
        multiplier: 2.0,
      },
      {
        rank: 5,
        address: "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
        totalBridged: 75000,
        totalRewards: 2250,
        multiplier: 2.0,
      },
      {
        rank: 6,
        address: "SPSCWDV3RKV5ZRN1FQD84YE1NQFEDJ9R1F4DYQ11",
        totalBridged: 50000,
        totalRewards: 1500,
        multiplier: 2.0,
      },
      {
        rank: 7,
        address: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE",
        totalBridged: 40000,
        totalRewards: 1200,
        multiplier: 1.5,
      },
      {
        rank: 8,
        address: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
        totalBridged: 35000,
        totalRewards: 1050,
        multiplier: 1.5,
      },
      {
        rank: 9,
        address: "SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2SFMN",
        totalBridged: 30000,
        totalRewards: 900,
        multiplier: 1.5,
      },
      {
        rank: 10,
        address: "SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        totalBridged: 25000,
        totalRewards: 750,
        multiplier: 1.5,
      },
    ];

    // Mark current user
    const withCurrentUser = mockEntries.map(entry => ({
      ...entry,
      isCurrentUser: userAddress && entry.address === userAddress,
    }));

    setEntries(withCurrentUser);
    setIsLoading(false);
  }, [userAddress]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <Award className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">
            🥇 Champion
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white border-none">
            🥈 Runner-up
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-gradient-to-r from-orange-600 to-orange-800 text-white border-none">
            🥉 Third Place
          </Badge>
        );
      default:
        return null;
    }
  };

  const getInitials = (address: string) => {
    return address.slice(0, 2).toUpperCase();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-muted-foreground">Loading leaderboard...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Liquidity Leaderboard
            </CardTitle>
            <CardDescription>Top liquidity providers on LiquidityOS</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gradient-bitcoin">
              {entries.reduce((sum, e) => sum + e.totalBridged, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Bridged (USDCx)</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 rounded-xl border-2 transition-all ${
                entry.isCurrentUser
                  ? 'bg-primary/10 border-primary glow-primary'
                  : entry.rank <= 3
                  ? 'bg-secondary border-border'
                  : 'bg-background border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <Avatar className="w-12 h-12 border-2 border-border">
                  <AvatarFallback className={entry.rank <= 3 ? 'bg-gradient-to-br from-primary/20 to-primary/10' : 'bg-secondary'}>
                    {getInitials(entry.address)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono text-foreground font-semibold">
                      {formatAddress(entry.address)}
                    </code>
                    {entry.isCurrentUser && (
                      <Badge variant="outline" className="text-primary">
                        You
                      </Badge>
                    )}
                    {getRankBadge(entry.rank)}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {formatCurrency(entry.totalBridged)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-foreground font-medium">
                        {entry.multiplier}x
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="text-right">
                  <div className="text-xl font-bold text-gradient-bitcoin">
                    {entry.totalRewards.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">$LQX</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <p className="text-sm text-foreground font-medium mb-2">
            💰 Bridge more to climb the ranks and unlock higher multipliers!
          </p>
          <p className="text-xs text-muted-foreground">
            Top 10 liquidity providers get exclusive perks and bonuses
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
