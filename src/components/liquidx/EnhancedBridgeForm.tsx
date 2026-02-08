import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowDown, Loader2, CheckCircle2, Zap, TrendingUp, Gift, Users, X, ExternalLink } from "lucide-react";
import { isValidSuiAddress } from "@/lib/sui-address";
import { toast } from "sonner";
import { formatAPY, formatCurrency, type OpportunityAlert } from "@/services/apy-scanner";
import { prepareRegisterBridgeTransaction, waitForTransactionConfirmation, getTxExplorerUrl } from "@/services/contract-service";
import { shouldSimulateTransactions, simulateTransaction } from "@/lib/demo-mode";
import { SuiWalletButton } from "@/components/bridge/SuiWalletButton";


interface EnhancedBridgeFormProps {
  isConnected: boolean;
  usdcBalance: string;
  ethBalance: string;
  onApprove: (amount: string) => Promise<string | null>;
  onDeposit: (amount: string, recipient: string) => Promise<string | null>;
  selectedOpportunity?: OpportunityAlert;
}

type DeploymentOption = 'hold' | 'auto-deploy';
type BridgeStep = 'input' | 'approving' | 'approved' | 'depositing' | 'complete';

export function EnhancedBridgeForm({
  isConnected,
  usdcBalance,
  ethBalance,
  onApprove,
  onDeposit,
  selectedOpportunity,
}: EnhancedBridgeFormProps) {
  const [amount, setAmount] = useState("");
  const [suiAddress, setSUIAddress] = useState("");
  const [deploymentOption, setDeploymentOption] = useState<DeploymentOption>('auto-deploy');
  const [referralCode, setReferralCode] = useState("");
  const [step, setStep] = useState<BridgeStep>('input');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [suiTxId, setSUITxId] = useState<string | null>(null);

  // Auto-fill amount if opportunity is selected
  useEffect(() => {
    if (selectedOpportunity && !amount) {
      setAmount("5000"); // Default amount
    }
  }, [selectedOpportunity]);

  const parsedAmount = parseFloat(amount) || 0;
  const balance = parseFloat(usdcBalance) || 0;
  const hasEnoughBalance = parsedAmount > 0 && parsedAmount <= balance;
  const isValidAddress = suiAddress ? isValidSuiAddress(suiAddress) : false;
  const canProceed = hasEnoughBalance && isValidAddress && parseFloat(ethBalance) > 0;

  // Calculate rewards
  const baseRewards = parsedAmount * 0.0075; // 0.75% base rewards ($LQX)
  const autoDeployBonus = deploymentOption === 'auto-deploy' ? baseRewards * 0.3 : 0; // 30% bonus
  const referralBonus = referralCode ? baseRewards * 0.1 : 0; // 10% bonus
  const totalRewards = baseRewards + autoDeployBonus + referralBonus;

  // Calculate multiplier tier
  const getMultiplier = (amount: number): string => {
    if (amount >= 50000) return "3.0x";
    if (amount >= 10000) return "2.0x";
    if (amount >= 1000) return "1.5x";
    return "1.0x";
  };

  const handleApprove = async () => {
    if (!canProceed) return;
    
    setStep('approving');
    try {
      let hash: string | null;
      
      if (shouldSimulateTransactions()) {
        // Simulate transaction in demo mode
        toast.info("🎭 Demo Mode: Simulating approval transaction...");
        hash = await simulateTransaction(2000);
      } else {
        // Real transaction
        hash = await onApprove(amount);
      }
      
      if (hash) {
        setStep('approved');
        toast.success("USDC approved! Ready to bridge.");
      }
    } catch (err) {
      const error = err as Error;
      setStep('input');
      toast.error(error.message || "Approval failed");
    }
  };

  const handleDeposit = async () => {
    if (!canProceed) return;
    
    setStep('depositing');
    try {
      let hash: string | null;
      
      if (shouldSimulateTransactions()) {
        // Simulate transaction in demo mode
        toast.info("🎭 Demo Mode: Simulating bridge transaction...");
        hash = await simulateTransaction(3000);
      } else {
        // Real transaction
        hash = await onDeposit(amount, suiAddress);
      }
      
      if (hash) {
        setTxHash(hash);
        setStep('complete');
        
        // Register bridge position with LiquidX contract
        try {
          if (shouldSimulateTransactions()) {
            // Simulate contract registration
            toast.info("🎭 Demo Mode: Simulating rewards registration...");
            const suiTx = await simulateTransaction(2000);
            setSUITxId(suiTx);
            toast.success("🎉 Bridge successful! $LQX rewards registered (simulated).");
          } else {
            // Real contract registration
            const suiTx = await registerBridgeWithContract(
              suiAddress,
              parsedAmount,
              hash,
              deploymentOption === 'auto-deploy',
              selectedOpportunity?.protocolName || 'Manual Deployment',
              referralCode || undefined
            );
            if (suiTx) {
              setSUITxId(suiTx);
            }
            toast.success("🎉 Bridge successful! $LQX rewards registered on-chain.");
          }
        } catch (contractError) {
          console.error('Failed to register with contract:', contractError);
          toast.warning("Bridge successful, but rewards registration pending. Please try again later.");
        }
      }
    } catch (err) {
      const error = err as Error;
      setStep('approved');
      toast.error(error.message || "Bridge failed");
    }
  };

  const handleReset = () => {
    setAmount("");
    setStep('input');
    setTxHash(null);
    setSuiTxId(null);
  };

  // Register bridge with LiquidX contract
  const registerBridgeWithContract = async (
    userAddress: string,
    amount: number,
    ethTxHash: string,
    autoDeploy: boolean,
    protocolName: string,
    referrer?: string
  ): Promise<string | null> => {
    try {
      const txData = prepareRegisterBridgeTransaction(
        userAddress,
        amount,
        ethTxHash,
        autoDeploy,
        protocolName,
        referrer
      );

      // Call contract via SUI Connect
      const response = await request('stx_callContract', {
        contract: `${txData.contractAddress}.${txData.contractName}`,
        functionName: txData.functionName,
        functionArgs: txData.functionArgs,
        network: 'testnet',
      });

      console.log('Contract registration TX:', response.txid);
      toast.info('Registering rewards on-chain...', { duration: 3000 });

      // Wait for confirmation (optional - can be done in background)
      const confirmed = await waitForTransactionConfirmation(response.txid, 15, 3000);
      
      if (confirmed) {
        console.log('Rewards registered successfully!');
      }

      return response.txid;
    } catch (error) {
      console.error('Contract registration failed:', error);
      throw error;
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6 text-center py-12">
          <p className="text-muted-foreground text-lg">
            Connect your Ethereum wallet to start
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete' && txHash) {
    return (
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={handleReset}
        >
          <X className="w-5 h-5" />
        </Button>
        <CardContent className="pt-6 text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">Bridge Complete!</h3>
          <p className="text-muted-foreground mb-4">
            {amount} USDC bridged to SUI
          </p>

          {/* Transaction Links */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-black hover:text-black/70 transition-colors underline underline-offset-4"
            >
              <span>View on Sepolia</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            {suiTxId && (
              <>
                <span className="text-muted-foreground">•</span>
                <a
                  href={`https://explorer.hiro.so/txid/${suiTxId}?chain=testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-black hover:text-black/70 transition-colors underline underline-offset-4"
                >
                  <span>View on SUI</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            )}
          </div>

          {/* Rewards Summary */}
          <div className="bg-background rounded-xl p-6 mb-6 space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift className="w-6 h-6 text-yellow-500" />
              <h4 className="text-xl font-bold text-foreground">Rewards Earned</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">$LQX Tokens</p>
                <p className="text-3xl font-bold text-gradient-bitcoin">{totalRewards.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Multiplier</p>
                <p className="text-3xl font-bold text-gradient-bitcoin">{getMultiplier(parsedAmount)}</p>
              </div>
            </div>

            {deploymentOption === 'auto-deploy' && selectedOpportunity && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-500 font-medium mb-2">
                  ✅ Auto-deployed to {selectedOpportunity.protocolName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Earning {formatAPY(selectedOpportunity.totalAPY)} APY
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1 mt-4">
              <p>💰 Base Rewards: +{baseRewards.toFixed(2)} $LQX</p>
              {autoDeployBonus > 0 && <p>⚡ Auto-Deploy Bonus: +{autoDeployBonus.toFixed(2)} $LQX</p>}
              {referralBonus > 0 && <p>👥 Referral Bonus: +{referralBonus.toFixed(2)} $LQX</p>}
            </div>
          </div>

          <Button onClick={handleReset} className="gradient-bitcoin text-primary-foreground font-semibold px-8">
            Bridge More & Earn
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">Bridge USDC → USDCx</CardTitle>
        <CardDescription>
          {selectedOpportunity 
            ? `Bridge to ${selectedOpportunity.protocolName} • ${formatAPY(selectedOpportunity.totalAPY)} Total APY`
            : "Transfer USDC from Ethereum to SUI with rewards"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div className="bg-secondary rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">Amount</Label>
            <span className="text-sm text-muted-foreground">
              Balance: <span className="text-foreground font-medium">{parseFloat(usdcBalance).toFixed(2)} USDC</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 px-0"
              disabled={step !== 'input'}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAmount(usdcBalance)}
              className="text-primary"
              disabled={step !== 'input'}
            >
              MAX
            </Button>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center">
            <ArrowDown className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* SUI Address */}
        <div className="bg-secondary rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground">SUI Address</Label>
            <SuiWalletButton 
              onAddressChange={(address) => setSUIAddress(address)}
              variant="ghost"
              size="sm"
            />
          </div>
          <Input
            type="text"
            placeholder="0x... (SUI address) or connect wallet above"
            value={suiAddress}
            onChange={(e) => setSUIAddress(e.target.value)}
            className="font-mono text-sm"
            disabled={step !== 'input'}
          />
          {isValidAddress && (
            <p className="text-green-500 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Valid address
            </p>
          )}
        </div>

        {/* Deployment Options */}
        <div className="bg-secondary rounded-xl p-4 space-y-3">
          <Label className="text-foreground font-semibold">Deployment Strategy</Label>
          <RadioGroup value={deploymentOption} onValueChange={(v) => setDeploymentOption(v as DeploymentOption)} disabled={step !== 'input'}>
            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
              <RadioGroupItem value="auto-deploy" id="auto-deploy" />
              <div className="flex-1">
                <label htmlFor="auto-deploy" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Auto-Deploy to DeFi
                  {selectedOpportunity && (
                    <Badge className="bg-green-500 text-white border-none">+30% Bonus</Badge>
                  )}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedOpportunity 
                    ? `Automatically enter ${selectedOpportunity.protocolName} (${formatAPY(selectedOpportunity.suiAPY)} APY)`
                    : "One-click entry to best DeFi protocol"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
              <RadioGroupItem value="hold" id="hold" />
              <div className="flex-1">
                <label htmlFor="hold" className="text-sm font-medium text-foreground cursor-pointer">
                  Hold as USDCx
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Just bridge, I'll deploy manually
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Referral Code */}
        <div className="bg-secondary rounded-xl p-4 space-y-3">
          <Label className="text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Referral Code (Optional)
          </Label>
          <Input
            type="text"
            placeholder="Enter referral code for +10% bonus"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="font-mono text-sm"
            disabled={step !== 'input'}
          />
        </div>

        {/* Rewards Preview */}
        {parsedAmount > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold text-foreground">Your Rewards</h4>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">$LQX Rewards</span>
                <span className="font-bold text-gradient-bitcoin">{totalRewards.toFixed(2)} $LQX</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Multiplier Tier</span>
                <span className="font-bold text-foreground">{getMultiplier(parsedAmount)}</span>
              </div>
              {selectedOpportunity && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Yearly</span>
                  <span className="font-bold text-green-500">
                    {formatCurrency(selectedOpportunity.estimatedEarnings.yearly)}
                  </span>
                </div>
              )}
            </div>

            <Progress value={(totalRewards / (parsedAmount * 0.01)) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Earning {((totalRewards / parsedAmount) * 100).toFixed(2)}% in $LQX rewards
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {step === 'input' && (
            <Button
              onClick={handleApprove}
              disabled={!canProceed}
              className="w-full gradient-bitcoin text-primary-foreground font-semibold py-6 text-lg rounded-xl glow-orange hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Zap className="w-5 h-5 mr-2" />
              Approve & Start Earning
            </Button>
          )}

          {step === 'approving' && (
            <Button disabled className="w-full bg-secondary py-6 text-lg">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Approving...
            </Button>
          )}

          {step === 'approved' && (
            <Button
              onClick={handleDeposit}
              className="w-full gradient-bitcoin text-primary-foreground font-semibold py-6 text-lg rounded-xl glow-orange"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Bridge to SUI
            </Button>
          )}

          {step === 'depositing' && (
            <Button disabled className="w-full bg-secondary py-6 text-lg">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Bridging...
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
