# Solar Panel ROI Calculator - Passive Income Web App

A comprehensive, production-ready solar panel ROI calculator built with Next.js 14, TypeScript, and Tailwind CSS. This app helps users calculate their solar investment returns while generating passive income through lead generation and affiliate marketing.

## Features

- **ROI Calculator**: Accurate solar investment calculations with:
  - System size estimation based on roof dimensions
  - 25-year savings projections
  - Payback period analysis
  - Real-time ROI calculations

- **Interactive Visualizations**:
  - Monthly production charts
  - 25-year cumulative savings graphs
  - Break-even analysis charts
  - Responsive Recharts integration

- **Incentives Database**:
  - Federal tax credits (30% ITC)
  - State-specific incentives for all 50 states
  - Local rebate information
  - Utility program details

- **Lead Generation System**:
  - Modal-based lead capture forms
  - Integration-ready API endpoints
  - Webhook support for CRM systems
  - Email notification system

- **PDF Report Generation**:
  - Professional multi-page reports
  - Detailed savings breakdown
  - State incentives information
  - Downloadable analysis

- **SEO Optimized**:
  - Next.js metadata for search engines
  - Open Graph tags for social sharing
  - Structured data markup
  - Mobile-responsive design

- **Affiliate Integration**:
  - Product recommendation section
  - Tracking for affiliate clicks
  - Customizable affiliate links

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF Generation**: jsPDF with autoTable
- **Form Handling**: React Hook Form + Zod validation

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd solar-roi-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env.local`):
```env
# Lead Generation Webhook (Optional - Zapier, Make.com, n8n)
LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/

# Email Service (Optional - SendGrid, Resend, Mailgun)
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=noreply@yourdomain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Affiliate IDs (Replace with your actual IDs)
NEXT_PUBLIC_TESLA_AFFILIATE_ID=your_id
NEXT_PUBLIC_SUNPOWER_AFFILIATE_ID=your_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Other Platforms

**Netlify:**
```bash
npm run build
# Deploy the .next folder
```

**AWS Amplify, Railway, Render** - All support Next.js deployments out of the box.

## Monetization Strategies

### 1. Lead Generation ($50-200 per qualified lead)

**How it works:**
- Users calculate their ROI
- Lead capture form appears after calculation
- Submit leads to solar installer networks
- Earn commission per qualified lead

**Lead Buyers:**
- EnergySage.com - Partner program
- Solar.com - Affiliate program
- SolarReviews.com - Referral program
- Local solar installers - Direct partnerships

**Implementation:**
```typescript
// In app/api/leads/route.ts
// Configure webhook to send leads to your partner
const response = await fetch(process.env.LEAD_WEBHOOK_URL, {
  method: 'POST',
  body: JSON.stringify(leadData)
});
```

**Revenue potential:**
- 100 leads/month × $100/lead = **$10,000/month**

### 2. Affiliate Marketing ($50-500 per sale)

**Solar Equipment Affiliates:**
- **Tesla Energy** - Powerwall referrals
- **SunPower** - Panel sales
- **Enphase** - Inverter affiliate program
- **SolarEdge** - Equipment affiliate program

**General Affiliates:**
- Amazon Associates - Solar products
- Home Depot - Solar equipment
- Impact Radius - Solar marketplace

**Implementation:**
Update `components/AffiliateLinks.tsx` with your affiliate links.

**Revenue potential:**
- 20 sales/month × $150/sale = **$3,000/month**

### 3. Display Advertising (Once you have traffic)

**Ad Networks:**
- Google AdSense
- Media.net
- Ezoic (better for solar/finance niche)

**Revenue potential:**
- 10,000 visitors/month × $5 RPM = **$500/month**

### 4. Sponsored Content

Once you have traffic, charge solar companies for:
- Featured installer listings
- Sponsored blog posts
- Premium placement in results

**Revenue potential:**
- 5 sponsors × $500/month = **$2,500/month**

### 5. White Label Licensing

License your calculator to:
- Solar installation companies
- Real estate websites
- Home improvement sites

**Revenue potential:**
- 10 licenses × $99/month = **$990/month**

## SEO Strategy

### On-Page SEO (Already Implemented)

- ✅ Optimized meta titles and descriptions
- ✅ Structured heading hierarchy (H1, H2, H3)
- ✅ Alt text for images
- ✅ Mobile-responsive design
- ✅ Fast loading times (Next.js optimization)
- ✅ Schema markup ready

### Content Marketing Ideas

**Blog Posts to Create:**
1. "How Much Do Solar Panels Cost in [State] in 2024?"
2. "Solar Panel ROI: Complete Guide to Solar Investment Returns"
3. "Federal Solar Tax Credit: How to Claim 30% Back"
4. "Best Solar Panels for Your Home: 2024 Comparison"
5. "Solar Payback Period: When Will You Break Even?"
6. "State Solar Incentives Guide: All 50 States"
7. "How to Finance Solar Panels: Options & Best Rates"
8. "Solar Panel Installation: What to Expect"
9. "Net Metering Explained: Sell Power Back to Grid"
10. "Solar Battery Storage: Is It Worth It?"

**SEO Keywords to Target:**
- Primary: "solar panel calculator", "solar ROI calculator"
- Secondary: "solar panel cost calculator", "solar savings calculator"
- Long-tail: "how much will solar panels save me", "solar panel payback period calculator"
- Local: "solar panel cost in [city/state]"

### Link Building Strategy

1. **Resource Pages**: Get listed on solar resource directories
2. **Guest Posting**: Write for home improvement blogs
3. **Broken Link Building**: Find broken calculator links on solar sites
4. **Partnerships**: Partner with solar installers for backlinks
5. **Press Releases**: Launch announcements to solar news sites

### Local SEO

Create state-specific pages:
- `/california-solar-calculator`
- `/texas-solar-calculator`
- `/new-york-solar-calculator`

Each with localized content and incentives.

## Traffic Generation

### Free Methods

1. **Reddit**: Post in r/solar, r/homeimprovement, r/frugal
2. **Facebook Groups**: Home improvement, green energy groups
3. **YouTube**: Create "How to Calculate Solar ROI" videos
4. **Pinterest**: Infographics about solar savings
5. **Quora**: Answer solar-related questions with calculator link
6. **LinkedIn**: Articles about solar investment

### Paid Methods

**Google Ads:**
- Target: "solar calculator", "solar panel cost"
- Cost: $2-5 per click
- Conversion: 10-20% to leads

**Facebook Ads:**
- Target: Homeowners 35-65, interested in sustainability
- Cost: $0.50-2 per click
- Use lead magnet: "Free Solar Savings Report"

**Content Marketing:**
- Hire writers on Upwork/Fiverr
- Publish 2-4 blog posts per week
- Build organic traffic over time

## Analytics & Tracking

### Google Analytics Setup

Add to `app/layout.tsx`:

```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
  `}
</Script>
```

### Events to Track

- Calculator submissions
- Lead form submissions
- Affiliate link clicks
- PDF downloads
- Time on page
- Scroll depth

## Customization Guide

### Update Affiliate Links

1. Open `components/AffiliateLinks.tsx`
2. Replace placeholder URLs with your affiliate links
3. Add product images to `/public/products/`
4. Update analytics tracking

### Modify Calculations

Edit `lib/calculations.ts` to adjust:
- System degradation rate
- Electricity inflation rate
- Panel efficiency factors
- Cost estimates

### Add More States

Update `lib/incentives.ts`:
- Add state incentive data
- Update production factors
- Include utility programs

### Customize Lead Form

Modify `components/LeadCaptureForm.tsx`:
- Add/remove form fields
- Change validation rules
- Update submission logic

## Lead Integration Examples

### Zapier Integration

1. Create Zapier account
2. Create Zap: Webhook → Google Sheets/Email/CRM
3. Copy webhook URL to `.env.local`
4. Leads automatically sync to your system

### Email Integration (SendGrid)

```typescript
// In app/api/leads/route.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: data.email,
  from: 'noreply@yourdomain.com',
  subject: 'Your Solar Analysis Report',
  html: `<strong>Thank you for using our calculator!</strong>`
});
```

### Database Integration (Supabase)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

await supabase.from('leads').insert([
  {
    name: data.name,
    email: data.email,
    estimated_savings: calculationResults.savings25Years
  }
]);
```

## Revenue Timeline Projection

**Month 1-3: Setup & Content**
- Build and deploy app
- Create 10-15 blog posts
- Set up social media presence
- Revenue: $0-500

**Month 4-6: Traffic Growth**
- SEO starts working
- 1,000-5,000 visitors/month
- First affiliate sales
- Revenue: $500-2,000/month

**Month 7-12: Scaling**
- 10,000-50,000 visitors/month
- Established lead flow
- Multiple revenue streams
- Revenue: $3,000-10,000/month

**Month 12+: Passive Income**
- Consistent traffic
- Automated lead generation
- Multiple partnerships
- Revenue: $5,000-20,000/month

## Legal Requirements

### Required Pages

Create these legal pages (templates available online):
1. Privacy Policy (`/privacy`)
2. Terms of Service (`/terms`)
3. Disclaimer (`/disclaimer`)
4. Contact Page (`/contact`)

### Disclaimers

Add to footer and results page:
> "Estimates are for informational purposes only. Actual results may vary. Consult with licensed solar professionals for accurate quotes."

### Affiliate Disclosure

Add to pages with affiliate links:
> "We may earn a commission from purchases made through affiliate links at no additional cost to you."

## Maintenance

### Monthly Tasks

- Review and respond to leads
- Update state incentive data
- Add new blog content
- Check affiliate link status
- Review analytics data

### Quarterly Tasks

- Update solar production factors
- Review and optimize SEO
- Test lead form functionality
- Update pricing data

## Support & Community

- **Documentation**: This README
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Updates**: Follow for new features

## License

MIT License - feel free to use for commercial purposes

## Conclusion

This solar calculator is a complete passive income system. Follow the monetization strategies, create consistent content, and drive traffic to build a sustainable online business.

**Estimated passive income potential: $2,000-15,000/month** depending on traffic and optimization.

Good luck building your passive income stream!

---

**Next Steps:**
1. Deploy to Vercel
2. Set up Google Analytics
3. Create 5 blog posts
4. Apply to affiliate programs
5. Partner with solar installers
6. Drive initial traffic via Reddit/social media
7. Monitor and optimize

**Questions?** Open an issue or discussion in the repository.
