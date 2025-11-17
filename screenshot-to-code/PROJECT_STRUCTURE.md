# Project Structure

This document explains the organization and architecture of the Screenshot to Code application.

## Directory Structure

```
screenshot-to-code/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/    # NextAuth authentication
│   │   │       └── route.ts
│   │   ├── generate/             # Code generation endpoint
│   │   │   └── route.ts
│   │   └── stripe/               # Payment processing
│   │       ├── checkout/
│   │       │   └── route.ts      # Create checkout session
│   │       └── webhook/
│   │           └── route.ts      # Handle payment events
│   ├── dashboard/                # User dashboard page
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Main conversion interface
│   ├── providers.tsx             # SessionProvider wrapper
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ImageUpload.tsx           # Drag-and-drop file upload
│   ├── CodeEditor.tsx            # Monaco code editor
│   └── CodePreview.tsx           # Live preview with responsive controls
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client singleton
│   ├── stripe.ts                 # Stripe configuration
│   └── openai.ts                 # OpenAI API integration
├── prisma/                       # Database
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── LICENSE                       # MIT License
├── README.md                     # Main documentation
├── QUICKSTART.md                 # Quick setup guide
├── PROJECT_STRUCTURE.md          # This file
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── tailwind.config.ts            # Tailwind CSS configuration
```

## Key Files Explained

### Application Entry Points

**`app/page.tsx`**
- Main landing page and conversion interface
- Handles image upload and code generation
- Shows live preview and code editor after generation

**`app/dashboard/page.tsx`**
- User dashboard for managing credits
- Purchase credit packages
- View account information

**`app/layout.tsx`**
- Root layout wrapper
- Includes SessionProvider for authentication
- Sets up global metadata

### API Routes

**`app/api/auth/[...nextauth]/route.ts`**
- NextAuth.js dynamic route handler
- Handles OAuth flows (Google, GitHub)
- Session management

**`app/api/generate/route.ts`**
- Main AI code generation endpoint
- Validates user authentication
- Checks credit balance
- Calls OpenAI Vision API
- Deducts credits and saves generation history

**`app/api/stripe/checkout/route.ts`**
- Creates Stripe checkout sessions
- Handles credit package purchases
- Returns payment URL

**`app/api/stripe/webhook/route.ts`**
- Receives Stripe webhook events
- Updates user credits on successful payment
- Handles payment failures

### Components

**`components/ImageUpload.tsx`**
- Drag-and-drop file upload
- Image preview
- Supports PNG, JPG, WebP
- Uses react-dropzone

**`components/CodeEditor.tsx`**
- Monaco Editor integration
- Syntax highlighting for HTML/TypeScript
- Download as file functionality
- Copy to clipboard

**`components/CodePreview.tsx`**
- Live preview in iframe
- Responsive viewport controls (desktop/tablet/mobile)
- Handles both HTML and React rendering

### Library Files

**`lib/auth.ts`**
- NextAuth configuration
- OAuth provider setup (Google, GitHub)
- Session callbacks
- Type definitions

**`lib/prisma.ts`**
- Prisma client singleton
- Prevents multiple instances in development
- Database connection management

**`lib/stripe.ts`**
- Stripe client configuration
- Credit package definitions
- Price IDs

**`lib/openai.ts`**
- OpenAI client setup
- Prompt engineering for HTML and React
- Code generation function
- Error handling

### Database Schema

**`prisma/schema.prisma`**

Models:
- **User**: User accounts, credits, profile
- **Account**: OAuth account linking
- **Session**: User sessions
- **VerificationToken**: Email verification
- **Generation**: Code generation history
- **Purchase**: Payment transactions

## Data Flow

### Code Generation Flow

1. User uploads screenshot → `ImageUpload` component
2. User selects output type (HTML/React)
3. Click "Generate Code" → POST to `/api/generate`
4. API checks authentication and credits
5. OpenAI Vision API analyzes image
6. Code returned to frontend
7. `CodeEditor` and `CodePreview` display results
8. Credit deducted, generation saved to database

### Payment Flow

1. User selects credit package → Dashboard
2. POST to `/api/stripe/checkout`
3. Stripe checkout session created
4. User redirected to Stripe
5. User completes payment
6. Stripe sends webhook to `/api/stripe/webhook`
7. Credits added to user account
8. Purchase record updated

### Authentication Flow

1. User clicks "Sign In"
2. NextAuth redirects to OAuth provider
3. User authorizes application
4. Redirect back to `/api/auth/callback`
5. NextAuth creates session
6. User account created/updated in database
7. Free credits assigned to new users

## Environment Variables

Required variables are documented in `.env.example`:

- **DATABASE_URL**: PostgreSQL connection string
- **NEXTAUTH_URL**: Application URL
- **NEXTAUTH_SECRET**: Session encryption key
- **GOOGLE_CLIENT_ID/SECRET**: Google OAuth
- **GITHUB_ID/SECRET**: GitHub OAuth
- **OPENAI_API_KEY**: OpenAI API access
- **STRIPE_SECRET_KEY**: Stripe API key
- **STRIPE_WEBHOOK_SECRET**: Webhook verification
- **STRIPE_PRICE_ID_***: Product price IDs

## Tech Stack Details

### Frontend
- **Next.js 14**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Monaco Editor**: Code editor (VS Code's editor)
- **React Dropzone**: File upload

### Backend
- **Next.js API Routes**: Serverless functions
- **NextAuth.js**: Authentication
- **Prisma**: ORM for database
- **PostgreSQL**: Relational database

### External Services
- **OpenAI**: GPT-4 Vision for image-to-code
- **Stripe**: Payment processing
- **Google OAuth**: Authentication provider
- **GitHub OAuth**: Authentication provider

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Database Changes**
   ```bash
   # Update schema.prisma
   npm run db:push
   ```

3. **View Database**
   ```bash
   npm run db:studio
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Deployment Considerations

### Vercel (Recommended)
- Automatic deployments from Git
- Environment variables via dashboard
- Serverless functions auto-configured
- Need external PostgreSQL (Supabase/Neon)

### Environment Setup
- Set all environment variables
- Update OAuth redirect URIs
- Configure Stripe webhooks
- Test payment flow

### Database
- Use managed PostgreSQL
- Run migrations: `npx prisma db push`
- Monitor connection limits

### Monitoring
- Set up error tracking (Sentry)
- Monitor API usage (OpenAI)
- Track revenue (Stripe)
- Analytics (Vercel/PostHog)

## Security Features

- Environment variables server-side only
- Stripe webhook signature verification
- NextAuth CSRF protection
- Prisma parameterized queries
- OAuth for authentication (no passwords)
- Session-based auth with database

## Performance Optimizations

- Next.js automatic code splitting
- Image optimization (next/image)
- API route caching
- Client-side state management
- Lazy loading components
- Monaco Editor CDN

## Future Architecture Considerations

- Redis for caching (sessions, generations)
- Queue system for long AI requests (BullMQ)
- CDN for generated code (S3/Cloudinary)
- Rate limiting (Upstash)
- Real-time updates (WebSockets/SSE)
- Multi-region deployment
