# Setup Checklist - ResumePowerUp

Use this checklist to ensure you've completed all setup steps before launching.

## Development Setup

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] npm or yarn installed

### Repository Setup
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env.local` file

### Supabase Configuration
- [ ] Create Supabase account
- [ ] Create new Supabase project
- [ ] Copy Project URL to `.env.local`
- [ ] Copy Anon Key to `.env.local`
- [ ] Copy Service Role Key to `.env.local`
- [ ] Run database migration (001_initial_schema.sql)
- [ ] Verify tables created (profiles, enhancements, usage_logs, payments, subscriptions)
- [ ] Enable Google OAuth (optional)
- [ ] Configure redirect URLs

### OpenAI Configuration
- [ ] Create OpenAI account
- [ ] Generate API key
- [ ] Add credits to OpenAI account ($5 minimum)
- [ ] Add API key to `.env.local`
- [ ] Test API key with a sample request

### Stripe Configuration
- [ ] Create Stripe account
- [ ] Get test mode API keys
- [ ] Add Publishable Key to `.env.local`
- [ ] Add Secret Key to `.env.local`

#### Create Products
- [ ] Starter Pack (10 credits - $9.99)
- [ ] Popular Pack (25 credits - $19.99)
- [ ] Value Pack (50 credits - $29.99)
- [ ] Starter Subscription ($29/month)
- [ ] Professional Subscription ($49/month)
- [ ] Unlimited Subscription ($99/month)

#### Update Code with Price IDs
- [ ] Update `lib/stripe.ts` with actual Price IDs
- [ ] Verify price IDs match Stripe dashboard

#### Webhook Setup (Local)
- [ ] Install Stripe CLI
- [ ] Run `stripe login`
- [ ] Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- [ ] Copy webhook secret to `.env.local`

### Test Development Environment
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test enhancement (uses 1 credit)
- [ ] Test before/after comparison
- [ ] Test export functionality
- [ ] Test credit purchase flow (test mode)
- [ ] Verify webhook receives events
- [ ] Check credits updated after purchase

## Pre-Launch Checklist

### Content Preparation
- [ ] Create 20-30 before/after examples
- [ ] Write compelling landing page copy
- [ ] Create demo video (2-3 minutes)
- [ ] Prepare Product Hunt assets
  - [ ] Logo/icon (240x240px)
  - [ ] Screenshots (at least 3)
  - [ ] Demo GIF/video
  - [ ] Product description
- [ ] Write first 3 blog posts for SEO

### Social Media Setup
- [ ] Create Twitter/X account
- [ ] Create LinkedIn page
- [ ] Create Instagram account
- [ ] Create TikTok account (optional)
- [ ] Create YouTube channel (optional)
- [ ] Prepare 2 weeks of content

### Analytics Setup
- [ ] Set up Google Analytics
- [ ] Set up Google Search Console
- [ ] Set up Facebook Pixel (if using FB ads)
- [ ] Set up Hotjar or similar (user recordings)
- [ ] Set up error tracking (Sentry)

### Email Marketing
- [ ] Choose email platform (Mailchimp, SendGrid, etc.)
- [ ] Create welcome email sequence
- [ ] Create credit reminder emails
- [ ] Set up transactional emails

### Legal & Compliance
- [ ] Create Privacy Policy
- [ ] Create Terms of Service
- [ ] Create Refund Policy
- [ ] Add cookie consent banner (if EU traffic)
- [ ] Review GDPR compliance (if needed)

## Production Deployment

### Vercel Setup
- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Import repository to Vercel
- [ ] Add all environment variables
- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Test production URL

### Domain Configuration
- [ ] Purchase domain (if needed)
- [ ] Add domain to Vercel
- [ ] Update DNS records
- [ ] Enable HTTPS
- [ ] Update `NEXT_PUBLIC_APP_URL` environment variable

### Supabase Production Config
- [ ] Update Site URL in Supabase Auth settings
- [ ] Add production redirect URLs
- [ ] Test OAuth with production URLs
- [ ] Verify RLS policies working

### Stripe Production Setup
- [ ] Switch to Stripe live mode
- [ ] Get live mode API keys
- [ ] Update environment variables in Vercel
- [ ] Create live mode products/prices
- [ ] Update `lib/stripe.ts` with live price IDs
- [ ] Set up production webhook endpoint
- [ ] Add webhook URL in Stripe dashboard
- [ ] Select webhook events
- [ ] Copy webhook secret
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Test live payment flow
- [ ] Verify webhook events received

### Final Testing
- [ ] Test complete signup flow
- [ ] Test OAuth login
- [ ] Test enhancement with all styles
- [ ] Test credit purchase (real payment)
- [ ] Test subscription signup
- [ ] Test subscription cancellation
- [ ] Verify email notifications
- [ ] Test on mobile devices
- [ ] Test export functionality
- [ ] Check page load speeds
- [ ] Verify SEO meta tags
- [ ] Test error handling

### Monitoring Setup
- [ ] Set up uptime monitoring (UptimeRobot, etc.)
- [ ] Configure error alerts
- [ ] Set up Stripe email notifications
- [ ] Monitor OpenAI API usage
- [ ] Set up database backup verification

## Launch Day

### Pre-Launch (Morning)
- [ ] Final production test
- [ ] Check all integrations working
- [ ] Prepare launch announcement
- [ ] Schedule social media posts
- [ ] Alert beta users

### Product Hunt Launch
- [ ] Submit to Product Hunt
- [ ] Share on Twitter
- [ ] Share on LinkedIn
- [ ] Post in relevant subreddits (carefully)
- [ ] Engage with Product Hunt comments
- [ ] Monitor analytics

### Post-Launch
- [ ] Respond to user feedback
- [ ] Monitor error logs
- [ ] Track conversion metrics
- [ ] Send launch announcement email

## Week 1 Post-Launch

- [ ] Analyze user behavior
- [ ] A/B test pricing page
- [ ] Fix any critical bugs
- [ ] Gather user testimonials
- [ ] Create case studies from successful users
- [ ] Start content marketing (blog posts)
- [ ] Engage on social media daily
- [ ] Monitor and optimize ad spend

## Growth Milestones

### 100 Users
- [ ] Celebrate!
- [ ] Analyze what's working
- [ ] Double down on best channels

### $1,000 MRR
- [ ] Celebrate!
- [ ] Consider hiring help
- [ ] Invest in paid marketing

### $10,000 MRR
- [ ] Celebrate!
- [ ] Build team
- [ ] Scale marketing

---

**Check off items as you complete them. Good luck with your launch! 🚀**
