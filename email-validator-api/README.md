# Email Validator API

A production-ready, monetizable email validation API service with comprehensive validation checks, Stripe billing integration, and developer-friendly SDKs.

## Features

- **Comprehensive Email Validation**
  - Syntax validation (RFC 5322)
  - MX record checking
  - SMTP server validation
  - Disposable domain detection
  - Smart typo suggestions

- **Developer Experience**
  - RESTful API with OpenAPI/Swagger documentation
  - Client SDKs (JavaScript/Node.js, Python)
  - Clear error messages and helpful suggestions
  - Rate limiting per tier
  - Redis caching for performance

- **Monetization Built-in**
  - Stripe subscription billing
  - Multiple pricing tiers (Free, Starter, Pro, Enterprise)
  - Usage tracking and quotas
  - Customer billing portal
  - Webhook support for subscription events

- **Production Ready**
  - TypeScript for type safety
  - PostgreSQL for reliable data storage
  - Redis for caching and rate limiting
  - API key authentication
  - Comprehensive error handling

## Tech Stack

- **Backend**: Next.js 14 API Routes, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis (with ioredis)
- **Payments**: Stripe
- **Frontend**: Next.js, React, Tailwind CSS
- **Documentation**: OpenAPI 3.0, Swagger UI
- **Deployment**: Vercel (or Railway, Fly.io)

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Redis instance
- Stripe account

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd email-validator-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/email_validator"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_STARTER="price_..."
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_ENTERPRISE="price_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev
```

5. **Seed disposable domains (optional)**

Add common disposable domains to your database:

```bash
node scripts/seed-disposable-domains.js
```

6. **Run the development server**

```bash
npm run dev
```

Visit http://localhost:3000 to see your API!

## Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables
   - Deploy!

3. **Set up external services**
   - Database: [Neon](https://neon.tech) or [Supabase](https://supabase.com) (PostgreSQL)
   - Redis: [Upstash](https://upstash.com) (Redis)

4. **Configure Stripe webhook**
   - In Stripe Dashboard, add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`
   - Copy webhook secret to environment variables

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add -p postgresql

# Add Redis
railway add -p redis

# Set environment variables
railway variables set STRIPE_SECRET_KEY=sk_...

# Deploy
railway up
```

### Deploy to Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app
fly launch

# Create PostgreSQL
fly postgres create

# Create Redis
fly redis create

# Set secrets
fly secrets set STRIPE_SECRET_KEY=sk_...

# Deploy
fly deploy
```

## API Documentation

### Authentication

All API endpoints require authentication via API key:

```bash
curl -X POST https://your-domain.com/api/v1/validate \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Endpoints

#### POST /api/v1/validate

Validate a single email address.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "email": "user@example.com",
  "isValid": true,
  "syntaxValid": true,
  "mxValid": true,
  "smtpValid": true,
  "isDisposable": false,
  "domain": "example.com",
  "suggestion": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### POST /api/v1/validate/bulk

Validate multiple email addresses (max 100 per request).

**Request:**
```json
{
  "emails": ["user1@example.com", "user2@example.com"]
}
```

**Response:**
```json
{
  "results": [...],
  "total": 2,
  "valid": 2,
  "invalid": 0
}
```

#### GET /api/usage

Get usage statistics (requires JWT token).

**Response:**
```json
{
  "totalValidations": 1234,
  "validationsThisMonth": 456,
  "monthlyQuota": 5000,
  "remainingQuota": 4544,
  "validationsByDay": [...]
}
```

### Interactive Documentation

Visit `/docs` on your deployed instance for full interactive API documentation powered by Swagger UI.

## Client SDKs

### JavaScript/Node.js

```bash
npm install @emailvalidator/sdk
```

```javascript
const EmailValidatorClient = require('@emailvalidator/sdk');

const client = new EmailValidatorClient('your-api-key');

// Validate single email
const result = await client.validateEmail('user@example.com');
console.log(result.isValid);

// Bulk validation
const bulk = await client.validateBulk(['email1@test.com', 'email2@test.com']);
console.log(bulk.results);
```

See [JavaScript SDK documentation](./client-sdks/javascript/README.md)

### Python

```bash
pip install email-validator-sdk
```

```python
from email_validator_client import EmailValidatorClient

client = EmailValidatorClient('your-api-key')

# Validate single email
result = client.validate_email('user@example.com')
print(result['isValid'])

# Bulk validation
bulk = client.validate_bulk(['email1@test.com', 'email2@test.com'])
print(bulk['results'])
```

See [Python SDK documentation](./client-sdks/python/README.md)

## Pricing Tiers

### Free
- **$0/month**
- 100 validations/month
- Basic validation features
- Community support
- Perfect for testing and personal projects

### Starter
- **$29/month**
- 5,000 validations/month
- All validation features
- Bulk validation
- Email support
- Great for small businesses

### Pro
- **$99/month**
- 25,000 validations/month
- All features
- Priority support
- Webhook notifications
- Ideal for growing companies

### Enterprise
- **$499/month**
- 200,000 validations/month
- All features
- Dedicated support
- SLA guarantee
- Custom integrations
- For large-scale operations

## Marketing Strategy

### Target Audience

1. **SaaS Companies** - Need to validate user emails during signup
2. **Marketing Agencies** - Clean email lists for campaigns
3. **E-commerce Platforms** - Reduce bounce rates and fraud
4. **CRM Developers** - Integrate email validation into products
5. **Data Scientists** - Clean datasets for analysis

### Distribution Channels

1. **Developer Communities**
   - Post on Reddit (r/webdev, r/programming, r/SaaS)
   - Share on Hacker News
   - Dev.to articles and tutorials
   - GitHub README and topics

2. **Content Marketing**
   - Blog posts about email validation best practices
   - Technical tutorials and integration guides
   - Case studies showing ROI
   - Comparison articles vs. competitors

3. **Social Media**
   - Twitter/X for developer audience
   - LinkedIn for B2B reach
   - YouTube tutorials
   - Product Hunt launch

4. **Partnerships**
   - Integrate with no-code platforms (Zapier, Make)
   - Partner with form builders (Typeform, JotForm)
   - List on API marketplaces (RapidAPI, APILayer)

5. **SEO**
   - Target keywords: "email validation API", "verify email", "email checker API"
   - Create comparison pages
   - Build backlinks from tech blogs

### Monetization Tips

1. **Free Tier** - Generous enough to be useful, limited enough to encourage upgrades
2. **Pay-per-use Option** - Consider adding credits for one-off validations
3. **Annual Discounts** - Offer 20% off for annual subscriptions
4. **Volume Discounts** - Custom pricing for >200k validations/month
5. **Add-ons** - Webhook notifications, dedicated support, custom integrations

## Integration Examples

### Sign-up Form Validation

```javascript
// React form validation
import { useState } from 'react';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(null);

  const validateEmail = async () => {
    const response = await fetch('/api/v1/validate', {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const result = await response.json();
    setIsValid(result.isValid);

    if (!result.isValid && result.suggestion) {
      alert(`Did you mean ${result.suggestion}?`);
    }
  };

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={validateEmail}
      />
      {isValid === false && <span>Invalid email</span>}
      {isValid === true && <span>Valid email!</span>}
    </form>
  );
}
```

### Bulk Email List Cleaning

```python
import csv
from email_validator_client import EmailValidatorClient

client = EmailValidatorClient('your-api-key')

# Read email list
with open('email_list.csv', 'r') as f:
    emails = [row[0] for row in csv.reader(f)]

# Validate in batches of 100
valid_emails = []
for i in range(0, len(emails), 100):
    batch = emails[i:i+100]
    result = client.validate_bulk(batch)

    for validation in result['results']:
        if validation['isValid']:
            valid_emails.append(validation['email'])

# Save clean list
with open('clean_emails.csv', 'w') as f:
    writer = csv.writer(f)
    for email in valid_emails:
        writer.writerow([email])

print(f'Cleaned {len(emails)} emails, {len(valid_emails)} valid')
```

### WordPress Plugin

```php
<?php
// WordPress email validation on user registration
add_filter('registration_errors', 'validate_email_on_registration', 10, 3);

function validate_email_on_registration($errors, $sanitized_user_login, $user_email) {
    $api_key = get_option('emailvalidator_api_key');

    $response = wp_remote_post('https://api.emailvalidator.com/api/v1/validate', array(
        'headers' => array(
            'X-API-Key' => $api_key,
            'Content-Type' => 'application/json'
        ),
        'body' => json_encode(array('email' => $user_email))
    ));

    $result = json_decode(wp_remote_retrieve_body($response), true);

    if (!$result['isValid']) {
        $errors->add('email_error', 'Please enter a valid email address.');
    }

    return $errors;
}
?>
```

### Zapier Integration

Create a custom Zapier integration to use in workflows:

1. Make a Zapier POST request
2. URL: `https://api.emailvalidator.com/api/v1/validate`
3. Headers: `X-API-Key: your-key`
4. Body: `{"email": "{{email_from_previous_step}}"}`
5. Use the result in subsequent steps

## Database Schema

The application uses Prisma with PostgreSQL. Key models:

- **User** - User accounts
- **ApiKey** - API keys for authentication
- **Validation** - Validation history
- **Subscription** - User subscriptions and quotas
- **Usage** - Usage tracking for analytics
- **DisposableDomain** - List of disposable email domains

See `prisma/schema.prisma` for full schema.

## Performance Optimization

1. **Redis Caching**
   - MX records cached for 1 hour
   - SMTP validation cached for 1 hour
   - Disposable domain checks cached for 24 hours

2. **Bulk Validation**
   - Validates emails in parallel
   - Efficient database operations
   - Single atomic transaction

3. **Rate Limiting**
   - Redis-backed sliding window
   - Per-user limits based on tier
   - Graceful degradation

## Monitoring & Analytics

### Key Metrics to Track

1. **Revenue Metrics**
   - MRR (Monthly Recurring Revenue)
   - Churn rate
   - Upgrade rate (Free → Paid)
   - Average revenue per user

2. **Usage Metrics**
   - Total API calls
   - API calls per user
   - Error rates
   - Response times

3. **Growth Metrics**
   - New signups
   - Activation rate
   - Retention rate
   - API usage growth

### Recommended Tools

- **Analytics**: Plausible or Google Analytics
- **Monitoring**: Sentry for error tracking
- **Uptime**: UptimeRobot or Pingdom
- **Logs**: LogRocket or DataDog

## Security Best Practices

1. **API Keys**
   - Never expose API keys in client-side code
   - Rotate keys regularly
   - Use environment variables

2. **Rate Limiting**
   - Implement per-IP rate limiting for auth endpoints
   - Monitor for abuse patterns

3. **Data Privacy**
   - Don't store validated emails permanently (GDPR compliance)
   - Anonymize analytics data
   - Provide data export/deletion

4. **Infrastructure**
   - Use HTTPS everywhere
   - Set up CORS properly
   - Enable database encryption at rest

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own projects!

## Support

- Documentation: https://your-domain.com/docs
- Email: support@emailvalidatorapi.com
- GitHub Issues: https://github.com/yourusername/email-validator-api/issues

## Roadmap

- [ ] Webhook notifications for failed validations
- [ ] Real-time dashboard with WebSocket
- [ ] Machine learning for better typo detection
- [ ] Additional SDK languages (Ruby, Go, PHP)
- [ ] White-label option for Enterprise
- [ ] Batch processing for CSV uploads
- [ ] API versioning (v2)

---

Built with ❤️ using Next.js, TypeScript, and Stripe
