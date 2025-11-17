# Quick Start Guide

Get your payment link generator up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd payment-link-generator
npm install
```

## Step 2: Set Up Stripe (Test Mode)

1. Create a free Stripe account at [stripe.com](https://stripe.com)
2. Go to [Developers > API Keys](https://dashboard.stripe.com/test/apikeys)
3. Copy your test keys

## Step 3: Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Add your Stripe test keys:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Set Up Webhooks (Local Development)

In a new terminal:

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret from the output and add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

## Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Create Your First Payment Link

1. Click "Create Payment Link"
2. Fill in:
   - **Name:** "Premium Consultation"
   - **Description:** "One-hour strategy session"
   - **Price:** 99.00
   - **Currency:** USD
   - **Type:** One-time Payment
3. Click "Create Payment Link"
4. Copy the link and test it!

## Step 7: Test a Payment

Use Stripe's test card:
- **Card:** 4242 4242 4242 4242
- **Expiry:** Any future date
- **CVC:** Any 3 digits
- **ZIP:** Any 5 digits

## Next Steps

- Customize branding colors
- Download QR codes for your links
- View analytics in the dashboard
- Check the README for deployment and monetization

## Common Issues

### "STRIPE_SECRET_KEY is not set"
Make sure your `.env` file is in the root directory with the correct keys.

### Webhook events not received
Ensure the Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Build errors
Try deleting `node_modules` and `.next` folders, then run `npm install` again.

## Support

Check the full [README.md](./README.md) for detailed documentation.

Happy selling!
