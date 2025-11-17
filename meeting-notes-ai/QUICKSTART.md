# Quick Start Guide

Get MeetingNotes AI up and running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier is fine)
- An OpenAI API key
- A Stripe account (for payments)

## Step-by-Step Setup

### 1. Clone and Install (2 minutes)

```bash
git clone <repository-url>
cd meeting-notes-ai
npm install
```

### 2. Set Up Supabase (3 minutes)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to Project Settings → API
4. Copy your `URL` and `anon public` key
5. Go to SQL Editor and run the contents of `supabase-schema.sql`
6. Go to Storage and create a bucket named `meeting-recordings`

### 3. Get OpenAI API Key (1 minute)

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to API Keys
3. Create a new secret key
4. Copy the key (you won't see it again!)

### 4. Set Up Stripe (2 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your publishable and secret keys from Developers → API Keys
3. Create products and prices:
   - Pro Monthly: $19.99
   - Pro Yearly: $199.99
   - Business Monthly: $49.99
   - Business Yearly: $499.99
4. Copy each price ID (starts with `price_`)

### 5. Configure Environment Variables (1 minute)

Create `.env.local` in the root directory:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (from step 2)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (from step 3)
OPENAI_API_KEY=your_openai_api_key

# Stripe (from step 4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Leave empty for now
STRIPE_PRICE_ID_PRO_MONTHLY=price_...
STRIPE_PRICE_ID_PRO_YEARLY=price_...
STRIPE_PRICE_ID_BUSINESS_MONTHLY=price_...
STRIPE_PRICE_ID_BUSINESS_YEARLY=price_...
```

### 6. Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Testing the App

### Create Your First Meeting

1. Sign up for an account
2. Go to Dashboard
3. Click "New Meeting"
4. Enter a title like "Test Meeting"
5. Either:
   - Upload a short audio file (use a test MP3)
   - Record a few seconds of audio
6. Click "Process Meeting"
7. Wait for transcription and analysis (30-60 seconds)
8. View your meeting notes!

### Test the Free Tier Limits

- Create 3 meetings to test the limit
- Try to create a 4th meeting - you should see the upgrade prompt
- Test the export features (PDF, Markdown)

## Troubleshooting

### "Failed to transcribe audio"

- Check your OpenAI API key
- Ensure you have credits in your OpenAI account
- Check the file format (MP3, WAV, M4A are supported)

### "Unauthorized" errors

- Verify Supabase keys are correct
- Check that the database schema was applied
- Ensure RLS policies are in place

### Stripe not working

- For local testing, leave webhook secret empty
- For production, set up webhook endpoint
- Ensure price IDs match your Stripe products

### Database errors

- Make sure you ran the entire `supabase-schema.sql`
- Check Supabase logs in the dashboard
- Verify table permissions

## Next Steps

1. **Customize the branding**: Update colors in `tailwind.config.js`
2. **Add your domain**: Update `NEXT_PUBLIC_APP_URL` for production
3. **Set up Stripe webhooks**: Use Stripe CLI for local testing
4. **Deploy to Vercel**: Push to GitHub and import to Vercel
5. **Add team features**: Implement team workspaces
6. **Integrate with Zoom**: Add Zoom webhook integration

## Getting Help

- Check the full [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Join our Discord community
- Email: support@meetingnotes-ai.com

Happy transcribing! 🎤
