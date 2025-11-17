# Quick Start Guide

Get your Screenshot to Code app running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

## Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Choose one of these options:

**Option A: Local PostgreSQL**
```bash
# Make sure PostgreSQL is running
# Create a database called 'screenshot_to_code'
```

**Option B: Supabase (Free)**
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings > Database

**Option C: Neon (Free)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
# Required - Database
DATABASE_URL="postgresql://..." # Your database URL

# Required - NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Required - OpenAI
OPENAI_API_KEY="sk-..." # Get from platform.openai.com

# Optional for development - OAuth (can skip initially)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."

# Optional for development - Stripe (can skip initially)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_STARTER="price_..."
STRIPE_PRICE_ID_PRO="price_..."
STRIPE_PRICE_ID_BUSINESS="price_..."
```

### 4. Initialize Database

```bash
npm run db:push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing Without OAuth

If you skip OAuth setup initially, you won't be able to sign in. To test:

1. Set up at least one OAuth provider (Google is easiest)
2. Or modify the code to use a test user

## Testing Without Stripe

The app will work without Stripe, but:
- You can't purchase credits
- Users get 3 free credits on signup
- Payment buttons won't work

For testing, you can manually add credits in the database using Prisma Studio:

```bash
npm run db:studio
```

Navigate to the User table and update the `credits` field.

## Next Steps

1. Read the full [README.md](README.md) for detailed setup
2. Configure OAuth providers
3. Set up Stripe for payments
4. Deploy to Vercel

## Common Issues

**"Can't reach database server"**
- Check your DATABASE_URL is correct
- Ensure PostgreSQL is running
- Test connection with `psql <DATABASE_URL>`

**"OpenAI API Error"**
- Verify your API key is correct
- Ensure you have GPT-4 Vision access
- Check your OpenAI credits/billing

**"OAuth Error"**
- Verify redirect URIs match exactly
- Check client ID and secret
- Clear browser cookies

## Development Tips

1. Use Prisma Studio to view/edit database:
   ```bash
   npm run db:studio
   ```

2. Reset database if needed:
   ```bash
   npm run db:reset
   ```

3. Monitor OpenAI usage at [platform.openai.com](https://platform.openai.com)

4. Test Stripe locally with Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

Happy coding!
