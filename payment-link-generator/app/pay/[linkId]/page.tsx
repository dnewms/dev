import { CheckoutForm } from "@/components/PaymentPage/CheckoutForm";
import { QRCodeDisplay } from "@/components/LinkBuilder/QRCodeDisplay";
import { getPaymentUrl } from "@/lib/utils";

// Mock data - in production, fetch from database/Stripe
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
};

interface PaymentPageProps {
  params: {
    linkId: string;
  };
}

export async function generateMetadata({ params }: PaymentPageProps) {
  // In production, fetch actual link data
  return {
    title: `${mockLink.name} - PayLink`,
    description: mockLink.description,
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { linkId } = params;
  const paymentUrl = getPaymentUrl(linkId);

  // In production, fetch link data from database
  // const link = await getLink(linkId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500" />
          </div>
          <p className="text-sm text-gray-600">Powered by PayLink</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex justify-center lg:justify-end">
            <CheckoutForm
              linkId={linkId}
              name={mockLink.name}
              description={mockLink.description}
              price={mockLink.price}
              currency={mockLink.currency}
              type={mockLink.type}
              primaryColor={mockLink.branding.primaryColor}
              buttonText={mockLink.branding.buttonText}
            />
          </div>

          <div className="flex justify-center lg:justify-start">
            <div className="w-full max-w-md">
              <QRCodeDisplay url={paymentUrl} title={mockLink.name} />

              <div className="mt-6 rounded-lg border bg-white p-6">
                <h3 className="mb-2 font-semibold">What's included:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Secure payment processing via Stripe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Instant email confirmation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
