# Quick Start Guide

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
- Get them from [supabase.com](https://supabase.com) after creating a project
- Copy your Project URL and anon key

### 3. Set Up Database
- Go to your Supabase project SQL Editor
- Run the SQL from `supabase-setup.sql`
- This creates all necessary tables and indexes

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## That's It!

You now have a fully functional event management system with:
- Analytics Dashboard
- Event Creation & Management
- QR Code Check-In System
- Photo Gallery

## Next Steps

1. Customize the Michigan branding if needed in `tailwind.config.ts`
2. Add authentication if required
3. Deploy to Vercel (see README.md for instructions)

## Troubleshooting

**Build errors?** Run:
```bash
npm run lint
npm run build
```

**Database issues?** Check your `.env.local` file has correct Supabase credentials.

**Need help?** See the full README.md for detailed instructions.
