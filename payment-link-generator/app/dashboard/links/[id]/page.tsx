import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeDisplay } from "@/components/LinkBuilder/QRCodeDisplay";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, ExternalLink, Eye, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency, getPaymentUrl, calculateConversionRate } from "@/lib/utils";

interface LinkDetailPageProps {
  params: {
    id: string;
  };
}

// Mock data - in production, fetch from database
const mockLink = {
  id: 'link_1',
  name: 'Premium Consultation',
  description: 'One-hour strategy session to help you scale your business',
  price: 9900,
  currency: 'USD',
  type: 'one_time' as const,
  branding: {
    primaryColor: '#9333ea',
    buttonText: 'Book Now',
  },
  views: 145,
  conversions: 12,
  revenue: 118800,
  active: true,
  createdAt: new Date('2024-01-15'),
};

const recentTransactions = [
  { id: '1', customerEmail: 'john@example.com', amount: 9900, date: new Date('2024-02-15') },
  { id: '2', customerEmail: 'jane@example.com', amount: 9900, date: new Date('2024-02-14') },
  { id: '3', customerEmail: 'bob@example.com', amount: 9900, date: new Date('2024-02-10') },
];

export default function LinkDetailPage({ params }: LinkDetailPageProps) {
  const { id } = params;
  const paymentUrl = getPaymentUrl(id);
  const conversionRate = calculateConversionRate(mockLink.views, mockLink.conversions);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/links">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{mockLink.name}</h1>
            <Badge variant={mockLink.active ? 'success' : 'outline'}>
              {mockLink.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-muted-foreground">{mockLink.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {formatCurrency(mockLink.price, mockLink.currency)}
          </div>
          <Badge variant={mockLink.type === 'subscription' ? 'default' : 'secondary'}>
            {mockLink.type === 'subscription' ? 'Subscription' : 'One-time'}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockLink.revenue, mockLink.currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLink.views}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLink.conversions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Link */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Link</CardTitle>
            <CardDescription>Share this link with your customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={paymentUrl} readOnly />
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
              <Link href={paymentUrl} target="_blank">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <QRCodeDisplay url={paymentUrl} title={mockLink.name} />
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest purchases for this link</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{transaction.customerEmail}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(transaction.amount, mockLink.currency)}
                  </p>
                  <Badge variant="success">Completed</Badge>
                </div>
              </div>
            ))}

            {recentTransactions.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No transactions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
