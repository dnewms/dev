import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Search } from "lucide-react";

// Mock data
const customers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    totalSpent: 29700,
    purchaseCount: 3,
    lastPurchase: new Date('2024-02-15'),
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    totalSpent: 9900,
    purchaseCount: 1,
    lastPurchase: new Date('2024-02-10'),
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    totalSpent: 19800,
    purchaseCount: 2,
    lastPurchase: new Date('2024-02-05'),
    status: 'active',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    totalSpent: 2900,
    purchaseCount: 1,
    lastPurchase: new Date('2024-01-28'),
    status: 'inactive',
  },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage and view your customer information
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>{customers.length} total customers</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Total Spent</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Purchases</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Last Purchase</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {customer.email}
                    </td>
                    <td className="py-4">
                      <p className="font-semibold">{formatCurrency(customer.totalSpent)}</p>
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary">{customer.purchaseCount}</Badge>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {formatDateTime(customer.lastPurchase)}
                    </td>
                    <td className="py-4">
                      <Badge variant={customer.status === 'active' ? 'success' : 'outline'}>
                        {customer.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
