# PayLink - Beautiful Payment Links for Creators

A sleek, modern payment link generator built for creators and freelancers. Create stunning branded payment pages in seconds, accept one-time payments or subscriptions, and track your revenue with powerful analytics.

Think of it as **Gumroad or Lemon Squeezy lite** - simple, fast, and focused on getting you paid quickly.

## Features

- **Custom Payment Links** - Create unlimited payment links for products/services
- **One-time & Subscription Payments** - Support both payment models via Stripe
- **Custom Branding** - Personalize payment pages with colors and logos
- **QR Code Generation** - Automatically generate QR codes for mobile payments
- **Analytics Dashboard** - Track revenue, conversions, and customer insights
- **Customer Management** - View and manage all your customers in one place
- **Invoice Generation** - Create professional invoices (via Stripe)
- **Webhook Support** - Real-time payment notifications
- **Mobile Responsive** - Beautiful on all devices

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Payments:** Stripe API
- **QR Codes:** qrcode.react
- **Charts:** Recharts
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Stripe account ([Sign up here](https://stripe.com))
- npm or yarn package manager

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd payment-link-generator
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values (see Stripe Setup below).

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Stripe Setup Guide

### 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and sign up
2. Complete your account setup
3. You'll start in **Test Mode** (perfect for development)

### 2. Get Your API Keys

1. Go to [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add them to your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 3. Set Up Webhooks

Webhooks notify your app when payments succeed, subscriptions are created, etc.

**For Local Development:**

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run: `stripe login`
3. Forward webhooks to your local server:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**For Production:**

1. Go to [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the signing secret and add to your production environment variables

### 4. Test Your Integration

1. Create a payment link in your dashboard
2. Use Stripe's [test cards](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date, any CVC

### 5. Go Live

When ready for production:

1. Complete your Stripe account activation
2. Switch to **Live Mode** in Stripe Dashboard
3. Get your live API keys (start with `pk_live_` and `sk_live_`)
4. Update your production environment variables

## Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**

   Add these in Vercel's project settings:
   ```
   STRIPE_SECRET_KEY=sk_live_your_live_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
   STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   PLATFORM_FEE_PERCENTAGE=0.05
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

5. **Set up production webhooks** (see Stripe Setup section above)

### Other Deployment Options

#### Netlify

```bash
npm run build
# Deploy the .next folder
```

#### Railway

```bash
# Railway will auto-detect Next.js
railway login
railway init
railway up
```

#### Self-Hosted (VPS/Docker)

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Database Integration (Optional)

This starter uses **Stripe as a database** for simplicity (storing metadata on Stripe objects). For production, you may want to add a dedicated database:

### Recommended Options:

1. **PostgreSQL + Prisma**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **MongoDB + Mongoose**
   ```bash
   npm install mongoose
   ```

3. **Supabase** (PostgreSQL with instant APIs)
   - Sign up at [supabase.com](https://supabase.com)
   - Use their client library

Update the API routes in `app/api` to save/retrieve from your database instead of mock data.

## Monetization Strategies

Here are proven ways to monetize this platform:

### 1. Transaction Fee (Recommended)

**Charge a percentage on each transaction**

- **Example:** 5% platform fee on all payments
- **Stripe does:** 2.9% + $0.30
- **You add:** 5% on top
- **Customer pays:** $100
- **You keep:** $5
- **Stripe takes:** ~$3.20
- **Seller gets:** ~$91.80

**Implementation:** Already built in! Set `PLATFORM_FEE_PERCENTAGE=0.05` in `.env`

**How to collect:**
```javascript
// In your checkout session creation
const applicationFee = Math.round(amount * 0.05);

await stripe.checkout.sessions.create({
  // ... other params
  payment_intent_data: {
    application_fee_amount: applicationFee,
  },
});
```

**Pros:**
- Only charge when sellers make money
- Aligns your incentives with users
- Easy to understand

**Pricing Ideas:**
- Free tier: 5% fee
- Pro tier: 3% fee + $29/month
- Enterprise: 1% fee + $99/month

### 2. Monthly Subscription

**Charge a flat monthly fee**

- **Starter:** $0/month (limited to 5 links)
- **Pro:** $29/month (unlimited links, custom domain)
- **Business:** $99/month (white label, priority support)

**Pros:**
- Predictable revenue
- No transaction fees needed

**Cons:**
- Harder to get users to commit upfront

### 3. Hybrid Model (Best of Both)

**Combine subscription + reduced transaction fees**

- **Free:** 5% transaction fee, 5 links max
- **Pro ($29/mo):** 2% transaction fee, unlimited links
- **Enterprise ($299/mo):** 0% transaction fee, white label

### 4. Premium Features

**Charge for advanced capabilities:**

- Custom domains: $10/month
- Remove branding: $15/month
- Advanced analytics: $20/month
- Email marketing integration: $25/month
- Priority support: $50/month

### 5. Payment Processing Margin

If you become a Stripe Partner, you can earn a revenue share on payment processing.

## Target Market Ideas

### 1. Content Creators
- YouTubers selling courses
- Podcasters offering premium content
- Newsletter writers with paid subscriptions

### 2. Coaches & Consultants
- Life coaches selling session packages
- Business consultants offering strategy calls
- Fitness trainers with meal plans

### 3. Freelancers
- Designers selling templates
- Developers selling boilerplates
- Writers offering editing services

### 4. Small Businesses
- Local services (plumbers, electricians)
- Event organizers selling tickets
- Artists selling prints

### 5. Educators
- Online course creators
- Tutors offering lessons
- Workshop facilitators

### 6. Non-Profits
- Accepting donations
- Selling merchandise
- Event registrations

## Marketing Your Platform

1. **SEO-Optimized Landing Page**
   - "Create payment links in seconds"
   - "Stripe alternative for creators"
   - "Gumroad alternative"

2. **Content Marketing**
   - Blog: "How to sell digital products"
   - YouTube: Platform tutorials
   - Twitter: Success stories

3. **Community Building**
   - Discord for creators
   - Weekly newsletter
   - Case studies

4. **Partnerships**
   - Integrate with creator tools
   - Partner with influencers
   - Affiliate program

## Customization Ideas

### Add More Features

1. **Email Marketing**
   ```bash
   npm install @sendgrid/mail
   # Send receipts, marketing emails
   ```

2. **Custom Domains**
   - Let users use their own domain
   - `pay.theirbrand.com/product`

3. **Discount Codes**
   - Create coupon functionality
   - Time-limited offers

4. **Upsells**
   - Suggest related products at checkout
   - "Customers also bought..."

5. **Digital Downloads**
   - Deliver files after purchase
   - PDF, videos, etc.

6. **Abandoned Cart Recovery**
   - Email reminders for incomplete checkouts

## Project Structure

```
payment-link-generator/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── pay/              # Public payment pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Reusable UI components
│   ├── Dashboard/        # Dashboard components
│   ├── LinkBuilder/      # Link creation components
│   └── PaymentPage/      # Payment page components
├── lib/
│   ├── stripe.ts         # Stripe utilities
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── .env.example          # Environment variables template
```

## Support & Resources

- **Stripe Docs:** [https://stripe.com/docs](https://stripe.com/docs)
- **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## License

MIT License - feel free to use this for your own projects!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with love for creators.** Start accepting payments in minutes!
