# Screenshot to Code - AI-Powered Design to Code Converter

Transform any design screenshot into production-ready HTML/CSS or React components using AI. Built with Next.js 14, TypeScript, OpenAI Vision API, and Stripe for monetization.

## Features

- **AI-Powered Conversion**: Uses OpenAI's GPT-4 Vision to analyze screenshots and generate pixel-perfect code
- **Multiple Output Formats**: Generate HTML + Tailwind CSS or React + TypeScript components
- **Live Preview**: See your generated code rendered in real-time with responsive viewport controls
- **Code Editor**: Full-featured Monaco Editor with syntax highlighting
- **Download & Copy**: Export code as files or copy to clipboard
- **Freemium Model**: 3 free credits on signup, then purchase credit packages via Stripe
- **Secure Authentication**: Google and GitHub OAuth via NextAuth
- **Credits System**: PostgreSQL database tracks user credits and generation history
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **AI**: OpenAI GPT-4 Vision API
- **Authentication**: NextAuth.js (Google + GitHub OAuth)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe Checkout + Webhooks
- **Code Editor**: Monaco Editor (VS Code's editor)
- **File Upload**: React Dropzone

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or cloud like Supabase/Neon)
- OpenAI API key with GPT-4 Vision access
- Stripe account (test mode is fine for development)
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd screenshot-to-code

# Install dependencies
npm install
```

### 2. Database Setup

```bash
# Create a PostgreSQL database
# You can use local PostgreSQL, Supabase, Neon, or any PostgreSQL provider

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/screenshot_to_code"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Google OAuth (Get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (Get from https://github.com/settings/developers)
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"

# OpenAI API (Get from https://platform.openai.com/)
OPENAI_API_KEY="sk-your-openai-api-key"

# Stripe (Get from https://dashboard.stripe.com/)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Stripe Price IDs (Create products in Stripe Dashboard)
STRIPE_PRICE_ID_STARTER="price_starter_id"
STRIPE_PRICE_ID_PRO="price_pro_id"
STRIPE_PRICE_ID_BUSINESS="price_business_id"
```

### 4. OAuth Setup

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

#### GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Secret to `.env`

### 5. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Enable Test Mode
3. Create three products:
   - **Starter Pack**: 10 credits for $9.99
   - **Pro Pack**: 30 credits for $24.99
   - **Business Pack**: 100 credits for $69.99
4. Copy the Price IDs to `.env`
5. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
   - Copy webhook secret to `.env`

For local testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### AI Prompting Strategy

The application uses sophisticated prompt engineering to ensure high-quality code generation:

#### HTML Generation Prompt:
- Instructs GPT-4 Vision to act as an expert frontend developer
- Emphasizes semantic HTML5 elements
- Requires Tailwind CSS utility classes for styling
- Mandates responsive design with mobile-first approach
- Enforces accessibility best practices
- Requests production-ready code with proper document structure
- Uses low temperature (0.2) for consistent, reliable output

#### React Generation Prompt:
- Positions AI as an expert React + TypeScript developer
- Requires functional components with TypeScript types
- Emphasizes React best practices (hooks, composition)
- Mandates Tailwind CSS for styling
- Requests reusable, prop-based components
- Includes necessary imports and modern patterns

#### Key Prompt Engineering Techniques:
1. **Role Setting**: Clearly defines the AI's expertise level
2. **Structured Guidelines**: 10-12 specific requirements per prompt
3. **Output Format Control**: Specifies code-only output (no markdown)
4. **Quality Standards**: Emphasizes production-readiness and best practices
5. **Visual Accuracy**: Instructs to match colors, spacing, typography exactly

### Architecture

```
screenshot-to-code/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth routes
│   │   ├── generate/            # Code generation endpoint
│   │   └── stripe/
│   │       ├── checkout/        # Create payment session
│   │       └── webhook/         # Handle payment events
│   ├── dashboard/               # User dashboard
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main conversion interface
│   └── providers.tsx            # SessionProvider wrapper
├── components/
│   ├── ImageUpload.tsx          # Drag-and-drop upload
│   ├── CodeEditor.tsx           # Monaco editor
│   └── CodePreview.tsx          # Live preview
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── prisma.ts                # Prisma client
│   ├── stripe.ts                # Stripe configuration
│   └── openai.ts                # OpenAI API + prompts
└── prisma/
    └── schema.prisma            # Database schema
```

## Deployment Guide

### Option 1: Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

Vercel automatically:
- Builds Next.js app
- Sets up edge functions
- Provides CDN

**Database**: Use Vercel Postgres, Supabase, or Neon for PostgreSQL

### Option 2: Railway

1. Create account on [Railway](https://railway.app)
2. Create PostgreSQL database
3. Deploy from GitHub
4. Add environment variables
5. Railway handles everything

### Option 3: DigitalOcean App Platform

1. Create app from GitHub repo
2. Add managed PostgreSQL database
3. Configure environment variables
4. Deploy

### Post-Deployment Steps

1. Update OAuth redirect URIs to production domain
2. Update `NEXTAUTH_URL` in environment variables
3. Create production Stripe webhook with production domain
4. Test full payment flow in Stripe test mode
5. Switch to Stripe live mode when ready

## Pricing Model Suggestions

### Freemium Strategy

**Free Tier**:
- 3 free credits on signup
- Perfect for trying the service
- No credit card required

**Credit Packages**:
1. **Starter** ($9.99 for 10 credits)
   - $0.99 per conversion
   - Great for occasional users
   - Personal projects

2. **Pro** ($24.99 for 30 credits) ⭐ Most Popular
   - $0.83 per conversion (17% savings)
   - Ideal for freelancers
   - Multiple projects

3. **Business** ($69.99 for 100 credits)
   - $0.70 per conversion (30% savings)
   - Best for agencies
   - Team usage

### Alternative Pricing Models

**Subscription Model**:
- Basic: $19/month (30 credits)
- Pro: $49/month (100 credits)
- Agency: $149/month (500 credits)

**Usage-Based**:
- Pay-as-you-go: $1.49 per conversion
- Volume discounts at 50, 100, 500 conversions

### Upsell Opportunities

- Priority processing (faster AI responses)
- Custom component libraries
- Team collaboration features
- API access for automation
- Advanced customization options

## Marketing Channels

### 1. Product Hunt Launch
- Build anticipation with teaser page
- Launch on Tuesday-Thursday for max visibility
- Prepare demo video and screenshots
- Engage with comments actively
- Offer special launch pricing

### 2. Social Media

**Twitter/X**:
- Share before/after examples
- Post time-saving statistics
- Engage with web dev community
- Use hashtags: #webdev #frontend #ai #nocode

**Reddit**:
- r/webdev - Share as a useful tool
- r/Frontend - Showcase examples
- r/SideProject - Launch post
- r/reactjs - React component generation
- Provide value, not just promotion

**LinkedIn**:
- Target web developers and agencies
- Share case studies
- Professional use cases

### 3. Content Marketing

**Blog Posts**:
- "How AI is Transforming Frontend Development"
- "From Design to Code in 30 Seconds"
- "Best Practices for Design-to-Code Tools"

**Video Content**:
- YouTube tutorials
- TikTok/Instagram Reels demos
- Loom walkthrough videos

**SEO**:
- Target keywords: "screenshot to code", "design to code AI", "HTML generator"
- Create landing pages for specific use cases
- Build backlinks through guest posting

### 4. Community Engagement

**Discord/Slack**:
- Join web dev communities
- Help others, mention tool when relevant
- Create own Discord for users

**Dev.to / Hashnode**:
- Technical blog posts
- Tutorial content
- Share developer journey

### 5. Partnerships

**Designer Communities**:
- Dribbble - Reach designers
- Behance - Showcase capabilities
- Figma Community - Plugin opportunity

**Development Tools**:
- Integrate with design tools (Figma, Sketch)
- Partner with UI kit providers
- Collaborate with coding bootcamps

### 6. Paid Advertising (When Validated)

**Google Ads**:
- Target "screenshot to code", "design to HTML"
- Conversion-focused campaigns

**Facebook/Instagram Ads**:
- Target web developers, designers
- Video demo ads perform well

**Twitter Ads**:
- Promoted tweets to web dev audience

### 7. Influencer Outreach

- Web dev YouTubers (Fireship, Web Dev Simplified)
- Tech Twitter influencers
- Offer free credits for reviews

### 8. Email Marketing

- Build newsletter with tips & updates
- Drip campaigns for trial users
- Re-engagement for inactive users

## Conversion Optimization Tips

1. **Landing Page**:
   - Clear value proposition above fold
   - Show examples immediately
   - Trust signals (testimonials, usage stats)
   - Strong CTA buttons

2. **Onboarding**:
   - Instant access (no email verification)
   - Interactive tutorial
   - First success within 60 seconds

3. **Monetization**:
   - Show credit balance prominently
   - Timely upgrade prompts
   - Clear pricing page
   - Money-back guarantee

4. **Retention**:
   - Email when credits run low
   - Weekly digest of new features
   - Referral program (give free credits)

## Performance Optimization

### Image Handling
- Images are base64 encoded for API
- Consider cloud storage (S3, Cloudinary) for large files
- Implement image compression before upload

### Caching
- Next.js automatic caching
- Redis for session storage (production)
- Cache common generations

### Monitoring
- Sentry for error tracking
- Vercel Analytics for performance
- PostHog for user analytics
- Stripe Dashboard for revenue

## Security Best Practices

- Environment variables never exposed to client
- Stripe webhook signature verification
- NextAuth CSRF protection
- Prisma prepared statements (SQL injection prevention)
- Rate limiting on API routes (implement with Upstash)

## Troubleshooting

### Common Issues

**Prisma Error**:
```bash
# Reset database and re-migrate
npx prisma migrate reset
npx prisma db push
```

**NextAuth Session Issues**:
- Check `NEXTAUTH_SECRET` is set
- Verify OAuth redirect URIs match exactly
- Clear browser cookies and retry

**Stripe Webhook Not Working**:
- Verify webhook secret is correct
- Check Stripe Dashboard webhook logs
- Ensure endpoint is publicly accessible

**OpenAI API Errors**:
- Verify API key has GPT-4 Vision access
- Check rate limits
- Monitor usage at platform.openai.com

## Future Enhancements

- [ ] Export to CodeSandbox/StackBlitz
- [ ] Multiple image comparison (before/after)
- [ ] Component library integration
- [ ] Figma plugin
- [ ] API access for developers
- [ ] Team collaboration features
- [ ] Version history
- [ ] Custom design systems
- [ ] Mobile app

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## License

MIT License - feel free to use for commercial projects

## Support

- Email: support@your-domain.com
- Discord: [Join our community]
- Documentation: [docs.your-domain.com]

## Acknowledgments

- OpenAI for GPT-4 Vision API
- Vercel for Next.js framework
- Stripe for payment processing
- All open-source contributors

---

Built with ❤️ using Next.js 14, TypeScript, and AI

**Start converting designs to code today!** 🚀
