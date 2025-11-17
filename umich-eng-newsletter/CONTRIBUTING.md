# Contributing Guide

Thank you for your interest in improving the U-M Engineering Newsletter Builder! This guide will help you get started with development.

## Development Setup

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/umich-engineering/newsletter-builder.git
cd newsletter-builder
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
umich-eng-newsletter/
├── app/                    # Next.js 14 app directory
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout with navigation
│   ├── globals.css        # Global styles and Michigan branding
│   ├── builder/           # Newsletter builder page
│   ├── templates/         # Pre-built templates gallery
│   ├── contacts/          # Contact list management
│   ├── analytics/         # Analytics dashboard
│   ├── archive/           # Newsletter archive
│   └── settings/          # App configuration
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Main navigation bar
│   └── builder/           # Builder-specific components
├── lib/                   # Utilities and helpers
│   └── store.ts          # Zustand state management
└── public/               # Static assets
```

## Development Workflow

### Making Changes

1. **Create a new branch**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**

Follow the coding standards below.

3. **Test your changes**

```bash
npm run build
npm start
```

4. **Commit your changes**

```bash
git add .
git commit -m "Add: Brief description of your changes"
```

5. **Push and create a pull request**

```bash
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type
- Use meaningful variable names

Example:
```typescript
interface Newsletter {
  id: string
  title: string
  blocks: ContentBlock[]
}
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Use descriptive component names
- Extract reusable logic into custom hooks

Example:
```typescript
export default function FeatureCard({ title, description }: {
  title: string
  description: string
}) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow Michigan branding colors
- Keep responsive design in mind
- Use the `michigan-*` color classes

Example:
```typescript
<button className="bg-michigan-blue text-white px-4 py-2 rounded-lg hover:bg-michigan-arboretum-blue">
  Click Me
</button>
```

### File Naming

- Use PascalCase for components: `BuilderCanvas.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use kebab-case for CSS modules: `card-styles.module.css`

## Adding New Features

### Adding a New Content Block Type

1. **Update the store** (`lib/store.ts`):

```typescript
export type BlockType = 'header' | 'text' | 'image' | 'button' | 'divider' | 'event' | 'research' | 'achievement' | 'your-new-type'
```

2. **Add block to sidebar** (`components/builder/BuilderSidebar.tsx`):

```typescript
const blockTypes = [
  // ... existing blocks
  { type: 'your-new-type' as BlockType, label: 'Your Block', icon: YourIcon, color: 'bg-blue-500' },
]
```

3. **Add editor** (`components/builder/EditableBlock.tsx`):

```typescript
function BlockEditor({ block, onUpdate }: Props) {
  switch (block.type) {
    // ... existing cases
    case 'your-new-type':
      return <YourBlockEditor block={block} onUpdate={onUpdate} />
  }
}
```

4. **Add preview** (same file):

```typescript
function BlockPreview({ block }: Props) {
  switch (block.type) {
    // ... existing cases
    case 'your-new-type':
      return <YourBlockPreview block={block} />
  }
}
```

### Adding a New Page

1. **Create the page file**

```bash
touch app/your-page/page.tsx
```

2. **Add basic structure**

```typescript
export default function YourPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-michigan-blue">Your Page</h1>
      {/* Your content */}
    </div>
  )
}
```

3. **Add to navigation** (`components/Navigation.tsx`):

```typescript
const navigation = [
  // ... existing items
  { name: 'Your Page', href: '/your-page', icon: YourIcon },
]
```

### Adding a New Template

Edit `app/templates/page.tsx`:

```typescript
const templates = [
  // ... existing templates
  {
    id: 'your-template',
    name: 'Your Template',
    description: 'Description of what this template is for',
    icon: YourIcon,
    category: 'Category',
    blocks: [
      // Define your template blocks
    ],
  },
]
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] All pages load without errors
- [ ] Drag and drop works in builder
- [ ] Blocks can be added, edited, and deleted
- [ ] Templates load correctly
- [ ] Contact management works
- [ ] Analytics display properly
- [ ] Archive shows newsletters
- [ ] Settings page loads
- [ ] Navigation works on all pages
- [ ] Mobile responsive on all pages
- [ ] No console errors

### Browser Testing

Test in:
- Chrome
- Firefox
- Safari
- Edge

### Responsive Testing

Test on:
- Desktop (1920px)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

## Common Tasks

### Update Dependencies

```bash
npm update
npm audit fix
```

### Add a New Dependency

```bash
npm install package-name
```

For TypeScript types:

```bash
npm install --save-dev @types/package-name
```

### Fix Linting Issues

```bash
npm run lint
```

### Build for Production

```bash
npm run build
npm start
```

## Michigan Branding

Always use official colors:

```css
michigan-blue: #00274C        /* Primary brand color */
michigan-maize: #FFCB05       /* Secondary brand color */
michigan-tappan-blue: #0D5CA6
michigan-arboretum-blue: #2F65A7
michigan-wave-blue: #83B2E3
michigan-taubman-teal: #00B2A9
michigan-ross-orange: #FF6600
```

### Typography

- Use sans-serif fonts
- Headlines: Bold, Michigan Blue
- Body text: Regular, Gray-700
- Links: Michigan Blue with underline

### Spacing

- Use Tailwind spacing: `p-4`, `m-6`, `gap-3`
- Consistent padding in cards: `p-6`
- Section spacing: `space-y-6`

## Performance

### Best Practices

1. **Optimize Images**
   - Compress before upload
   - Use appropriate formats (WebP when possible)
   - Lazy load images

2. **Code Splitting**
   - Use dynamic imports for large components
   - Keep bundle size minimal

3. **Caching**
   - Utilize Next.js automatic caching
   - Consider adding Redis for data caching

## Accessibility

- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast

Example:
```typescript
<button
  aria-label="Delete newsletter"
  className="..."
>
  <Trash2 />
</button>
```

## Git Commit Messages

Follow this format:

```
Type: Brief description

Longer description if needed.

Fixes #issue-number
```

Types:
- **Add**: New feature
- **Fix**: Bug fix
- **Update**: Update existing feature
- **Refactor**: Code refactoring
- **Docs**: Documentation changes
- **Style**: Code style changes (formatting)
- **Test**: Adding tests

Examples:
```
Add: Drag-and-drop functionality for newsletter blocks

Fix: Contact import not parsing CSV correctly

Update: Improve analytics chart performance

Docs: Add deployment guide for AWS
```

## Pull Request Process

1. **Update the README** if needed
2. **Test thoroughly** on multiple devices
3. **Write clear PR description**
4. **Link related issues**
5. **Request review** from maintainers
6. **Address feedback** promptly

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on mobile
- [ ] No console errors

## Screenshots
If applicable, add screenshots

## Related Issues
Fixes #(issue)
```

## Questions?

- Check existing issues on GitHub
- Ask in the team Slack channel
- Email the development team
- Consult the README and documentation

## Code of Conduct

- Be respectful and professional
- Welcome newcomers
- Give constructive feedback
- Focus on what's best for the project

---

Thank you for contributing to the U-M Engineering Newsletter Builder! 〽️
