# Quick Start Guide

Get your UMich Engineering Social Hub up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

That's it! The application works with mock data out of the box.

## What You'll See

When you open the application, you'll have access to:

### Dashboard (/)
- Overview of your social media activity
- Quick stats and recent posts
- Quick action buttons

### Content Calendar (/calendar)
- Monthly view of scheduled posts
- Color-coded platform indicators
- Interactive date navigation

### Post Scheduler (/scheduler)
- Multi-platform post creation
- Real-time character count
- Hashtag management
- Media upload placeholder
- Schedule or publish immediately

### Content Library (/library)
- Asset management interface
- File upload area
- Search and filter functionality
- Mock sample assets

### Analytics (/analytics)
- Performance metrics dashboard
- Interactive charts and graphs
- Platform comparison
- Top posts analysis

### Approvals (/approvals)
- Content approval workflow
- Review and approve/reject posts
- Approval history

### AI Suggestions (/ai-suggestions)
- AI caption generator
- Hashtag suggestions by category
- Optimal posting times

## Next Steps

### For Development

The app uses mock data located in `src/data/mockData.ts`. You can modify this data to test different scenarios.

### For Production

1. **Set up API credentials**: See [API_INTEGRATION.md](./API_INTEGRATION.md)
2. **Configure environment**: Copy `.env.example` to `.env.local`
3. **Add your credentials**: Fill in the API keys
4. **Build for production**: `npm run build`
5. **Deploy**: See deployment options in [README.md](./README.md)

## Common Commands

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint -- --fix # Auto-fix linting issues
```

## Need Help?

- Full documentation: [README.md](./README.md)
- API integration: [API_INTEGRATION.md](./API_INTEGRATION.md)
- Issues: Create an issue on GitHub

## Tips

1. **Navigation**: Use the top navigation bar to switch between sections
2. **Michigan Branding**: The UI uses official UMich colors (Blue #00274C and Maize #FFCB05)
3. **Responsive**: The interface works on mobile, tablet, and desktop
4. **Mock Data**: All data is currently mocked - perfect for testing and development

Enjoy using the UMich Engineering Social Hub!
