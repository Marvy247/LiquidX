import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Zap, TrendingUp, Gift, CheckCircle2 } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to LiquidX",
    description: "The first platform that rewards you for bringing liquidity from Ethereum to SUI",
    icon: <Zap className="w-12 h-12 text-yellow-500" />,
  },
  {
    title: "Scan Opportunities",
    description: "Browse real-time APY comparisons across SUI DeFi protocols. We find the best yields for you.",
    icon: <TrendingUp className="w-12 h-12 text-green-500" />,
    highlight: "opportunity-scanner",
  },
  {
    title: "Bridge & Auto-Deploy",
    description: "Bridge USDC from Ethereum to SUI and automatically deploy to the highest-yield protocols in one click.",
    icon: <ArrowRight className="w-12 h-12 text-blue-500" />,
    highlight: "bridge-form",
  },
  {
    title: "Earn $LQX Rewards",
    description: "Get 0.75% of bridged amount in $LQX tokens + bonuses. Climb the leaderboard for up to 3x multipliers!",
    icon: <Gift className="w-12 h-12 text-orange-500" />,
  },
];

export function OnboardingTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("liquidx-tutorial-seen");
    if (!seen) {
      // Show tutorial after 1 second delay
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      setHasSeenTutorial(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("liquidx-tutorial-seen", "true");
    setHasSeenTutorial(true);
  };

  if (!isVisible || hasSeenTutorial) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" />

      {/* Tutorial Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-lg pointer-events-auto animate-in zoom-in-95 duration-300 shadow-2xl border-2 border-primary/50">
          <CardContent className="pt-6 pb-6">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Content */}
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">
                  {step.title}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "w-8 bg-primary"
                        : index < currentStep
                        ? "w-2 bg-primary/50"
                        : "w-2 bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip Tutorial
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 gradient-bitcoin text-primary-foreground font-semibold"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Step Counter */}
              <p className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Button to restart tutorial
export function RestartTutorialButton() {
  const handleRestart = () => {
    localStorage.removeItem("liquidx-tutorial-seen");
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRestart}
      className="text-muted-foreground hover:text-foreground"
    >
      <Zap className="w-4 h-4 mr-2" />
      Restart Tutorial
    </Button>
  );
}
