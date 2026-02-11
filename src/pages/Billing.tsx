import { CreditCard, Check, Shield, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useDatabase } from "@/hooks/use-database";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  const { data: user, isLoading } = useUser();
  const { upgradePlan } = useDatabase();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await upgradePlan();
      toast({ title: "Success", description: "Plan upgraded to Pro successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upgrade plan", variant: "destructive" });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isPro = user?.subscriptionPlan === "Pro";
  const credits = user?.credits || 0;
  const maxCredits = isPro ? 100 : 5;
  const usagePercent = Math.min((credits / maxCredits) * 100, 100);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing & Plans</h2>
        <p className="text-muted-foreground mt-2 text-lg">Manage your subscription and usage.</p>
      </div>

      {/* Usage Section */}
      <Card className="border-border/50 bg-secondary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
            AI Credits Usage
          </CardTitle>
          <CardDescription>
            You have {credits} credits remaining this month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm py-1">
              <span className="font-medium text-muted-foreground">{credits} / {maxCredits} used</span>
              <span className="text-muted-foreground">{usagePercent.toFixed(0)}%</span>
            </div>
            <Progress value={usagePercent} className="h-3" />
            <p className="text-xs text-muted-foreground pt-2 flex items-center gap-1">
              <Info className="h-3 w-3" /> Pro plan includes 100 credits/month. Free plan includes 5.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
        {/* Free Plan */}
        <Card className={`relative flex flex-col ${!isPro ? 'border-primary shadow-md' : 'border-border/50'}`}>
          {!isPro && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="secondary" className="px-3">Current Plan</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription className="text-base">Perfect for getting started</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> 5 AI Credits / month
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Basic Resume Analysis
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Linear Roadmaps
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" /> Community Support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              {isPro ? "Downgrade" : "Current Plan"}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className={`relative flex flex-col ${isPro ? 'border-primary shadow-md' : 'border-border/50 bg-gradient-to-b from-secondary/30 to-background'}`}>
          {isPro && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="px-3 bg-brand hover:bg-brand">Active Plan</Badge>
            </div>
          )}
          {!isPro && (
            <div className="absolute -top-3 right-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0">Popular</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              Pro
              {!isPro && <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />}
            </CardTitle>
            <CardDescription className="text-base">For serious career growth</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand" /> 100 AI Credits / month
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand" /> Advanced Resume Analysis
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand" /> Branching Roadmaps
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand" /> Cover Letter Generator
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand" /> Priority Support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Button className="w-full" variant="outline" disabled>
                Manage Subscription
              </Button>
            ) : (
              <Button
                className="w-full bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/20"
                onClick={handleUpgrade}
                disabled={isUpgrading}
              >
                {isUpgrading ? "Upgrading..." : "Upgrade to Pro"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
