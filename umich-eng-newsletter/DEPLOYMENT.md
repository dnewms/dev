# Deployment Guide

This guide provides step-by-step instructions for deploying the U-M Engineering Newsletter Builder to production.

## Quick Start

The fastest way to deploy is using Vercel (recommended for Next.js applications).

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Your email provider API keys (SendGrid or Mailchimp)

### Steps

1. **Prepare Your Repository**

```bash
cd umich-eng-newsletter
git init
git add .
git commit -m "Initial commit: U-M Engineering Newsletter Builder"
```

2. **Push to GitHub**

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/yourusername/umich-eng-newsletter.git
git branch -M main
git push -u origin main
```

3. **Import to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "Add New" → "Project"
- Import your GitHub repository
- Vercel will auto-detect it's a Next.js project

4. **Configure Environment Variables**

In the Vercel project settings, add:

**For SendGrid:**
```
SENDGRID_API_KEY=SG.your_actual_key_here
```

**For Mailchimp:**
```
MAILCHIMP_API_KEY=your_actual_key_here
MAILCHIMP_SERVER_PREFIX=us1
```

5. **Deploy**

- Click "Deploy"
- Wait for the build to complete (2-3 minutes)
- Your app will be live at `your-project.vercel.app`

6. **Custom Domain (Optional)**

- Go to Settings → Domains
- Add your custom domain (e.g., `newsletter.engineering.umich.edu`)
- Follow DNS configuration instructions

### Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update newsletter builder"
git push
```

## Netlify Deployment

### Prerequisites
- Netlify account (free tier available)
- Your email provider API keys

### Steps

1. **Build the Application**

```bash
npm run build
```

2. **Deploy to Netlify**

**Option A: Drag and Drop**
- Go to [netlify.com](https://netlify.com)
- Drag the entire project folder to the deploy area

**Option B: Git Integration**
- Connect your GitHub repository
- Netlify will auto-detect Next.js
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `.next`

3. **Configure Environment Variables**

- Go to Site settings → Build & deploy → Environment
- Add your API keys

4. **Deploy**

Click "Deploy site" and wait for completion.

## AWS Amplify Deployment

### Prerequisites
- AWS account
- AWS Amplify CLI installed

### Steps

1. **Install Amplify CLI**

```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Initialize Amplify**

```bash
amplify init
```

3. **Add Hosting**

```bash
amplify add hosting
```

Select "Hosting with Amplify Console" and "Manual deployment"

4. **Configure Environment Variables**

```bash
amplify env add prod
```

Add your API keys in the Amplify console.

5. **Deploy**

```bash
amplify publish
```

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose (optional)

### Steps

1. **Create Dockerfile**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Create .dockerignore**

```
node_modules
.next
.git
.env.local
```

3. **Build the Image**

```bash
docker build -t umich-newsletter .
```

4. **Run the Container**

```bash
docker run -p 3000:3000 \
  -e SENDGRID_API_KEY=your_key_here \
  umich-newsletter
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## Self-Hosted (VPS/Server)

### Prerequisites
- Ubuntu/Debian server
- Node.js 18+ installed
- Nginx or Apache
- SSL certificate

### Steps

1. **Prepare the Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

2. **Clone and Build**

```bash
git clone https://github.com/yourusername/umich-eng-newsletter.git
cd umich-eng-newsletter
npm install
npm run build
```

3. **Set Environment Variables**

```bash
cat > .env.local << EOF
SENDGRID_API_KEY=your_key_here
NODE_ENV=production
EOF
```

4. **Start with PM2**

```bash
pm2 start npm --name "newsletter" -- start
pm2 save
pm2 startup
```

5. **Configure Nginx**

```nginx
server {
    listen 80;
    server_name newsletter.engineering.umich.edu;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Enable SSL**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d newsletter.engineering.umich.edu
```

7. **Restart Nginx**

```bash
sudo systemctl restart nginx
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SENDGRID_API_KEY` | SendGrid API key | `SG.xxxxx...` |
| `MAILCHIMP_API_KEY` | Mailchimp API key | `xxxxx-us1` |
| `MAILCHIMP_SERVER_PREFIX` | Mailchimp server | `us1` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | App URL | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |

## Post-Deployment Checklist

- [ ] Verify app is accessible at the deployment URL
- [ ] Test email sending functionality
- [ ] Check all pages load correctly
- [ ] Verify analytics tracking works
- [ ] Test contact import/export
- [ ] Confirm mobile responsiveness
- [ ] Set up monitoring and alerts
- [ ] Configure backups
- [ ] Test SSL certificate
- [ ] Add custom domain (if applicable)

## Monitoring and Maintenance

### Vercel Analytics

Vercel provides built-in analytics:
- Go to Analytics tab in your project
- Monitor page views, unique visitors
- Track Core Web Vitals

### Error Tracking

Consider adding error tracking:

```bash
npm install @sentry/nextjs
```

### Performance Monitoring

Monitor your application with:
- Vercel Analytics
- Google Analytics
- Sentry Performance
- New Relic

### Backup Strategy

1. **Code**: Backed up in Git
2. **Contacts**: Export to CSV regularly
3. **Newsletters**: Stored in browser localStorage (consider moving to database)
4. **Environment Variables**: Document securely

## Scaling Considerations

### Database Integration

For production use, consider adding a database:

```bash
npm install prisma @prisma/client
```

Supported databases:
- PostgreSQL (recommended)
- MySQL
- MongoDB
- SQLite (development only)

### Caching

Implement caching for better performance:
- Redis for session storage
- CDN for static assets
- Edge caching with Vercel

### Rate Limiting

Protect your API endpoints:

```bash
npm install express-rate-limit
```

## Troubleshooting

### Build Failures

1. Check Node.js version matches (18+)
2. Clear node_modules and reinstall
3. Verify all dependencies are listed in package.json

### Environment Variables Not Loading

1. Ensure `.env.local` is in root directory
2. Restart the development server
3. In production, verify variables in hosting platform

### Email Sending Errors

1. Verify API keys are correct
2. Check API key permissions
3. Ensure domain is verified with provider
4. Review provider's sending limits

### Performance Issues

1. Optimize images
2. Enable caching
3. Use CDN for static assets
4. Consider upgrading hosting plan

## Support

For deployment issues:
- Check Next.js deployment documentation
- Review hosting provider's support docs
- Contact University of Michigan IT support

## Security Best Practices

1. **Never commit** `.env.local` or API keys to Git
2. **Use HTTPS** in production
3. **Rotate API keys** regularly
4. **Limit API key permissions** to minimum required
5. **Enable 2FA** on hosting accounts
6. **Monitor** access logs for suspicious activity
7. **Keep dependencies** up to date

```bash
npm audit
npm update
```

---

**Ready to deploy?** Start with Vercel for the easiest experience!
