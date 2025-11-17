# Getting Started with Email Validator API

Quick start guide to get your Email Validator API up and running.

## Prerequisites

Make sure you have the following installed:

- **Node.js 18+** and npm/yarn
- **PostgreSQL** (or use cloud service)
- **Redis** (or use cloud service)
- **Stripe Account** (for payments)
- **Git** (for version control)

## Step-by-Step Setup

### 1. Set Up Local Services

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

#### Option B: Install Locally

**macOS (using Homebrew):**
```bash
brew install postgresql redis
brew services start postgresql
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql redis-server
sudo systemctl start postgresql
sudo systemctl start redis-server
```

**Windows:**
- Download PostgreSQL: https://www.postgresql.org/download/windows/
- Download Redis: https://redis.io/download

### 2. Clone and Install

```bash
# Navigate to the project
cd email-validator-api

# Install dependencies
npm install

# This will also generate Prisma client
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your favorite editor
```

**Minimum required variables:**

```env
# Database (if using Docker, this works out of the box)
DATABASE_URL="postgresql://emailvalidator:password@localhost:5432/email_validator"

# Redis (if using Docker, this works out of the box)
REDIS_URL="redis://localhost:6379"

# Generate a strong JWT secret
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"

# Get these from Stripe Dashboard (use test keys for development)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App URL (for local development)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**How to generate JWT secret:**
```bash
openssl rand -base64 32
```

### 4. Set Up Stripe

#### Create Stripe Account
1. Go to https://stripe.com and sign up
2. Get your test API keys from Dashboard → Developers → API keys

#### Create Products
```bash
# This script creates products and prices in Stripe
node scripts/create-stripe-products.js
```

Copy the price IDs and add them to your `.env`:
```env
STRIPE_PRICE_STARTER="price_..."
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_ENTERPRISE="price_..."
```

### 5. Set Up Database

```bash
# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 6. Seed Disposable Domains

```bash
# Add common disposable email domains to database
node scripts/seed-disposable-domains.js
```

### 7. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 - you should see the landing page!

### 8. Test the API

#### Create a test user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Response will include your API key:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  },
  "apiKey": "evapi_..."
}
```

#### Validate an email

```bash
curl -X POST http://localhost:3000/api/v1/validate \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gmail.com"}'
```

Expected response:
```json
{
  "email": "user@gmail.com",
  "isValid": true,
  "syntaxValid": true,
  "mxValid": true,
  "smtpValid": true,
  "isDisposable": false,
  "domain": "gmail.com",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Bulk validation

```bash
curl -X POST http://localhost:3000/api/v1/validate/bulk \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "emails": [
      "user1@gmail.com",
      "user2@yahoo.com",
      "invalid@domain"
    ]
  }'
```

### 9. Test Stripe Webhooks (Local)

```bash
# Install Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Other platforms: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Keep this running in a separate terminal. You'll see webhook events as they come in.

## Common Issues & Solutions

### Database Connection Error

**Error:** `Can't reach database server`

**Solutions:**
1. Make sure PostgreSQL is running: `docker-compose ps` or `brew services list`
2. Check DATABASE_URL is correct
3. Verify database exists: `psql $DATABASE_URL`

### Redis Connection Error

**Error:** `Redis connection failed`

**Solutions:**
1. Make sure Redis is running: `docker-compose ps` or `brew services list`
2. Check REDIS_URL is correct
3. Test Redis: `redis-cli -u $REDIS_URL ping`

### Prisma Client Error

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
npx prisma generate
```

### Module Not Found

**Error:** `Cannot find module '@/...'`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solutions:**
1. Kill the process: `lsof -ti:3000 | xargs kill`
2. Or use a different port: `PORT=3001 npm run dev`

## Project Structure Quick Reference

```
email-validator-api/
├── src/
│   ├── app/              # Next.js pages and API routes
│   │   ├── api/         # API endpoints
│   │   ├── dashboard/   # User dashboard
│   │   └── docs/        # API documentation
│   ├── lib/             # Shared utilities
│   ├── middleware/      # Auth and rate limiting
│   ├── services/        # Business logic
│   └── types/           # TypeScript types
├── prisma/
│   └── schema.prisma    # Database schema
├── client-sdks/         # JavaScript and Python SDKs
└── scripts/             # Utility scripts
```

## Development Workflow

### Making Changes to the Database

1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Restart dev server

### Adding a New API Endpoint

1. Create new route file in `src/app/api/`
2. Implement handler function
3. Update OpenAPI spec in `src/lib/openapi.ts`
4. Test with curl or Postman

### Updating the Frontend

1. Edit files in `src/app/`
2. Changes will hot-reload automatically
3. Build for production: `npm run build`

## Testing Stripe Integration

### Test Credit Cards

Use these test cards (from Stripe):

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0025 0000 3155

Any future expiry date and any 3-digit CVC.

### Test Subscription Flow

1. Create account on your app
2. Go to dashboard → Upgrade
3. Select a plan
4. Use test card number
5. Complete checkout
6. Verify subscription updated in database

## Next Steps

Now that you have the API running:

1. **Explore the Dashboard** - http://localhost:3000/dashboard
2. **Read the Docs** - http://localhost:3000/docs
3. **Try the SDKs** - See `client-sdks/` folders
4. **Customize Pricing** - Edit `src/types/index.ts`
5. **Deploy** - See `DEPLOYMENT.md`
6. **Market Your API** - See `MARKETING.md`

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma db push      # Push schema changes
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Create migration

# Linting
npm run lint            # Run ESLint

# Scripts
node scripts/seed-disposable-domains.js    # Seed domains
node scripts/create-stripe-products.js     # Create products
```

## Resources

### Documentation
- [Main README](./README.md) - Complete overview
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- [Marketing Guide](./MARKETING.md) - Grow your API
- [Project Structure](./PROJECT_STRUCTURE.md) - Code organization

### API Documentation
- Local: http://localhost:3000/docs
- Interactive Swagger UI with try-it-out

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stripe API](https://stripe.com/docs/api)
- [Redis Docs](https://redis.io/docs)

## Getting Help

If you're stuck:

1. Check [Common Issues](#common-issues--solutions) above
2. Review the documentation files
3. Check the GitHub issues
4. Email: support@emailvalidatorapi.com

## Quick Test Script

Save this as `test-api.sh` to quickly test all endpoints:

```bash
#!/bin/bash

API_URL="http://localhost:3000"

# Register user
echo "Registering user..."
RESPONSE=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test"}')

API_KEY=$(echo $RESPONSE | jq -r '.apiKey')
echo "API Key: $API_KEY"

# Validate email
echo -e "\nValidating email..."
curl -s -X POST $API_URL/api/v1/validate \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com"}' | jq

# Bulk validate
echo -e "\nBulk validation..."
curl -s -X POST $API_URL/api/v1/validate/bulk \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"emails":["test1@gmail.com","test2@yahoo.com"]}' | jq

echo -e "\nAll tests complete!"
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Congratulations!

You now have a fully functional email validation API! Start validating emails, explore the code, and make it your own.

Happy coding! 🚀
