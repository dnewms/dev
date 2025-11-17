# Quick Start Guide

Get your solar ROI calculator up and running in 15 minutes!

## 1. Install & Run Locally (5 minutes)

```bash
# Navigate to project
cd solar-roi-calculator

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you should see the calculator!

## 2. Deploy to Vercel (5 minutes)

### Option A: GitHub + Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Solar ROI Calculator"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Done! Your app is live in ~2 minutes

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts - your app will be deployed instantly!

## 3. Start Monetizing (5 minutes)

### Set Up Lead Collection

**Fastest way: Google Sheets + Zapier**

1. **Create Google Sheet:**
   - Name it "Solar Leads"
   - Add columns: Name, Email, Phone, ZIP Code, Savings, Date

2. **Set Up Zapier (FREE):**
   - Go to [zapier.com](https://zapier.com/app/signup)
   - Create Zap: "Webhooks by Zapier" (Catch Hook)
   - Copy the webhook URL

3. **Add to Your App:**
   - Create file `.env.local` in project root:
   ```env
   LEAD_WEBHOOK_URL=YOUR_ZAPIER_WEBHOOK_URL
   ```

4. **Connect to Google Sheets:**
   - In Zapier, add action: "Google Sheets" → "Create Spreadsheet Row"
   - Map the fields:
     - Name → {{name}}
     - Email → {{leadData__email}}
     - Phone → {{leadData__phone}}
     - ZIP Code → {{leadData__zipCode}}
     - Savings → {{leadData__calculationResults__savings25Years}}
     - Date → {{timestamp}}

5. **Test it:**
   - Run calculator locally
   - Submit a test lead
   - Check your Google Sheet - lead should appear!

**You're now capturing leads! 🎉**

## 4. Next Steps (Choose Your Path)

### Path 1: Focus on SEO (Free Traffic)

**This Week:**
- [ ] Write 3 blog posts (use ChatGPT to help):
  - "How Much Do Solar Panels Cost in [Your State]?"
  - "Solar Panel ROI Calculator: Is Solar Worth It?"
  - "Federal Solar Tax Credit: Save 30% in 2024"

**Next Week:**
- [ ] Share on Reddit (r/solar, r/homeimprovement)
- [ ] Post in Facebook groups
- [ ] Create Pinterest infographic

**Goal:** 100 visitors in first week

### Path 2: Partner with Solar Installers (Fast Revenue)

**This Week:**
- [ ] Google: "solar installers [your city]"
- [ ] Call/email top 10 companies
- [ ] Pitch: "I'll send you qualified leads for $100 each"
- [ ] Get 2-3 partners

**Email Template:**
```
Subject: Qualified Solar Leads for [Your Company]

Hi [Name],

I run SolarROICalculator.com - we help homeowners calculate their
solar savings and connect them with installers.

Each lead includes:
- Full contact details
- Property information
- System size estimate
- Estimated 25-year savings

Would you be interested in receiving qualified leads from your area?
Typical rate: $75-150 per lead.

Let me know!

Best,
[Your Name]
```

**Goal:** 1 partner, $500 in first month

### Path 3: Affiliate Marketing (Passive Income)

**This Week:**
- [ ] Sign up for Amazon Associates
- [ ] Apply to EnergySage affiliate program
- [ ] Add affiliate links to `components/AffiliateLinks.tsx`

**Products to Promote:**
- Solar panels (Amazon)
- Battery storage (Tesla, etc.)
- Solar quotes (EnergySage)

**Goal:** First affiliate sale in 30 days

## 5. Customize Your Calculator

### Update State Incentives

Edit `lib/incentives.ts` to add/update local rebates and programs.

### Change Calculations

Edit `lib/calculations.ts` to adjust:
- System cost estimates
- Panel efficiency
- Electricity rate inflation

### Add Your Branding

Edit `app/page.tsx`:
- Replace "Solar ROI Calculator" with your brand
- Update colors in `tailwind.config.ts`
- Add your logo

### Customize Lead Form

Edit `components/LeadCaptureForm.tsx`:
- Add/remove fields
- Change when modal appears
- Update messaging

## 6. Set Up Analytics (Optional but Recommended)

1. **Get Google Analytics ID:**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create property
   - Copy Measurement ID (G-XXXXXXXXXX)

2. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Track Everything:**
   - Page views (automatic)
   - Calculator submissions
   - Lead conversions
   - Affiliate clicks

## 7. Drive Your First Traffic

### Today (15 minutes):
- [ ] Post in r/solar: "I built a free solar ROI calculator"
- [ ] Share in 3 Facebook groups
- [ ] Tell friends/family

### This Week (2 hours):
- [ ] Answer 5 questions on Quora about solar
- [ ] Create 1 YouTube video demo
- [ ] Write 1 blog post

### This Month (10 hours):
- [ ] Write 8 blog posts (2 per week)
- [ ] Build 10 backlinks
- [ ] Engage in online communities

## Common Questions

**Q: How do I get my first lead?**
A: Share on Reddit, Facebook groups, and with people you know who are considering solar.

**Q: When will I make money?**
A: With installer partnerships, potentially week 1-2. With affiliate marketing, typically 2-4 weeks.

**Q: What if I have no traffic?**
A: Start with free methods: Reddit, Facebook, Quora. Create valuable content. Be patient with SEO (3-6 months).

**Q: Can I change the design?**
A: Yes! Edit the components in `/components` and styles in `tailwind.config.ts`.

**Q: Do I need to know how to code?**
A: Not really. You can customize by following examples in the code. Use ChatGPT to help!

## Troubleshooting

**Calculator not working?**
- Check browser console for errors
- Make sure you ran `npm install`
- Try `npm run dev` and refresh

**Leads not being captured?**
- Check `.env.local` file exists
- Verify webhook URL is correct
- Test webhook in Zapier

**Build errors?**
- Run `npm install` again
- Delete `.next` folder and rebuild
- Check Node.js version (need 18+)

## Get Help

- **Documentation**: See README.md
- **Monetization Guide**: See MONETIZATION.md
- **GitHub Issues**: Report bugs
- **Community**: Join discussions

## Your First Week Checklist

- [ ] Day 1: Deploy to Vercel
- [ ] Day 2: Set up lead collection
- [ ] Day 3: Write first blog post
- [ ] Day 4: Share on Reddit/Facebook
- [ ] Day 5: Contact 5 solar installers
- [ ] Day 6: Apply to 2 affiliate programs
- [ ] Day 7: Review analytics, plan next week

## Success Metrics

**Week 1:**
- 50-100 visitors
- 1-5 calculator submissions
- 0-2 leads

**Month 1:**
- 500-1,000 visitors
- 50-100 calculator submissions
- 10-25 leads
- $100-500 revenue

**Month 3:**
- 2,000-5,000 visitors
- 200-500 calculator submissions
- 50-100 leads
- $1,000-3,000 revenue

---

**Ready to start?** Run `npm run dev` and let's build your passive income stream! 🚀

Need help? Check MONETIZATION.md for detailed strategies.
