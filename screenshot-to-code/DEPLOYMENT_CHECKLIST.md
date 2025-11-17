# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Code & Dependencies

- [ ] All dependencies installed and up to date
- [ ] No console.log or debug code in production
- [ ] TypeScript errors resolved (`npm run build`)
- [ ] ESLint warnings addressed
- [ ] .env files not committed to Git
- [ ] .gitignore properly configured

### Database

- [ ] PostgreSQL database provisioned (Supabase/Neon/Railway)
- [ ] DATABASE_URL added to production environment
- [ ] Prisma schema pushed to production database
  ```bash
  npx prisma db push
  ```
- [ ] Database backups configured
- [ ] Connection pooling enabled (if needed)

### Authentication

- [ ] NEXTAUTH_SECRET generated (unique, strong)
  ```bash
  openssl rand -base64 32
  ```
- [ ] NEXTAUTH_URL set to production domain
- [ ] Google OAuth credentials created for production
  - Client ID and Secret generated
  - Redirect URI: `https://yourdomain.com/api/auth/callback/google`
- [ ] GitHub OAuth app created for production
  - Client ID and Secret generated
  - Redirect URI: `https://yourdomain.com/api/auth/callback/github`

### OpenAI

- [ ] OpenAI API key added to environment
- [ ] API key has GPT-4 Vision access
- [ ] Billing set up on OpenAI account
- [ ] Usage limits configured
- [ ] Rate limits understood and documented

### Stripe

- [ ] Stripe account verified
- [ ] Three products created in Stripe:
  - [ ] Starter Pack (10 credits - $9.99)
  - [ ] Pro Pack (30 credits - $24.99)
  - [ ] Business Pack (100 credits - $69.99)
- [ ] Price IDs copied to environment variables
- [ ] Webhook endpoint created:
  - URL: `https://yourdomain.com/api/stripe/webhook`
  - Events: `checkout.session.completed`, `checkout.session.expired`
- [ ] Webhook secret added to environment
- [ ] Test mode webhook tested
- [ ] Production mode enabled (when ready)

### Environment Variables

All variables set in production environment:

- [ ] DATABASE_URL
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GITHUB_ID
- [ ] GITHUB_SECRET
- [ ] OPENAI_API_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] STRIPE_PRICE_ID_STARTER
- [ ] STRIPE_PRICE_ID_PRO
- [ ] STRIPE_PRICE_ID_BUSINESS

## Deployment Steps

### Vercel Deployment

1. [ ] Push code to GitHub/GitLab
2. [ ] Import project in Vercel
3. [ ] Add all environment variables
4. [ ] Deploy
5. [ ] Verify deployment successful
6. [ ] Test production URL

### Alternative Platforms

**Railway:**
- [ ] Connect GitHub repository
- [ ] Add PostgreSQL service
- [ ] Configure environment variables
- [ ] Deploy

**DigitalOcean:**
- [ ] Create app from GitHub
- [ ] Add managed database
- [ ] Configure environment
- [ ] Deploy

## Post-Deployment

### Testing

- [ ] Visit production URL
- [ ] Test sign in with Google
- [ ] Test sign in with GitHub
- [ ] Upload a test screenshot
- [ ] Generate HTML code
- [ ] Generate React code
- [ ] Test code editor (edit, copy)
- [ ] Test code preview (responsive views)
- [ ] Test download functionality
- [ ] Navigate to dashboard
- [ ] Verify credit count displays
- [ ] Test credit purchase flow (test mode)
- [ ] Complete a test payment
- [ ] Verify credits added after payment
- [ ] Test webhook (check Stripe logs)

### Performance

- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify API response times
- [ ] Test with slow 3G network
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

### Security

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not exposed
- [ ] OAuth redirect URIs restricted
- [ ] Stripe webhook signatures verified
- [ ] Rate limiting considered
- [ ] CORS properly configured

### Monitoring

- [ ] Set up error tracking (Sentry)
  ```bash
  npm install @sentry/nextjs
  ```
- [ ] Configure analytics (Vercel/Posthog)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Monitor OpenAI API usage
- [ ] Monitor Stripe dashboard
- [ ] Set up alerts for errors
- [ ] Database monitoring enabled

### SEO & Marketing

- [ ] Update meta tags in layout.tsx
- [ ] Add Open Graph images
- [ ] Create robots.txt
- [ ] Create sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Add Google Analytics (optional)
- [ ] Prepare social media posts
- [ ] Write Product Hunt description
- [ ] Create demo video

## Go Live Checklist

### Final Checks

- [ ] All tests passing
- [ ] No critical errors in logs
- [ ] Backup strategy in place
- [ ] Support email configured
- [ ] Terms of Service created (if needed)
- [ ] Privacy Policy created (if needed)

### Stripe Live Mode

- [ ] Test mode thoroughly tested
- [ ] Understand live mode implications
- [ ] Switch to live Stripe keys
- [ ] Update webhook to live endpoint
- [ ] Test one real transaction
- [ ] Monitor for issues

### Launch

- [ ] Announce on social media
- [ ] Post on Product Hunt
- [ ] Share in relevant communities
- [ ] Email any interested users
- [ ] Monitor performance closely
- [ ] Respond to user feedback

## Maintenance

### Weekly

- [ ] Check error logs
- [ ] Review Stripe transactions
- [ ] Monitor OpenAI usage/costs
- [ ] Check database size
- [ ] Review user feedback

### Monthly

- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Analyze usage metrics
- [ ] Plan new features
- [ ] Backup database

### As Needed

- [ ] Scale database if needed
- [ ] Optimize slow queries
- [ ] Add rate limiting if abuse
- [ ] Improve prompts based on feedback
- [ ] Add requested features

## Rollback Plan

If something goes wrong:

1. [ ] Revert to previous Vercel deployment
2. [ ] Check environment variables
3. [ ] Verify database connection
4. [ ] Check external service status
5. [ ] Review recent code changes
6. [ ] Check error logs

## Support Contacts

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Stripe Support: [support.stripe.com](https://support.stripe.com)
- OpenAI Support: [help.openai.com](https://help.openai.com)
- Database Provider: (your provider's support)

## Cost Estimates

Monthly costs (estimated):

- **Database (Supabase/Neon)**: $0-25 (free tier available)
- **Vercel**: $0-20 (free tier available)
- **OpenAI API**: $0.01-0.04 per generation (~$10-100 depending on usage)
- **Stripe**: 2.9% + $0.30 per transaction
- **Total**: ~$10-150/month depending on scale

Revenue breakeven: ~10-50 paid conversions/month

## Success Metrics

Track these KPIs:

- [ ] Total users signed up
- [ ] Active users (last 30 days)
- [ ] Generations per day
- [ ] Conversion rate (free → paid)
- [ ] Average revenue per user
- [ ] Churn rate
- [ ] Net Promoter Score

## Emergency Contacts

- [ ] Your email: _______________
- [ ] Team members: _______________
- [ ] On-call schedule: _______________

---

**Ready to launch?** 🚀

Take it step by step, test thoroughly, and you'll have a successful deployment!

Good luck!
