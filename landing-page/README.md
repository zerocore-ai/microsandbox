# Microsandbox Landing Page

A comprehensive, SEO-optimized landing page for Microsandbox - the secure code execution platform.

## Features

- **Modern Design**: Built with React, Next.js, and Tailwind CSS
- **SEO Optimized**: Complete meta tags, structured data, and sitemap
- **Responsive**: Mobile-first design that works on all devices
- **Performance**: Optimized for fast loading and excellent Core Web Vitals
- **Accessibility**: WCAG compliant with proper semantic HTML

## Pages

### Main Pages
- **Homepage** (`/`): Hero section, features overview, use cases, testimonials
- **Features** (`/features`): Detailed feature breakdown and technical deep-dive
- **About Us** (`/about`): Company story, mission, values, and team
- **Pricing** (`/pricing`): Transparent pricing with feature comparison
- **Organizations** (`/organizations`): Enterprise use cases and testimonials
- **Get Started** (`/get-started`): Step-by-step setup guide

### Blog
- **Blog Index** (`/blog`): All blog posts with categories and search
- **Blog Post 1**: "Why MicroVM Isolation Matters: The Future of Secure Code Execution"
- **Blog Post 2**: "AI-Powered Development Meets Secure Execution"

## Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Heroicons
- **Animations**: Custom CSS animations and transitions
- **SEO**: Next.js built-in optimization + custom meta tags

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with header/footer
│   ├── Hero.tsx        # Homepage hero section
│   ├── Features.tsx    # Features showcase
│   ├── UseCases.tsx    # Use cases grid
│   ├── Testimonials.tsx # Customer testimonials
│   └── CTA.tsx         # Call-to-action sections
├── pages/              # Next.js pages
│   ├── index.tsx       # Homepage
│   ├── features.tsx    # Features page
│   ├── about.tsx       # About page
│   ├── pricing.tsx     # Pricing page
│   ├── organizations.tsx # Organizations page
│   ├── get-started.tsx # Setup guide
│   └── blog/           # Blog pages
├── styles/             # Global styles and Tailwind config
└── utils/              # Utility functions
```

## SEO Features

- **Meta Tags**: Comprehensive meta tags for each page
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Automatically generated XML sitemap
- **Robots.txt**: Search engine crawling instructions
- **Canonical URLs**: Prevent duplicate content issues

## Design System

### Colors
- **Primary**: Blue gradient (#4f46e5 to #6366f1)
- **Secondary**: Green accent (#22c55e)
- **Neutrals**: Gray scale for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Consistent type scale with responsive sizing
- **Hierarchy**: Clear information hierarchy

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Consistent card styling with hover effects
- **Layout**: Maximum width containers with responsive padding

## Performance Optimizations

- **Font Loading**: Preloaded Google Fonts with fallbacks
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting by Next.js
- **Bundle Analysis**: Optimized bundle size and dependencies

## Deployment

The site is optimized for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any static hosting service**

### Environment Variables
No environment variables required for basic functionality.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](../LICENSE) file for details.

## Contact

- **Website**: https://microsandbox.dev
- **Discord**: https://discord.gg/T95Y3XnEAK
- **GitHub**: https://github.com/microsandbox/microsandbox