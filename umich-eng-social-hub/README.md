# UMich Engineering Social Hub

A comprehensive social media content management system built for the University of Michigan College of Engineering. Streamline your social media workflow with intelligent scheduling, content management, and analytics.

![UMich Engineering](https://upload.wikimedia.org/wikipedia/commons/9/93/Michigan_Wolverines_logo.svg)

## Features

### Content Management
- **Multi-Platform Scheduler**: Schedule posts for Twitter/X, LinkedIn, and Instagram from a single interface
- **Content Calendar**: Visual calendar view to plan and organize your social media content
- **Content Library**: Centralized asset management for images, videos, and documents
- **Draft Management**: Save and edit posts before publishing

### Intelligent Features
- **AI-Powered Caption Generation**: Generate engaging captions using advanced AI
- **Hashtag Suggestions**: Get relevant, trending hashtag recommendations
- **Optimal Posting Times**: Data-driven suggestions for maximum engagement
- **Character Count Tracking**: Platform-specific character limits with real-time validation

### Workflow & Collaboration
- **Approval Workflow**: Multi-level content approval system for quality control
- **Role-Based Access**: Admin, Editor, and Viewer roles with appropriate permissions
- **Activity Tracking**: Monitor who created, edited, and approved content

### Analytics & Insights
- **Performance Dashboard**: Track impressions, engagements, and growth metrics
- **Platform Comparison**: Analyze performance across different social networks
- **Top Posts Analysis**: Identify your best-performing content
- **Trend Visualization**: Interactive charts using Recharts

### Brand Consistency
- **Michigan Branding**: Official UMich blue (#00274C) and maize (#FFCB05) color scheme
- **Responsive Design**: Mobile-friendly interface for on-the-go management
- **Accessibility**: Built with WCAG compliance in mind

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/umich/umich-eng-social-hub.git
cd umich-eng-social-hub
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Twitter/X API (Optional - for production integration)
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# LinkedIn API (Optional - for production integration)
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_ORGANIZATION_ID=your_org_id

# Instagram/Facebook API (Optional - for production integration)
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_ACCOUNT_ID=your_account_id

# OpenAI API (Optional - for AI caption generation)
OPENAI_API_KEY=your_openai_api_key

# Database (Optional - for production)
DATABASE_URL=postgresql://user:password@localhost:5432/social_hub
```

> **Note**: The application works with mock data out of the box. API credentials are only needed for production deployment with real social media integration.

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
umich-eng-social-hub/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── calendar/          # Calendar view page
│   │   ├── scheduler/         # Post scheduler page
│   │   ├── library/           # Content library page
│   │   ├── analytics/         # Analytics dashboard page
│   │   ├── approvals/         # Approval workflow page
│   │   ├── ai-suggestions/    # AI suggestions page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Dashboard page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── calendar/         # Calendar components
│   │   ├── scheduler/        # Scheduler components
│   │   ├── library/          # Library components
│   │   ├── analytics/        # Analytics components
│   │   ├── workflow/         # Workflow components
│   │   ├── suggestions/      # AI suggestions components
│   │   └── Navigation.tsx    # Main navigation
│   ├── lib/                   # Utility functions
│   │   └── utils.ts          # Helper functions
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # Type definitions
│   └── data/                  # Mock data
│       └── mockData.ts       # Sample data for development
├── public/                    # Static assets
├── API_INTEGRATION.md        # API integration guide
├── README.md                 # This file
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
├── next.config.ts            # Next.js config
└── postcss.config.mjs        # PostCSS config
```

## Usage Guide

### Dashboard

The main dashboard provides an overview of your social media activity:
- Quick stats: scheduled posts, pending approvals, published content
- Recent activity feed
- Quick action buttons

### Content Calendar

View all scheduled posts in a monthly calendar format:
- Navigate between months using arrow buttons
- Click on any day to see scheduled posts
- Color-coded platform indicators (Twitter: blue, LinkedIn: dark blue, Instagram: pink)
- View post times and preview content

### Post Scheduler

Create and schedule posts for multiple platforms:

1. **Select Platforms**: Choose Twitter/X, LinkedIn, and/or Instagram
2. **Write Content**: Compose your post with real-time character count
3. **Add Hashtags**: Use the hashtag input or AI suggestions
4. **Schedule**: Set date and time for posting
5. **Upload Media**: Add images or videos (optional)
6. **Save or Publish**: Save as draft, schedule for later, or publish immediately

### Content Library

Manage your media assets:
- Upload images, videos, and documents
- Search and filter by type
- Tag assets for easy organization
- Download or delete assets
- View file metadata (size, upload date, creator)

### Analytics Dashboard

Track your social media performance:
- **Key Metrics**: Impressions, engagements, engagement rate, follower growth
- **Engagement Tab**: Weekly engagement trends by platform
- **Platforms Tab**: Distribution of engagement across platforms
- **Performance Tab**: Monthly trends for impressions and engagements
- **Top Posts**: View your best-performing content

### Content Approvals

Manage the approval workflow:
- Review pending posts before they go live
- Approve or reject with comments
- View approval history
- Track average review time

### AI Suggestions

Leverage AI for better content:
- **Caption Generator**: Generate engaging captions based on your topic
- **Hashtag Suggestions**: Browse trending and category-specific hashtags
- **Posting Times**: See optimal posting times for each platform

## Customization

### Branding

To customize the branding, edit `tailwind.config.ts`:

```typescript
colors: {
  'umich-blue': '#00274C',    // Primary brand color
  'umich-maize': '#FFCB05',   // Secondary brand color
  'umich-teal': '#00B2A9',    // Accent color
  'umich-orange': '#D86018',  // Warning/alert color
  'umich-gray': '#989C97',    // Neutral color
}
```

### Adding Custom Components

1. Create new components in `src/components/`
2. Follow the existing component structure
3. Use TypeScript for type safety
4. Leverage shadcn/ui components for consistency

## API Integration

For production deployment with real social media APIs, see [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed setup instructions for:

- Twitter/X API
- LinkedIn API
- Instagram Graph API
- OpenAI API (for AI features)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

```bash
npm install -g vercel
vercel
```

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build plugin
- **AWS Amplify**: Configure build settings for Next.js
- **DigitalOcean App Platform**: Select Next.js as the framework
- **Self-hosted**: Build and run with `npm run build && npm start`

### Build for Production

```bash
npm run build
npm start
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t umich-social-hub .
docker run -p 3000:3000 umich-social-hub
```

## Development Workflow

### Adding a New Feature

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Create a pull request

### Code Style

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Keep components small and focused

### Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

### Build Errors

Clear Next.js cache:

```bash
rm -rf .next
npm run build
```

### Module Not Found

Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

### Production Optimizations

- All images use Next.js Image component for automatic optimization
- Code splitting via Next.js dynamic imports
- CSS is automatically minified and optimized
- Static pages are pre-rendered at build time

### Best Practices

- Keep bundle size small by lazy loading heavy components
- Use React.memo() for expensive component renders
- Implement pagination for large data sets
- Cache API responses when appropriate

## Security

### Best Practices

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Implement CSRF protection
- Validate all user inputs
- Use HTTPS in production
- Regularly update dependencies
- Implement rate limiting for APIs

### Authentication (Production)

For production, implement authentication using:
- NextAuth.js for social login
- Auth0 for enterprise SSO
- Custom JWT authentication

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support:
- **Email**: engineering-social@umich.edu
- **Documentation**: [Internal Wiki](https://wiki.umich.edu/social-hub)
- **Issue Tracker**: [GitHub Issues](https://github.com/umich/umich-eng-social-hub/issues)

## Acknowledgments

- University of Michigan College of Engineering
- Marketing and Communications Team
- Open source community for amazing tools

---

**Built with pride at the University of Michigan College of Engineering**

Go Blue! 〽️
