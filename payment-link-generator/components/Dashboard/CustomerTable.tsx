import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Customer } from "@/lib/types";

interface CustomerTableProps {
  customers: Customer[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>Your latest customer transactions</CardDescription>
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
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b last:border-0">
                  <td className="py-3 text-sm font-medium">
                    {customer.name || 'Anonymous'}
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {customer.email}
                  </td>
                  <td className="py-3 text-sm">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="py-3 text-sm">
                    <Badge variant="secondary">{customer.purchaseCount}</Badge>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {formatDate(customer.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No customers yet. Create your first payment link to get started!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
