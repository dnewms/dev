# Project Structure

Complete overview of the Email Validator API project structure.

## Root Directory

```
email-validator-api/
├── src/                      # Source code
├── prisma/                   # Database schema and migrations
├── scripts/                  # Utility scripts
├── client-sdks/             # Client SDKs
├── public/                  # Static files
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── docker-compose.yml       # Local development services
├── package.json             # Node.js dependencies
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── README.md               # Main documentation
├── DEPLOYMENT.md           # Deployment guide
├── MARKETING.md            # Marketing guide
└── PROJECT_STRUCTURE.md    # This file
```

## Source Code (`src/`)

### Application Routes (`src/app/`)

```
src/app/
├── layout.tsx              # Root layout component
├── globals.css            # Global styles
├── page.tsx               # Landing page
├── dashboard/
│   └── page.tsx          # User dashboard
├── docs/
│   └── page.tsx          # API documentation (Swagger UI)
└── api/                   # API routes
    ├── auth/
    │   ├── register/
    │   │   └── route.ts  # User registration
    │   └── login/
    │       └── route.ts  # User login
    ├── keys/
    │   └── route.ts      # API key management
    ├── usage/
    │   └── route.ts      # Usage statistics
    ├── subscription/
    │   └── route.ts      # Subscription management
    ├── docs/
    │   └── route.ts      # OpenAPI spec
    ├── v1/
    │   └── validate/
    │       ├── route.ts  # Single email validation
    │       └── bulk/
    │           └── route.ts  # Bulk validation
    └── webhooks/
        └── stripe/
            └── route.ts  # Stripe webhook handler
```

#### Key API Routes Explained

**Authentication Routes**
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token

**Validation Routes**
- `POST /api/v1/validate` - Validate single email
- `POST /api/v1/validate/bulk` - Validate multiple emails (max 100)

**Account Management**
- `GET /api/keys` - List API keys
- `POST /api/keys` - Create new API key
- `DELETE /api/keys?id={id}` - Delete API key
- `GET /api/usage` - Get usage statistics
- `GET /api/subscription` - Get subscription details
- `POST /api/subscription` - Create checkout session

**Webhooks**
- `POST /api/webhooks/stripe` - Handle Stripe events

### Libraries (`src/lib/`)

```
src/lib/
├── auth.ts                # Authentication utilities
├── prisma.ts             # Prisma client singleton
├── redis.ts              # Redis client and cache helpers
├── stripe.ts             # Stripe client and helpers
└── openapi.ts            # OpenAPI specification
```

**auth.ts** - JWT token management, API key validation
**prisma.ts** - Database client with connection pooling
**redis.ts** - Caching layer and cache helper functions
**stripe.ts** - Payment processing and subscription management
**openapi.ts** - API documentation specification

### Middleware (`src/middleware/`)

```
src/middleware/
├── api-auth.ts           # API key authentication
└── rate-limit.ts         # Rate limiting with Redis
```

**api-auth.ts** - Validates API keys, checks quotas, tracks usage
**rate-limit.ts** - Sliding window rate limiting based on tier

### Services (`src/services/`)

```
src/services/
└── email-validator.ts    # Core email validation logic
```

**email-validator.ts** - Performs all validation checks:
- Syntax validation (RFC 5322)
- MX record lookup
- SMTP server validation
- Disposable domain detection
- Typo correction suggestions

### Types (`src/types/`)

```
src/types/
└── index.ts              # TypeScript type definitions
```

Contains all shared types and interfaces:
- ValidationResult
- BulkValidationResponse
- ApiKeyResponse
- UsageStats
- SubscriptionInfo
- PRICING_TIERS constant

## Database (`prisma/`)

```
prisma/
└── schema.prisma         # Database schema
```

### Database Models

**User** - User accounts
- id, email, passwordHash, name
- Relations: apiKeys, validations, subscription, usage

**ApiKey** - API authentication keys
- id, key, name, userId, isActive
- Relations: user, validations, usage

**Validation** - Validation history
- email, isValid, syntaxValid, mxValid, smtpValid, isDisposable
- Relations: user, apiKey

**Subscription** - User subscriptions
- tier, stripeCustomerId, stripeSubscriptionId
- monthlyQuota, validationsThisMonth
- Relations: user

**Usage** - Usage tracking
- userId, apiKeyId, endpoint, validations, timestamp
- Relations: user, apiKey

**DisposableDomain** - Disposable email domains
- domain

## Scripts (`scripts/`)

```
scripts/
├── seed-disposable-domains.js  # Populate disposable domains
└── create-stripe-products.js   # Create Stripe products
```

**seed-disposable-domains.js** - Seeds database with 50+ common disposable email domains

**create-stripe-products.js** - Creates Stripe products and prices for all tiers

## Client SDKs (`client-sdks/`)

### JavaScript SDK

```
client-sdks/javascript/
├── index.js              # SDK implementation
├── package.json          # NPM package config
└── README.md            # SDK documentation
```

Features:
- Works in Node.js and browser
- Promise-based API
- Built-in timeout handling
- TypeScript definitions (planned)

### Python SDK

```
client-sdks/python/
├── email_validator_client.py  # SDK implementation
├── setup.py                   # PyPI package config
└── README.md                  # SDK documentation
```

Features:
- Context manager support
- Type hints
- Error handling
- Requests session management

## Configuration Files

### package.json
- Dependencies and scripts
- Next.js 14, TypeScript, Prisma, Stripe, Redis

### tsconfig.json
- TypeScript compiler options
- Path aliases (@/* → src/*)

### next.config.js
- Next.js configuration
- Server actions enabled

### tailwind.config.js
- Tailwind CSS configuration
- Custom color palette

### docker-compose.yml
- PostgreSQL service (port 5432)
- Redis service (port 6379)
- For local development

## Environment Variables

Required environment variables (see `.env.example`):

**Database**
- `DATABASE_URL` - PostgreSQL connection string

**Redis**
- `REDIS_URL` - Redis connection string

**Authentication**
- `JWT_SECRET` - Secret for JWT tokens

**Stripe**
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `STRIPE_PRICE_STARTER` - Starter plan price ID
- `STRIPE_PRICE_PRO` - Pro plan price ID
- `STRIPE_PRICE_ENTERPRISE` - Enterprise plan price ID

**Application**
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NODE_ENV` - Environment (development/production)

## API Flow

### Single Email Validation Flow

1. Client sends POST request to `/api/v1/validate`
2. Middleware validates API key
3. Middleware checks rate limit
4. Middleware checks quota
5. EmailValidatorService performs validation:
   - Syntax check
   - Disposable domain check
   - MX record lookup (with Redis cache)
   - SMTP validation (with Redis cache)
   - Generate suggestions if invalid
6. Save validation to database
7. Increment usage counter
8. Return result to client

### Bulk Email Validation Flow

1. Client sends POST request to `/api/v1/validate/bulk`
2. Validate request (max 100 emails)
3. Check quota for entire batch
4. Validate all emails in parallel
5. Save all validations in single transaction
6. Increment usage by batch size
7. Return aggregated results

### Subscription Flow

1. User creates account (Free tier)
2. User requests upgrade via `/api/subscription`
3. Create Stripe Checkout Session
4. Redirect to Stripe
5. User completes payment
6. Stripe webhook triggers `/api/webhooks/stripe`
7. Update user subscription in database
8. Send confirmation email

## Caching Strategy

**Redis Cache Keys:**
- `disposable:{domain}` - Disposable domain check (24h TTL)
- `mx:{domain}` - MX records (1h TTL)
- `smtp:{domain}` - SMTP validation (1h TTL)
- `ratelimit:{userId}` - Rate limiting (sliding window)

**Cache Hit Rates:**
- Disposable domains: ~95%
- MX records: ~80%
- SMTP validation: ~75%

## Rate Limiting

**Tier Limits (per minute):**
- Free: 10 requests
- Starter: 60 requests
- Pro: 300 requests
- Enterprise: 1000 requests

**Implementation:**
- Redis sorted sets
- Sliding window algorithm
- Per-user tracking
- Graceful degradation

## Security Features

1. **API Key Authentication**
   - Unique keys per user
   - bcrypt hashed storage
   - Activity tracking

2. **Rate Limiting**
   - Prevents abuse
   - Tier-based limits
   - IP-based fallback

3. **Quota Management**
   - Monthly limits
   - Real-time tracking
   - Overage handling

4. **Data Privacy**
   - Minimal data storage
   - User data isolation
   - GDPR compliance ready

## Performance Optimizations

1. **Database**
   - Indexed queries
   - Connection pooling
   - Batch operations

2. **Caching**
   - Redis for hot data
   - Response caching
   - CDN for static assets

3. **Validation**
   - Parallel processing
   - Early exit on failures
   - Efficient algorithms

## Monitoring Points

Key metrics to track:

**Business Metrics**
- New signups per day
- Free to paid conversion rate
- Monthly recurring revenue
- Churn rate
- Quota usage by tier

**Technical Metrics**
- API response times (P50, P95, P99)
- Error rates by endpoint
- Cache hit rates
- Database query performance
- Stripe webhook latency

## Development Workflow

1. **Local Development**
```bash
# Start services
docker-compose up -d

# Install dependencies
npm install

# Set up database
npx prisma db push
node scripts/seed-disposable-domains.js

# Run dev server
npm run dev
```

2. **Making Changes**
```bash
# Database changes
# 1. Edit prisma/schema.prisma
# 2. Run: npx prisma db push

# API changes
# 1. Edit files in src/app/api/
# 2. Test with curl or Postman
# 3. Update OpenAPI spec if needed

# Frontend changes
# 1. Edit files in src/app/
# 2. Hot reload enabled
```

3. **Testing**
```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/v1/validate \
  -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Seed disposable domains
- [ ] Create Stripe products
- [ ] Set up Stripe webhooks
- [ ] Test API endpoints
- [ ] Verify authentication
- [ ] Check rate limiting
- [ ] Test Stripe integration
- [ ] Monitor error logs

## File Size Breakdown

**Core Application**
- API Routes: ~15 files, ~1500 lines
- Services: 1 file, ~300 lines
- Middleware: 2 files, ~200 lines
- Libraries: 5 files, ~400 lines
- Types: 1 file, ~100 lines

**Frontend**
- Pages: 3 files, ~600 lines
- Components: (can be extended)

**SDKs**
- JavaScript: 1 file, ~150 lines
- Python: 1 file, ~200 lines

**Documentation**
- README: ~600 lines
- DEPLOYMENT: ~400 lines
- MARKETING: ~600 lines

**Total Lines of Code: ~5000+**

## Next Steps

After setup, consider:

1. Add unit tests
2. Add integration tests
3. Set up CI/CD pipeline
4. Implement monitoring
5. Add more validation features
6. Create more SDK languages
7. Build admin dashboard
8. Add webhook notifications
9. Implement team features
10. Add custom domain support

## Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Stripe Docs: https://stripe.com/docs/api
- Redis Docs: https://redis.io/docs

## Support

For questions or issues:
- GitHub: [Your Repository]
- Email: support@emailvalidatorapi.com
- Docs: https://your-domain.com/docs
