import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Link2, Copy, ExternalLink, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock data - would come from database
const mockLinks = [
  {
    id: 'link_1',
    name: 'Premium Consultation',
    description: 'One-hour strategy session',
    price: 9900,
    currency: 'USD',
    type: 'one_time',
    active: true,
    views: 145,
    conversions: 12,
    revenue: 118800,
  },
  {
    id: 'link_2',
    name: 'Monthly Membership',
    description: 'Access to exclusive content',
    price: 2900,
    currency: 'USD',
    type: 'subscription',
    active: true,
    views: 89,
    conversions: 23,
    revenue: 66700,
  },
];

export default function LinksPage() {
  const copyToClipboard = (linkId: string) => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay/${linkId}`;
    navigator.clipboard.writeText(url);
    // In production, you'd show a toast notification
    alert('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Links</h1>
          <p className="text-muted-foreground">
            Manage your payment links and track performance
          </p>
        </div>
        <Link href="/dashboard/links/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Link
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {mockLinks.map((link) => (
          <Card key={link.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {link.name}
                    <Badge variant={link.type === 'subscription' ? 'default' : 'secondary'}>
                      {link.type === 'subscription' ? 'Subscription' : 'One-time'}
                    </Badge>
                    {link.active && <Badge variant="success">Active</Badge>}
                  </CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatCurrency(link.price, link.currency)}
                  </div>
                  {link.type === 'subscription' && (
                    <p className="text-xs text-muted-foreground">per month</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{link.views}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversions</p>
                    <p className="font-semibold">{link.conversions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-semibold">{formatCurrency(link.revenue, link.currency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversion Rate</p>
                    <p className="font-semibold">
                      {link.views > 0 ? ((link.conversions / link.views) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(link.id)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                  <Link href={`/pay/${link.id}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/dashboard/links/${link.id}`}>
                    <Button size="sm">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {mockLinks.length === 0 && (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Link2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No payment links yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Create your first payment link to start accepting payments
              </p>
              <Link href="/dashboard/links/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Payment Link
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
