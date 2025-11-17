import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Here you would typically:
    // 1. Save to database (e.g., PostgreSQL, MongoDB, Supabase)
    // 2. Send to CRM (e.g., HubSpot, Salesforce)
    // 3. Send lead to solar installer partners
    // 4. Send confirmation email to user
    // 5. Send notification email to you

    console.log('New lead received:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      zipCode: data.zipCode,
      savings: data.calculationResults?.savings25Years
    });

    // Example: Send to webhook (Zapier, Make.com, n8n)
    // This allows you to connect to 1000+ apps without coding
    if (process.env.LEAD_WEBHOOK_URL) {
      await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadData: data,
          timestamp: new Date().toISOString(),
          source: 'solar-roi-calculator'
        }),
      });
    }

    // Example: Send email notification using SendGrid/Resend/Mailgun
    if (process.env.EMAIL_API_KEY) {
      // Implement email sending logic here
      // Send confirmation to user
      // Send notification to you with lead details
    }

    // Example: Save to database
    // await db.leads.create({
    //   data: {
    //     name: data.name,
    //     email: data.email,
    //     phone: data.phone,
    //     address: data.address,
    //     zipCode: data.zipCode,
    //     roofSize: data.roofSize,
    //     monthlyBill: data.monthlyBill,
    //     timeframe: data.timeframe,
    //     comments: data.comments,
    //     estimatedSavings: data.calculationResults.savings25Years,
    //     roi: data.calculationResults.roi,
    //     paybackPeriod: data.calculationResults.paybackPeriod,
    //     createdAt: new Date()
    //   }
    // });

    return NextResponse.json(
      { success: true, message: 'Lead captured successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing request' },
      { status: 500 }
    );
  }
}
