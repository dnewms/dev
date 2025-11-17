# MeetingNotes AI - AI-Powered Meeting Transcription & Summarization

A competitive alternative to Otter.ai and Fireflies.ai, built with Next.js 14, TypeScript, Tailwind CSS, OpenAI Whisper API, Supabase, and Stripe.

![MeetingNotes AI](https://via.placeholder.com/1200x600/3B82F6/FFFFFF?text=MeetingNotes+AI)

## Features

- **Audio/Video Upload**: Support for multiple file formats (MP3, WAV, M4A, MP4, MOV, etc.)
- **Browser Recording**: Record meetings directly in the browser
- **AI Transcription**: Powered by OpenAI Whisper API for industry-leading accuracy
- **Smart Summaries**: AI-generated summaries, key points, and insights
- **Action Items**: Automatically extract tasks with priority levels
- **Key Decisions**: Capture important decisions made during meetings
- **Speaker Identification**: Identify and track different speakers
- **Advanced Search**: Search across all meetings and transcripts
- **Export Options**: Export to PDF, Markdown, and Notion
- **Team Collaboration**: Share meetings and collaborate with team members
- **Stripe Subscription**: Freemium model with 3 free meetings/month

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **AI/ML**: OpenAI Whisper API, GPT-4 for analysis
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **UI Components**: Radix UI primitives
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Stripe account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/meeting-notes-ai.git
cd meeting-notes-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_ID_PRO_MONTHLY=price_xxx
STRIPE_PRICE_ID_PRO_YEARLY=price_xxx
STRIPE_PRICE_ID_BUSINESS_MONTHLY=price_xxx
STRIPE_PRICE_ID_BUSINESS_YEARLY=price_xxx
```

4. **Set up Supabase database**

Run the SQL schema in your Supabase SQL editor:

```bash
# Copy the contents of supabase-schema.sql
# Paste into Supabase SQL Editor and execute
```

5. **Set up Supabase Storage**

Create a storage bucket named `meeting-recordings`:

- Go to Supabase Dashboard → Storage
- Create a new bucket called `meeting-recordings`
- Set it to public or private based on your needs

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## API Integrations

### OpenAI Whisper API

The app uses OpenAI's Whisper API for transcription and GPT-4 for analysis.

**Setup:**

1. Get your API key from [OpenAI Platform](https://platform.openai.com)
2. Add to `.env.local` as `OPENAI_API_KEY`
3. Ensure you have sufficient credits for usage

**Features Used:**

- Whisper-1 model for transcription
- GPT-4-turbo for meeting analysis
- Token-based pricing (check [OpenAI Pricing](https://openai.com/pricing))

**Alternative: AssemblyAI**

For better speaker diarization, you can integrate AssemblyAI:

```typescript
// src/lib/assemblyai.ts
import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export async function transcribeWithSpeakers(audioUrl: string) {
  const transcript = await client.transcripts.transcribe({
    audio_url: audioUrl,
    speaker_labels: true,
  });
  return transcript;
}
```

### Supabase

**Database Tables:**

- `profiles`: User profiles and subscription info
- `meetings`: Meeting records
- `meeting_speakers`: Speaker information
- `transcription_segments`: Detailed transcript segments
- `teams`: Team workspaces
- `team_members`: Team membership
- `meeting_shares`: Shared meetings
- `meeting_comments`: Comments on meetings

**Row Level Security (RLS):**

All tables have RLS policies enabled to ensure users can only access their own data or shared data.

**Storage:**

Audio/video files are stored in Supabase Storage with proper access controls.

### Stripe

**Setup:**

1. Create a Stripe account
2. Set up products and prices:
   - Pro Monthly: $19.99/month
   - Pro Yearly: $199.99/year
   - Business Monthly: $49.99/month
   - Business Yearly: $499.99/year
3. Configure webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Add webhook secret to environment variables

**Webhook Events Handled:**

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Testing:**

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Deployment Guide

### Vercel (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**

- Go to [Vercel](https://vercel.com)
- Import your repository
- Add all environment variables
- Deploy

3. **Configure Stripe Webhook**

- Get your production URL from Vercel
- Add webhook endpoint in Stripe Dashboard: `https://yourdomain.com/api/stripe/webhook`
- Update `STRIPE_WEBHOOK_SECRET` in Vercel

4. **Update Supabase Settings**

- Add your Vercel URL to Supabase Auth allowed URLs
- Update redirect URLs in Supabase Auth settings

### Alternative: AWS/Docker

See `docs/deployment-aws.md` for AWS deployment guide.

## Pricing Strategy (Similar to Otter.ai)

### Competitive Analysis

| Feature | MeetingNotes AI | Otter.ai | Fireflies.ai |
|---------|----------------|----------|--------------|
| Free Meetings/Month | 3 | 3 | Unlimited |
| Free Meeting Duration | 60 min | 30 min | 60 min |
| Pro Price | $19.99/mo | $16.99/mo | $18/mo |
| Business Price | $49.99/mo | $30/mo | $29/mo |
| Speaker ID | ✓ | ✓ | ✓ |
| AI Summaries | ✓ | ✓ | ✓ |
| Export Options | PDF/MD/Notion | PDF/TXT | PDF/DOCX |
| Team Collaboration | ✓ | ✓ | ✓ |

### Pricing Tiers

**Free Tier:**
- 3 meetings per month
- Up to 60 minutes per meeting
- Basic transcription
- AI summary and key points
- Search functionality
- Export to PDF/Markdown

**Pro Tier ($19.99/mo or $199.99/year):**
- 50 meetings per month
- Up to 4 hours per meeting
- Advanced transcription
- AI summary, action items & decisions
- Speaker identification
- Advanced search with filters
- Export to PDF/Markdown/Notion
- Priority support
- Custom vocabulary

**Business Tier ($49.99/mo or $499.99/year):**
- Unlimited meetings
- Unlimited duration
- Premium transcription quality
- Advanced AI analysis
- Speaker identification
- Team collaboration
- Shared workspaces
- Advanced analytics
- Priority support
- Custom integrations
- API access

### Upsell Strategies

1. **Usage-Based Prompts**: Notify users when they're at 80% of their meeting limit
2. **Feature Gating**: Show preview of premium features (e.g., "Upgrade to see speaker names")
3. **Social Proof**: Display testimonials and user count on pricing page
4. **Urgency**: Limited-time discounts for annual plans
5. **Team Incentives**: Discount for teams of 5+ users

## Growth Hacking Ideas

### 1. Viral Loop & Referral Program

**Referral System:**
- Give 1 free month to both referrer and referee
- Implement shareable meeting links that showcase the platform
- Add "Transcribed by MeetingNotes AI" footer to exported files

**Implementation:**

```typescript
// src/lib/referrals.ts
export async function createReferralCode(userId: string) {
  const code = generateUniqueCode();
  await supabase.from('referral_codes').insert({
    user_id: userId,
    code,
    credits: 0,
  });
  return code;
}
```

### 2. Content Marketing & SEO

**Blog Topics:**
- "How to Take Better Meeting Notes"
- "The Ultimate Guide to Remote Meeting Management"
- "10 Ways AI is Transforming Business Communication"
- "Meeting Notes Templates for Every Industry"

**SEO Strategy:**
- Target long-tail keywords: "AI meeting transcription tool", "automatic meeting notes"
- Create industry-specific landing pages
- Guest post on business/productivity blogs

### 3. Product Hunt Launch

**Pre-Launch:**
- Build email list (landing page with "Notify me" button)
- Create teaser video
- Engage with Product Hunt community

**Launch Day:**
- Post at 12:01 AM PST
- Respond to every comment
- Offer exclusive lifetime deal for first 100 users
- Share across social media

### 4. Integration Marketplace

**Key Integrations:**
- Zoom: Auto-record and transcribe Zoom meetings
- Google Calendar: One-click meeting imports
- Slack: Post summaries to Slack channels
- Notion: Sync meetings to Notion databases
- Asana/Trello: Create tasks from action items

**API Webhooks:**

```typescript
// src/app/api/webhooks/zoom/route.ts
export async function POST(request: Request) {
  const { event, payload } = await request.json();

  if (event === 'recording.completed') {
    // Auto-transcribe Zoom recording
    await transcribeZoomRecording(payload);
  }

  return NextResponse.json({ success: true });
}
```

### 5. Freemium to Premium Conversion

**Tactics:**
- Show "You've used 2/3 free meetings this month" progress bar
- Email nurture sequence:
  - Day 1: Welcome & tutorial
  - Day 3: Feature spotlight (speaker ID)
  - Day 7: Success story
  - Day 14: Upgrade offer (20% off)
- In-app prompts when trying premium features

### 6. LinkedIn & Twitter Strategy

**LinkedIn:**
- Share meeting insights and statistics
- Post about remote work productivity
- Engage in HR and leadership groups
- Run LinkedIn ads targeting managers and executives

**Twitter:**
- Daily tips on meeting productivity
- Showcase AI-generated summaries (anonymized)
- Engage with remote work community
- Twitter Spaces on meeting best practices

### 7. Chrome Extension

Build a Chrome extension for one-click meeting recording:

```javascript
// manifest.json
{
  "name": "MeetingNotes AI Recorder",
  "version": "1.0",
  "permissions": ["tabCapture", "storage"],
  "action": {
    "default_popup": "popup.html"
  }
}
```

### 8. Educational Content

**Video Tutorials:**
- "How to Get the Most Out of Your Meetings"
- "Setting Up MeetingNotes AI in 2 Minutes"
- Weekly tips on YouTube

**Webinars:**
- "The Future of AI in Business Communication"
- Partner with productivity influencers

### 9. Strategic Partnerships

**Target Partners:**
- Project management tools (Asana, Monday.com)
- Video conferencing platforms (Zoom, Teams)
- CRM systems (HubSpot, Salesforce)
- Productivity apps (Notion, Evernote)

**Co-Marketing:**
- Joint webinars
- Bundle deals
- Cross-promotion

### 10. Gamification

**Features to Add:**
- Achievement badges (10 meetings transcribed, 100 action items created)
- Leaderboards for teams
- Meeting quality scores
- Productivity insights dashboard

### 11. Email Marketing

**Drip Campaigns:**

1. **Onboarding (Days 1-7):**
   - Welcome & first transcription
   - Feature discovery
   - Best practices

2. **Engagement (Ongoing):**
   - Weekly digest of meetings
   - Monthly productivity report
   - New feature announcements

3. **Re-engagement (Inactive Users):**
   - "We miss you" email
   - New features since last login
   - Limited-time upgrade offer

### 12. Affiliate Program

**Structure:**
- 30% recurring commission for 12 months
- Provide affiliates with:
  - Custom landing pages
  - Email templates
  - Banner ads
  - Tracking dashboard

**Target Affiliates:**
- Productivity bloggers
- Business coaches
- Virtual assistants
- Corporate trainers

## Performance Optimization

### Transcription

- Use streaming for large files
- Implement queue system for batch processing
- Cache frequently accessed transcripts

### Database

- Index on frequently queried fields
- Use Supabase real-time for live updates
- Implement pagination for large datasets

### Frontend

- Code splitting and lazy loading
- Image optimization with Next.js Image
- CDN for static assets

## Security Best Practices

- All API routes require authentication
- Row Level Security on all Supabase tables
- HTTPS only in production
- Rate limiting on API endpoints
- Input validation and sanitization
- Regular security audits

## Testing

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Build for production
npm run build
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.meetingnotes-ai.com](https://docs.meetingnotes-ai.com)
- Email: support@meetingnotes-ai.com
- Discord: [Join our community](https://discord.gg/meetingnotes-ai)

## Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] Real-time transcription
- [ ] Video recording and transcription
- [ ] Advanced speaker analytics
- [ ] Custom AI models
- [ ] API for third-party integrations
- [ ] SSO/SAML for enterprise
- [ ] Multi-language support
- [ ] Meeting scheduling integration
- [ ] Advanced team analytics

## Credits

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [OpenAI](https://openai.com)
- [Stripe](https://stripe.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)

---

**Made with ❤️ by the MeetingNotes AI Team**
