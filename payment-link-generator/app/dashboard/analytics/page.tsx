import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock data
const stats = {
  totalRevenue: 12450,
  averageOrderValue: 4150,
  totalCustomers: 32,
  conversionRate: 8.3,
};

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  revenue: Math.floor(Math.random() * 1000) + 200,
  transactions: Math.floor(Math.random() * 10) + 1,
}));

const topLinks = [
  { name: 'Premium Consultation', revenue: 118800, conversions: 12, views: 145 },
  { name: 'Monthly Membership', revenue: 66700, conversions: 23, views: 89 },
  { name: 'E-book Bundle', revenue: 8400, conversions: 21, views: 156 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights into your payment performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description="All time revenue"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Avg. Order Value"
          value={formatCurrency(stats.averageOrderValue)}
          description="Per transaction"
          icon={TrendingUp}
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          description="Unique customers"
          icon={Users}
          trend={{ value: 5.1, isPositive: true }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          description="Visitors to customers"
          icon={Activity}
          trend={{ value: 1.2, isPositive: true }}
        />
      </div>

      <RevenueChart data={revenueData} />

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Links</CardTitle>
          <CardDescription>Your best performing payment links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{link.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {link.conversions} conversions • {link.views} views
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(link.revenue)}</p>
                  <p className="text-sm text-muted-foreground">
                    {((link.conversions / link.views) * 100).toFixed(1)}% conversion
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
