# UMich Engineering Events

A modern, production-ready event management and promotion platform built for the University of Michigan Engineering Department. Features a beautiful Michigan Blue and Maize color scheme, comprehensive event management, QR code check-in, analytics dashboard, and photo gallery.

![Michigan Blue](https://img.shields.io/badge/Michigan-Blue-%2300274C)
![Maize](https://img.shields.io/badge/Maize-Gold-%23FFCB05)
![Next.js 14](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## Features

### Event Management
- **Create & Edit Events**: Intuitive interface for creating and managing engineering department events
- **Event Status Tracking**: Draft, published, and cancelled event states
- **Capacity Management**: Track registrations against event capacity with real-time percentage calculations
- **Event Details**: Comprehensive event information including date, time, location, and descriptions

### QR Code Check-In System
- **Digital QR Codes**: Automatically generated unique QR codes for each registration
- **Quick Check-In**: Scan or search to check in attendees instantly
- **Real-Time Status**: Live check-in statistics and attendee tracking
- **Manual Override**: Search by name, email, or QR code for manual check-in
- **Timestamp Tracking**: Records exact check-in times for attendance verification

### Analytics Dashboard
- **Event Metrics**: Total events, attendees, and average attendance tracking
- **Visual Charts**: Bar charts for events per month and line graphs for attendance trends
- **Recent Events**: Quick overview of upcoming and completed events
- **Performance Indicators**: Month-over-month growth percentages
- **Photo Gallery Stats**: Track uploaded event photos

### Photo Gallery
- **Event Photo Management**: Upload and organize photos by event
- **Filter by Event**: Quick filtering to view photos from specific events
- **Lightbox View**: Full-screen photo viewing with captions
- **Event Badges**: Clear event labeling on all photos
- **Responsive Grid**: Beautiful, responsive photo grid layout

### Design & UX
- **Michigan Branding**: Authentic Michigan Blue (#00274C) and Maize (#FFCB05) color scheme
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Modern UI Components**: Built with shadcn/ui for consistent, accessible components
- **Smooth Animations**: Tailwind CSS animations for enhanced user experience
- **Error Handling**: Production-ready error handling and validation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **QR Codes**: react-qr-code, qrcode
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.17 or later
- npm, yarn, pnpm, or bun package manager
- A Supabase account (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd umich-eng-events
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (note your project URL and anon key)

#### Create Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled'))
);

-- Registrations table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  qr_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_qr_code ON registrations(qr_code);
CREATE INDEX idx_photos_event_id ON photos(event_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
CREATE POLICY "Enable read access for all users" ON events FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON registrations FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON photos FOR SELECT USING (true);
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the values in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@umich.edu
SMTP_PASSWORD=your_email_password

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How to Run Locally

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Project Structure

```
umich-eng-events/
├── app/                      # Next.js app directory
│   ├── check-in/            # QR code check-in page
│   ├── events/              # Event management page
│   ├── gallery/             # Photo gallery page
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx             # Dashboard (analytics)
│   └── globals.css          # Global styles with Michigan colors
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   └── textarea.tsx
│   └── navigation.tsx       # Main navigation component
├── lib/                     # Utility functions
│   ├── utils.ts            # Helper utilities
│   └── supabase.ts         # Supabase client
├── types/                   # TypeScript type definitions
│   └── database.ts         # Supabase database types
├── public/                  # Static assets
├── .env.example            # Environment variables template
├── components.json         # shadcn/ui configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Deployment Options

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Configure Domain** (optional):
   - Go to your project settings
   - Add custom domain (e.g., events.umich.edu)

### Deploy to Other Platforms

The application can also be deployed to:
- **Netlify**: Connect your GitHub repo and configure build settings
- **AWS Amplify**: Use the Amplify Console for deployment
- **Railway**: One-click deployment with GitHub integration
- **DigitalOcean App Platform**: Container-based deployment

All platforms require the same environment variables as listed in `.env.example`.

## Screenshots & Mockups

### Dashboard (Analytics)
The main dashboard displays:
- Four key metrics cards (Total Events, Total Attendees, Avg. Attendance, Photo Gallery)
- Bar chart showing events per month (Michigan Blue bars)
- Line chart showing attendance trends (Maize line)
- Recent events list with status badges

### Event Management
Event management page features:
- Create new event form with all necessary fields
- Event cards showing title, description, date, location, and capacity
- Status badges (draft/published/cancelled)
- Registration tracking with percentage filled
- Edit and delete buttons for each event

### QR Code Check-In
Check-in system includes:
- Search interface for finding registrations
- Live QR code preview with attendee details
- Check-in statistics (Total, Checked In, Pending)
- One-click check-in functionality
- Timestamp recording for each check-in

### Photo Gallery
Gallery page displays:
- Responsive grid of event photos
- Filter buttons for each event
- Photo cards with event badges and captions
- Lightbox modal for full-size viewing
- Upload interface for new photos

All pages feature the Michigan Blue (#00274C) header with the Michigan "M" logo and Maize (#FFCB05) accent colors throughout.

## Future Enhancements

- Email notification system for event reminders
- Calendar export (iCal format)
- Advanced analytics with export to CSV
- Multi-language support
- Mobile app (React Native)
- Integration with UMich authentication system
- Automated email campaigns
- Social media integration
- Event feedback and surveys
- Waitlist management

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is developed for the University of Michigan Engineering Department.

## Support

For support, please contact the UMich Engineering IT department or open an issue in the repository.

## Acknowledgments

- University of Michigan Engineering Department
- Next.js and Vercel team
- shadcn for the amazing UI components
- Supabase for the backend infrastructure

---

**Go Blue!** 〽️
