import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, Mail } from "lucide-react";

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
  };
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = searchParams;

  // In production, you would:
  // 1. Verify the session_id with Stripe
  // 2. Retrieve order details
  // 3. Send confirmation email
  // 4. Deliver digital products

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Check Your Email</p>
                  <p className="text-sm text-gray-600">
                    We've sent a confirmation email with your receipt and details.
                  </p>
                </div>
              </div>
            </div>

            {session_id && (
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="mb-1 text-sm font-medium text-gray-600">Transaction ID</p>
                <p className="font-mono text-xs">{session_id}</p>
              </div>
            )}

            <div className="space-y-2 pt-4">
              <p className="text-sm font-medium">Need help?</p>
              <p className="text-sm text-gray-600">
                Contact us at support@paylink.com if you have any questions about your purchase.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
