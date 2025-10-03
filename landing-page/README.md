# microsandbox Landing Page

Official promotional landing page for microsandbox - the secure code execution platform.

## Overview

This is a comprehensive, SEO-friendly landing page built with React, React Router, and Tailwind CSS. It showcases microsandbox's features, pricing, use cases, and includes an informative blog section.

## Features

### Pages

1. **Home** - Main landing page with hero section, key features, use cases, and quick start guide
2. **Features** - Detailed feature breakdown with comparisons and benefits
3. **Pricing** - Transparent pricing with open source and enterprise options
4. **Organizations** - Showcase of who uses microsandbox and why
5. **About** - Mission, values, journey, and team information
6. **Blog** - Blog listing page with featured articles

### Blog Posts

1. **Why microsandbox is Better Than Containers for Running Untrusted Code** - In-depth security comparison
2. **Building an AI Coding Assistant with microsandbox** - Complete tutorial guide

### Components

- **Header** - Responsive navigation with mobile menu
- **Footer** - Comprehensive footer with links and social media
- **SEO** - SEO metadata component with structured data for search engines

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Helmet Async** - SEO metadata management
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js 16+ or npm/yarn/pnpm

### Installation

```bash
cd landing-page
npm install
```

### Development

```bash
npm run dev
```

The site will be available at http://localhost:3000

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
landing-page/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── SEO.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Features.jsx
│   │   ├── Pricing.jsx
│   │   ├── Organizations.jsx
│   │   ├── About.jsx
│   │   ├── Blog.jsx
│   │   ├── BlogPost1.jsx
│   │   └── BlogPost2.jsx
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## SEO Features

- Meta tags for all pages
- Open Graph tags for social media sharing
- Twitter Card support
- Structured data (JSON-LD) for search engines
- Semantic HTML
- Accessible navigation
- Mobile-responsive design
- Fast loading times

## Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```js
colors: {
  purple: { ... },
  pink: { ... },
}
```

### Content

All content is in the respective page components in `src/pages/`. Update the text, images, and links as needed.

### SEO

Update default SEO values in `src/components/SEO.jsx` and page-specific values in each page component.

## Deployment

This site can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Connect to Git repo or drag-and-drop `dist/` folder
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Cloudflare Pages**: Connect to Git repo

## License

Apache 2.0 - See LICENSE file for details

## Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

## Support

- Documentation: https://docs.microsandbox.dev
- Discord: https://discord.gg/T95Y3XnEAK
- GitHub: https://github.com/microsandbox/microsandbox
