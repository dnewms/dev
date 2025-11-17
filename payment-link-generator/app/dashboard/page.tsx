import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { CustomerTable } from "@/components/Dashboard/CustomerTable";
import { DollarSign, TrendingUp, Users, Link2, Plus } from "lucide-react";

// This would typically come from your database/Stripe
const mockStats = {
  totalRevenue: 12450,
  totalTransactions: 48,
  totalCustomers: 32,
  activeLinks: 8,
};

const mockRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  revenue: Math.floor(Math.random() * 1000) + 200,
  transactions: Math.floor(Math.random() * 10) + 1,
}));

const mockCustomers = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    totalSpent: 9900,
    purchaseCount: 3,
    stripeCustomerId: 'cus_123',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    totalSpent: 4900,
    purchaseCount: 1,
    stripeCustomerId: 'cus_124',
    createdAt: new Date('2024-01-20'),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your payment links.
          </p>
        </div>
        <Link href="/dashboard/links/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Payment Link
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${(mockStats.totalRevenue / 100).toFixed(2)}`}
          description="All time revenue"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Transactions"
          value={mockStats.totalTransactions}
          description="Total completed"
          icon={TrendingUp}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Customers"
          value={mockStats.totalCustomers}
          description="Total customers"
          icon={Users}
          trend={{ value: 5.1, isPositive: true }}
        />
        <StatsCard
          title="Active Links"
          value={mockStats.activeLinks}
          description="Payment links"
          icon={Link2}
        />
      </div>

      <RevenueChart data={mockRevenueData} />

      <CustomerTable customers={mockCustomers} />
    </div>
  );
}
