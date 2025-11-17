# Deployment Guide

This guide covers deploying the Email Validator API to various platforms.

## Prerequisites

Before deploying, make sure you have:

1. A GitHub repository with your code
2. A Stripe account with API keys
3. Created Stripe products (run `node scripts/create-stripe-products.js`)

## Deploy to Vercel (Recommended)

Vercel is the easiest and fastest deployment option for Next.js applications.

### Step 1: Prepare External Services

**PostgreSQL Database (choose one):**

- **Neon** (Recommended for Vercel)
  1. Sign up at [neon.tech](https://neon.tech)
  2. Create a new project
  3. Copy the connection string

- **Supabase**
  1. Sign up at [supabase.com](https://supabase.com)
  2. Create a new project
  3. Get connection string from Settings → Database

**Redis Cache:**

- **Upstash** (Serverless Redis)
  1. Sign up at [upstash.com](https://upstash.com)
  2. Create a new Redis database
  3. Copy the connection string

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional)
```bash
npm i -g vercel
```

2. **Deploy via Dashboard** (easier)
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**

In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-generated-secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your API is live!

### Step 3: Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Copy the webhook secret
6. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy your application

### Step 4: Run Database Migrations

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Set up environment locally
vercel env pull

# Run migrations
npx prisma db push
```

Or use Prisma Data Platform for managed migrations.

## Deploy to Railway

Railway offers a simple deployment experience with built-in PostgreSQL and Redis.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Initialize Project

```bash
# Login to Railway
railway login

# Create new project
railway init

# Link to your code
railway link
```

### Step 3: Add Services

```bash
# Add PostgreSQL
railway add -p postgresql

# Add Redis
railway add -p redis
```

Railway will automatically set `DATABASE_URL` and `REDIS_URL`.

### Step 4: Set Environment Variables

```bash
railway variables set JWT_SECRET=your-secret
railway variables set STRIPE_SECRET_KEY=sk_live_...
railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_...
railway variables set STRIPE_WEBHOOK_SECRET=whsec_...
railway variables set STRIPE_PRICE_STARTER=price_...
railway variables set STRIPE_PRICE_PRO=price_...
railway variables set STRIPE_PRICE_ENTERPRISE=price_...
railway variables set NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

### Step 5: Deploy

```bash
railway up
```

Your app will be available at `https://your-app.railway.app`

### Step 6: Run Migrations

```bash
railway run npx prisma db push
```

## Deploy to Fly.io

Fly.io offers global distribution and is great for low-latency applications.

### Step 1: Install flyctl

```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Create fly.toml

Create a `fly.toml` file in your project root:

```toml
app = "email-validator-api"
primary_region = "iad"

[build]
  [build.args]
    NODE_VERSION = "18"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[services]]
  protocol = "tcp"
  internal_port = 8080

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

### Step 3: Launch App

```bash
fly launch
```

### Step 4: Add PostgreSQL

```bash
fly postgres create
fly postgres attach email-validator-postgres
```

### Step 5: Add Redis

```bash
fly redis create
```

Copy the Redis URL and add it as a secret:

```bash
fly secrets set REDIS_URL=redis://...
```

### Step 6: Set Secrets

```bash
fly secrets set JWT_SECRET=your-secret
fly secrets set STRIPE_SECRET_KEY=sk_live_...
fly secrets set STRIPE_PUBLISHABLE_KEY=pk_live_...
fly secrets set STRIPE_WEBHOOK_SECRET=whsec_...
fly secrets set STRIPE_PRICE_STARTER=price_...
fly secrets set STRIPE_PRICE_PRO=price_...
fly secrets set STRIPE_PRICE_ENTERPRISE=price_...
fly secrets set NEXT_PUBLIC_APP_URL=https://email-validator-api.fly.dev
```

### Step 7: Deploy

```bash
fly deploy
```

### Step 8: Run Migrations

```bash
fly ssh console
npx prisma db push
exit
```

## Custom Domain Setup

### Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### Railway

1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### Fly.io

```bash
fly certs add yourdomain.com
fly certs add www.yourdomain.com
```

Then update your DNS:
```
A    @     <fly-ip-address>
AAAA @     <fly-ipv6-address>
```

## Environment-Specific Configuration

### Production Checklist

- [ ] Use production Stripe keys
- [ ] Set up Stripe webhook for production URL
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable database connection pooling
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CORS for your domain
- [ ] Enable rate limiting
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy
- [ ] Set up SSL/TLS certificates
- [ ] Review security headers

### Performance Optimization

1. **Database**
   - Enable connection pooling
   - Add database indexes
   - Use read replicas for scaling

2. **Redis**
   - Increase cache TTL for stable data
   - Use Redis Cluster for high availability
   - Monitor cache hit rates

3. **API**
   - Enable compression
   - Use CDN for static assets
   - Implement response caching headers

## Monitoring & Maintenance

### Recommended Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Logs**: LogRocket, Papertrail
- **Analytics**: Plausible, PostHog
- **APM**: New Relic, DataDog

### Database Backups

**Vercel + Neon**: Automatic backups included

**Railway**: Automatic backups included

**Fly.io**: Set up automated backups:
```bash
fly volumes create postgres_backup --size 10
```

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL

# Check Prisma schema
npx prisma validate

# Generate Prisma client
npx prisma generate
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli -u $REDIS_URL ping
```

### Stripe Webhook Issues

1. Check webhook secret is correct
2. Verify endpoint URL is accessible
3. Check Stripe Dashboard → Webhooks → Logs
4. Test with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Build Failures

1. Check all environment variables are set
2. Verify dependencies in package.json
3. Clear build cache and retry
4. Check build logs for specific errors

## Scaling

### Horizontal Scaling

**Vercel**: Automatic scaling included

**Railway**: Add more instances in dashboard

**Fly.io**: Scale with CLI
```bash
fly scale count 3
```

### Database Scaling

1. Enable connection pooling (PgBouncer)
2. Add read replicas
3. Upgrade to larger database instance
4. Implement database sharding for extreme scale

### Redis Scaling

1. Enable Redis Cluster
2. Add more Redis instances
3. Implement cache sharding
4. Use Redis Sentinel for high availability

## Cost Optimization

### Tips to Reduce Costs

1. **Free Tiers**
   - Vercel: Free for hobby projects
   - Neon: 10GB free
   - Upstash: 10k requests/day free

2. **Optimize Database**
   - Clean old validation records
   - Archive historical data
   - Use database indexes

3. **Optimize Redis**
   - Set appropriate TTLs
   - Clean expired keys
   - Monitor memory usage

4. **Code Optimization**
   - Implement efficient caching
   - Reduce API calls
   - Optimize database queries

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review deployment logs
3. Check GitHub issues
4. Contact support@emailvalidatorapi.com
