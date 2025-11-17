# U-M Engineering Newsletter Builder

A professional, easy-to-use newsletter builder designed specifically for the University of Michigan College of Engineering. Built with Next.js 14, TypeScript, and Tailwind CSS, this application enables non-technical staff to create, manage, and send beautiful newsletters with ease.

![Michigan Branding](https://img.shields.io/badge/Michigan-Go%20Blue-00274C?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==)

## Features

### Drag-and-Drop Email Builder
- **Intuitive Interface**: Build newsletters without writing code
- **8 Content Block Types**: Header, Text, Image, Button, Divider, Event, Research Highlight, and Student Achievement
- **Real-time Preview**: See your changes instantly
- **Reorderable Blocks**: Drag to rearrange content
- **Inline Editing**: Click any block to edit its content

### Pre-built Templates
- **Research Highlights**: Showcase groundbreaking faculty and student research
- **Student Achievements**: Celebrate awards, fellowships, and accomplishments
- **Upcoming Events**: Share lectures, seminars, and department events
- **General Newsletter**: Versatile template for mixed content

### Email List Management
- **Contact Database**: Store and organize subscriber information
- **Tag System**: Segment contacts by student, alumni, faculty, etc.
- **CSV Import/Export**: Bulk upload contacts or backup your list
- **Search & Filter**: Quickly find specific contacts

### Email Delivery Integration
- **SendGrid**: Reliable delivery with detailed analytics
- **Mailchimp**: All-in-one marketing platform
- **Easy Setup**: Step-by-step configuration guide
- **Test Sending**: Verify integration before going live

### Analytics Dashboard
- **Key Metrics**: Track sent, opened, and clicked emails
- **Open Rate**: Monitor newsletter engagement
- **Click-through Rate**: Measure call-to-action effectiveness
- **Trend Charts**: Visualize performance over time
- **Industry Benchmarks**: Compare against education sector averages

### Newsletter Archive
- **Complete History**: Access all past newsletters
- **Search & Filter**: Find newsletters by title, status, or date
- **Quick Stats**: View drafts vs. sent newsletters at a glance
- **One-click Editing**: Duplicate and modify previous newsletters

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: React DnD
- **Email Templates**: React Email
- **Charts**: Recharts
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Michigan Branding

The application uses official University of Michigan colors:
- **Michigan Blue** (#00274C) - Primary brand color
- **Maize** (#FFCB05) - Secondary brand color
- **Tappan Blue** (#0D5CA6)
- **Arboretum Blue** (#2F65A7)
- **Wave Blue** (#83B2E3)
- **Taubman Teal** (#00B2A9)
- **Ross Orange** (#FF6600)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- SendGrid or Mailchimp account (for email delivery)

### Installation

1. **Clone or download this project**

```bash
cd umich-eng-newsletter
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment variables**

Create a `.env.local` file in the root directory:

```env
# For SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key_here

# OR for Mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Creating Your First Newsletter

1. **Navigate to the Builder**
   - Click "Create Newsletter" on the homepage or go to the Builder page

2. **Add Content Blocks**
   - Drag blocks from the sidebar onto the canvas
   - Available blocks: Header, Text, Image, Button, Divider, Event, Research, Achievement

3. **Edit Block Content**
   - Click the edit icon on any block
   - Modify text, links, images, dates, etc.
   - Click the checkmark to save changes

4. **Reorder Blocks**
   - Click and drag the grip icon to reorder blocks
   - Drop them in the desired position

5. **Preview Your Newsletter**
   - The right sidebar shows a real-time preview
   - See how your newsletter will appear to recipients

6. **Save Your Work**
   - Click "Save Draft" to save without sending
   - Your newsletter is automatically saved to the archive

### Using Templates

1. **Browse Templates**
   - Go to the Templates page
   - View pre-built templates for different content types

2. **Select a Template**
   - Click "Use This Template" on your preferred option
   - The builder opens with pre-populated content blocks

3. **Customize**
   - Edit the template content to match your needs
   - Add, remove, or rearrange blocks as desired

### Managing Contacts

1. **Add Individual Contacts**
   - Click "Add Contact" on the Contacts page
   - Fill in email, name, and tags
   - Submit to add to your list

2. **Import from CSV**
   - Prepare a CSV file with columns: email, firstName, lastName, tags
   - Click "Import CSV" and select your file
   - Contacts are automatically added to your list

3. **Export Your List**
   - Click "Export CSV" to download your entire contact list
   - Use for backups or integration with other systems

4. **Filter and Search**
   - Use the search bar to find specific contacts
   - Filter by tags (student, alumni, faculty, etc.)

### Setting Up Email Delivery

#### Option 1: SendGrid

1. **Create a SendGrid Account**
   - Sign up at [sendgrid.com](https://signup.sendgrid.com/)
   - Verify your email and domain

2. **Generate API Key**
   - Go to Settings → API Keys
   - Create a new key with "Full Access"
   - Copy the key immediately (you won't see it again)

3. **Configure the App**
   - Go to Settings page in the app
   - Select SendGrid as your provider
   - Paste your API key
   - Click "Save Settings"

4. **Add to Environment Variables**
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
   ```

#### Option 2: Mailchimp

1. **Create a Mailchimp Account**
   - Sign up at [mailchimp.com](https://mailchimp.com/signup/)
   - Set up your audience (contact list)

2. **Generate API Key**
   - Go to Account → Extras → API keys
   - Create a new API key
   - Note your server prefix (us1, us2, etc.)

3. **Configure the App**
   - Go to Settings page in the app
   - Select Mailchimp as your provider
   - Enter your API key and server prefix
   - Click "Save Settings"

4. **Add to Environment Variables**
   ```env
   MAILCHIMP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx-us1
   MAILCHIMP_SERVER_PREFIX=us1
   ```

### Viewing Analytics

1. **Access the Dashboard**
   - Navigate to the Analytics page
   - View aggregate metrics and charts

2. **Key Metrics**
   - **Total Sent**: Total number of emails sent
   - **Avg. Open Rate**: Percentage of recipients who opened emails
   - **Avg. Click Rate**: Percentage who clicked links
   - **Click-to-Open**: Clicks divided by opens

3. **Charts**
   - **Engagement by Newsletter**: Bar chart showing sent, opened, clicked
   - **Engagement Trends**: Line chart showing rates over time
   - **Performance Table**: Detailed breakdown by newsletter

4. **Industry Benchmarks**
   - Compare your metrics to education sector averages
   - Open rate benchmark: 21.5%
   - Click rate benchmark: 2.6%

### Accessing Newsletter Archive

1. **Browse All Newsletters**
   - Go to the Archive page
   - View all drafts and sent newsletters

2. **Search and Filter**
   - Use the search bar to find specific newsletters
   - Filter by status: All, Drafts, or Sent

3. **View or Edit**
   - Click "Edit" on drafts to continue working
   - Click "View" on sent newsletters to see final version

4. **Delete Newsletters**
   - Click the trash icon to remove newsletters
   - Note: This action cannot be undone

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   - Add your `SENDGRID_API_KEY` or `MAILCHIMP_API_KEY`
   - Add `MAILCHIMP_SERVER_PREFIX` if using Mailchimp

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `.next` folder
   - Or connect your Git repository

3. **Configure Environment Variables**
   - Add your API keys in Netlify settings
   - Under Site settings → Build & deploy → Environment

### Self-Hosting

1. **Build the production app**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Configure reverse proxy**
   - Use Nginx or Apache to proxy requests
   - Set up SSL certificates for HTTPS

## Project Structure

```
umich-eng-newsletter/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── builder/             # Newsletter builder
│   ├── templates/           # Template gallery
│   ├── contacts/            # Contact management
│   ├── analytics/           # Analytics dashboard
│   ├── archive/             # Newsletter archive
│   └── settings/            # App settings
├── components/              # React components
│   ├── Navigation.tsx       # Main navigation
│   └── builder/             # Builder components
│       ├── BuilderSidebar.tsx
│       ├── BuilderCanvas.tsx
│       ├── BuilderPreview.tsx
│       └── EditableBlock.tsx
├── lib/                     # Utilities and helpers
│   └── store.ts            # Zustand state management
├── public/                  # Static assets
├── .env.local              # Environment variables (create this)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind config
└── README.md               # This file
```

## Customization

### Changing Colors

Edit `tailwind.config.ts` to modify the Michigan branding colors:

```typescript
colors: {
  'michigan-blue': '#00274C',
  'michigan-maize': '#FFCB05',
  // Add custom colors here
}
```

### Adding New Block Types

1. Add the block type to `lib/store.ts`
2. Create the block component in `components/builder/EditableBlock.tsx`
3. Add it to the sidebar in `components/builder/BuilderSidebar.tsx`

### Modifying Templates

Edit the templates array in `app/templates/page.tsx` to add or modify pre-built templates.

## Best Practices

### Email Deliverability

1. **Verify Your Domain**: Set up SPF and DKIM records
2. **Use a Consistent From Address**: Always send from the same email
3. **Avoid Spam Triggers**: Don't use all caps or excessive exclamation marks
4. **Include Unsubscribe Link**: Required by law and improves deliverability
5. **Test Before Sending**: Send test emails to verify formatting

### Content Tips

1. **Keep It Concise**: Respect your readers' time
2. **Use Clear CTAs**: Make it obvious what action you want readers to take
3. **Mobile-First**: Most emails are opened on mobile devices
4. **Personalization**: Use merge tags for recipient names when possible
5. **Consistent Branding**: Use Michigan colors and fonts throughout

### Performance

1. **Optimize Images**: Compress images before uploading
2. **Limit Block Count**: Too many blocks can slow rendering
3. **Test on Multiple Devices**: Check how emails appear on different screens
4. **Monitor Analytics**: Track what content resonates with your audience

## Troubleshooting

### Newsletter Not Sending

1. Check your API keys are correct in `.env.local`
2. Verify your SendGrid/Mailchimp account is active
3. Check browser console for error messages
4. Ensure your domain is verified with your email provider

### Drag and Drop Not Working

1. Clear your browser cache
2. Try a different browser
3. Ensure JavaScript is enabled
4. Check browser console for errors

### Images Not Displaying

1. Verify the image URL is publicly accessible
2. Use HTTPS URLs for images
3. Check image file size (keep under 1MB)
4. Try a different image hosting service

### Analytics Not Showing

1. Ensure you've sent at least one newsletter
2. Check that tracking is enabled in your email provider
3. Allow 24-48 hours for analytics to populate
4. Verify webhooks are configured correctly

## Support

For issues, questions, or feature requests:

1. Check this README for common solutions
2. Review the Settings page for integration help
3. Contact your IT department for technical support
4. Refer to SendGrid or Mailchimp documentation

## License

This project is created for the University of Michigan College of Engineering.

## Acknowledgments

- Built with Next.js by Vercel
- Icons by Lucide
- Charts by Recharts
- Email rendering by React Email
- University of Michigan Brand Guidelines

---

**Go Blue!** 〽️

Made with ❤️ for the University of Michigan College of Engineering
