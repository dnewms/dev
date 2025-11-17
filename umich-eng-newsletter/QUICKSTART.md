# Quick Start Guide

Get the U-M Engineering Newsletter Builder up and running in 5 minutes!

## Prerequisites

- Node.js 18.17 or later
- npm (comes with Node.js)
- A code editor (VS Code recommended)

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, and more.

## Step 2: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your email provider API key:

**For SendGrid:**
```env
SENDGRID_API_KEY=SG.your_api_key_here
```

**For Mailchimp:**
```env
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
```

Don't have API keys yet? You can skip this for now and set it up later. The app will work without it (just can't send emails yet).

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see the U-M Engineering Newsletter Builder homepage!

## Next Steps

### 1. Explore the Builder

- Click "Create Newsletter" to try the drag-and-drop builder
- Drag blocks from the sidebar onto the canvas
- Click the edit icon to modify content
- See real-time preview on the right

### 2. Try a Template

- Go to "Templates" in the navigation
- Click "Use This Template" on any template
- Customize it in the builder

### 3. Add Sample Contacts

- Go to "Contacts"
- Click "Add Contact" to add one manually
- Or prepare a CSV file and use "Import CSV"

CSV format:
```csv
email,firstName,lastName,tags
john@umich.edu,John,Smith,student;engineering
```

### 4. View Analytics (Demo)

- Go to "Analytics" to see the dashboard
- Note: Real data appears after sending newsletters

### 5. Browse Archive

- Go to "Archive" to see all newsletters
- Filter by draft or sent status

## Common Tasks

### Build for Production

```bash
npm run build
npm start
```

### Run Linter

```bash
npm run lint
```

### Verify Setup

```bash
./verify-setup.sh
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Dependencies Won't Install

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Page Won't Load

1. Make sure dev server is running
2. Check for errors in terminal
3. Clear browser cache
4. Try incognito/private mode

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Press: Ctrl+Shift+P (or Cmd+Shift+P on Mac)
# Type: "TypeScript: Restart TS Server"
```

## Getting Email API Keys

### SendGrid (Recommended)

1. Sign up at [sendgrid.com](https://signup.sendgrid.com/)
2. Verify your email
3. Go to Settings → API Keys
4. Click "Create API Key"
5. Select "Full Access" permission
6. Copy the key (you won't see it again!)
7. Add to `.env.local`

**Free tier includes:** 100 emails/day

### Mailchimp

1. Sign up at [mailchimp.com](https://mailchimp.com/signup/)
2. Complete account setup
3. Go to Account → Extras → API keys
4. Click "Create A Key"
5. Copy the key and server prefix
6. Add both to `.env.local`

**Free tier includes:** 500 contacts, 1,000 emails/month

## Learning Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **React DnD**: [react-dnd.github.io/react-dnd](https://react-dnd.github.io/react-dnd/)

## Need More Help?

- Read the comprehensive [README.md](README.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- See [CHANGELOG.md](CHANGELOG.md) for version history

## What's Next?

Once you're comfortable with the basics:

1. **Deploy to production** - See DEPLOYMENT.md
2. **Customize branding** - Edit `tailwind.config.ts`
3. **Add new features** - See CONTRIBUTING.md
4. **Set up analytics** - Configure SendGrid/Mailchimp webhooks
5. **Add database** - Migrate from localStorage to PostgreSQL/MongoDB

## Quick Reference

### File Structure
```
umich-eng-newsletter/
├── app/              # Pages and routes
├── components/       # React components
├── lib/             # Utilities and state
├── public/          # Static assets
└── ...config files
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Important Files
- `app/page.tsx` - Homepage
- `app/builder/page.tsx` - Newsletter builder
- `lib/store.ts` - Application state
- `tailwind.config.ts` - Styling configuration

### Default Ports
- Development: 3000
- Production: 3000 (or PORT env variable)

---

You're all set! Start building amazing newsletters for U-M Engineering! 〽️

**Questions?** Check the other documentation files or the inline code comments.
