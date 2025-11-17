# Quick Start Guide - ResumePowerUp

Get up and running in 15 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor ready

## 5-Minute Setup

### Step 1: Install Dependencies (2 min)

```bash
cd resume-power-up
npm install
```

### Step 2: Get API Keys (10 min)

#### Supabase (3 min)
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Copy these values to `.env.local`:
   - Project URL
   - Anon key
   - Service role key

#### OpenAI (2 min)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add $5 credits
4. Copy to `.env.local`

#### Stripe (5 min)
1. Go to [stripe.com](https://stripe.com)
2. Get test mode keys
3. Copy to `.env.local`

### Step 3: Set Up Database (3 min)

1. Open Supabase SQL Editor
2. Copy/paste contents of `supabase/migrations/001_initial_schema.sql`
3. Click "Run"
4. Verify tables created

### Step 4: Configure Environment

Create `.env.local`:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Fill in your keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key_here
STRIPE_SECRET_KEY=your_key_here
STRIPE_WEBHOOK_SECRET=whsec_test
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Start Development

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## Test the App

### 1. Sign Up
- Click "Get Started"
- Create account
- Should get 3 free credits

### 2. Enhance Text
- Paste a resume bullet
- Select enhancement style
- Click "Enhance with AI"
- Should see before/after

### 3. Test Payment (Optional)
- Go to Pricing
- Click any package
- Use Stripe test card: `4242 4242 4242 4242`
- Any future date, any CVC

## Stripe Webhook (For Payment Testing)

### Terminal 1 (App):
```bash
npm run dev
```

### Terminal 2 (Stripe):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy webhook secret to `.env.local`

## Common Issues

### "Supabase error: Invalid API key"
→ Check your `.env.local` has correct keys

### "OpenAI API error"
→ Verify API key and check you have credits

### "Stripe webhook error"
→ Make sure webhook secret is set

### "Database error"
→ Run the migration SQL again

## Next Steps

1. ✅ App running locally
2. [ ] Create Stripe products
3. [ ] Update price IDs in `lib/stripe.ts`
4. [ ] Test full payment flow
5. [ ] Deploy to Vercel

## Need Help?

- Check `README.md` for detailed instructions
- See `SETUP_CHECKLIST.md` for complete setup
- Review `TROUBLESHOOTING.md` if issues occur

---

**You're ready to build! 🚀**

Time to start enhancing resumes and making money!
