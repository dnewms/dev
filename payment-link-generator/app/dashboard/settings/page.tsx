import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and integration settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Integration</CardTitle>
          <CardDescription>
            Your Stripe API keys and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="stripe-key">Stripe Publishable Key</Label>
            <div className="flex gap-2">
              <Input
                id="stripe-key"
                type="password"
                value="pk_test_••••••••••••••••"
                readOnly
              />
              <Button variant="outline">Update</Button>
            </div>
          </div>

          <div>
            <Label htmlFor="webhook-url">Webhook Endpoint</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/webhook`}
                readOnly
              />
              <Button variant="outline">Copy</Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Add this webhook URL in your Stripe dashboard to receive payment notifications
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Connection Status</p>
              <p className="text-sm text-muted-foreground">
                Your Stripe account is connected
              </p>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>
            Configure your platform and monetization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="platform-fee">Platform Fee (%)</Label>
            <Input
              id="platform-fee"
              type="number"
              step="0.01"
              min="0"
              max="100"
              defaultValue="5.00"
              placeholder="5.00"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Percentage fee charged on each transaction (e.g., 5% = $5 per $100)
            </p>
          </div>

          <div>
            <Label htmlFor="support-email">Support Email</Label>
            <Input
              id="support-email"
              type="email"
              defaultValue="support@yourdomain.com"
              placeholder="support@yourdomain.com"
            />
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              defaultValue="My Business"
              placeholder="Your business name"
            />
          </div>

          <div>
            <Label htmlFor="account-email">Account Email</Label>
            <Input
              id="account-email"
              type="email"
              defaultValue="you@example.com"
              placeholder="you@example.com"
            />
          </div>

          <Button>Update Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
