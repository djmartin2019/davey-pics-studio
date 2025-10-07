# 📸 David Martin Photography - Wildlife Portfolio

A modern, high-performance wildlife photography portfolio built with Next.js 15, showcasing Houston-area wildlife photography with a focus on SEO, performance, and user experience.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)

## 🌟 Overview

This is a professional wildlife photography portfolio website designed for David Martin, a Houston-based wildlife photographer specializing in birds and nature photography. The site demonstrates modern web development practices with a focus on performance, SEO, and seamless content management.

**Live Site:** [daveypicsstudio.com](https://daveypicsstudio.com)

## ✨ Key Features

### 🎯 Performance & Optimization

- **Next.js 15** with App Router and React Server Components
- **Incremental Static Regeneration (ISR)** with 60-second revalidation
- **Image Optimization** using Next.js Image component with Contentful integration
- **Code Splitting** for optimal bundle sizes
- **Server-Side Rendering** for dynamic content with fast initial loads

### 🎨 User Experience

- **Dark Mode Support** with smooth theme transitions using next-themes
- **Responsive Design** optimized for all devices
- **Progressive Enhancement** with graceful fallbacks
- **Accessible UI Components** built with Radix UI primitives
- **Modern Animations** using Tailwind CSS and Framer Motion patterns

### 📊 Content Management

- **Contentful CMS Integration** for headless content management
- **Rich Text Rendering** for blog posts and long-form content
- **Asset Management** with automatic image optimization
- **Content Caching** strategy for improved performance
- **Mock Data Fallbacks** for development without CMS access

### 🔍 SEO & Marketing

- **Structured Data (JSON-LD)** for rich search results
- **Open Graph & Twitter Cards** for social media sharing
- **Dynamic Sitemap Generation** for search engine indexing
- **Robots.txt Configuration** for crawler management
- **Semantic HTML** with proper heading hierarchy
- **Local Business Schema** for local SEO

### 📧 Communication

- **Contact Form** with Nodemailer integration
- **Form Validation** using React Hook Form and Zod
- **Email Templates** for professional communication
- **CAPTCHA Protection** ready integration points

### 📈 Analytics & Tracking

- **PostHog Integration** for product analytics
- **Event Tracking** custom implementation
- **Session Recording** capabilities
- **Feature Flags** support via PostHog

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type-safe development

### Styling & UI

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon set
- **next-themes** - Dark mode implementation

### Content & Data

- **Contentful** - Headless CMS
- **@contentful/rich-text-react-renderer** - Rich text rendering
- **date-fns** - Date formatting and manipulation

### Forms & Validation

- **React Hook Form 7.54** - Performant form handling
- **Zod 3.24** - Schema validation
- **@hookform/resolvers** - Validation integration

### Email

- **Nodemailer** - Email sending functionality

### Developer Experience

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Fast, efficient package manager

## 📁 Project Structure

```
davey-pics-studio/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── api/                      # API routes
│   │   ├── contact/             # Contact form handler
│   │   └── site-config/         # Configuration endpoint
│   ├── blog/                     # Blog posts
│   ├── contact/                  # Contact page
│   ├── gallery/                  # Photo galleries
│   ├── parks/                    # Photography locations
│   ├── services/                 # Services offered
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Homepage
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Robots.txt generation
├── components/                   # React components
│   ├── ui/                      # Radix UI components
│   ├── blog-post-card.tsx       # Blog post cards
│   ├── contact-form.tsx         # Contact form
│   ├── contentful-image.tsx     # Optimized image component
│   ├── footer.tsx               # Site footer
│   ├── navbar.tsx               # Navigation bar
│   ├── photo-gallery.tsx        # Gallery component
│   └── ...                      # Other components
├── lib/                          # Utility functions
│   ├── api.ts                   # Contentful API functions
│   ├── contentful-client.ts     # Contentful client setup
│   ├── contentful-cache.ts      # Caching layer
│   ├── image-utils.ts           # Image optimization helpers
│   └── utils.ts                 # General utilities
├── types/                        # TypeScript definitions
│   └── contentful.ts            # Contentful type definitions
├── public/                       # Static assets
├── styles/                       # Global styles
└── middleware.ts                # Next.js middleware
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **pnpm** 8.x or later (or npm/yarn)
- **Contentful Account** (for CMS functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/davey-pics-studio.git
   cd davey-pics-studio
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   # Contentful CMS
   NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token

   # Email Configuration
   EMAIL_FROM=your-email@example.com
   EMAIL_TO=recipient@example.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password

   # Analytics (Optional)
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Environment Variables

| Variable                          | Description             | Required         |
| --------------------------------- | ----------------------- | ---------------- |
| `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` | Contentful space ID     | Yes              |
| `CONTENTFUL_ACCESS_TOKEN`         | Contentful access token | Yes              |
| `EMAIL_FROM`                      | Sender email address    | For contact form |
| `EMAIL_TO`                        | Recipient email address | For contact form |
| `SMTP_HOST`                       | SMTP server host        | For contact form |
| `SMTP_PORT`                       | SMTP server port        | For contact form |
| `SMTP_USER`                       | SMTP username           | For contact form |
| `SMTP_PASS`                       | SMTP password           | For contact form |
| `NEXT_PUBLIC_POSTHOG_KEY`         | PostHog API key         | Optional         |
| `NEXT_PUBLIC_POSTHOG_HOST`        | PostHog host URL        | Optional         |

## 🏗️ Architecture Decisions

### Content Strategy

- **ISR over SSG**: Using Incremental Static Regeneration with 60-second revalidation to balance performance with content freshness
- **Graceful Degradation**: Mock client provides sample data when Contentful is unavailable
- **Image Optimization**: Leveraging Contentful's image API with Next.js Image component for automatic optimization

### Performance Optimizations

- **Server Components**: Most components are React Server Components for reduced JavaScript bundle
- **Suspense Boundaries**: Strategic loading states for better perceived performance
- **Dynamic Imports**: Code splitting for heavy components
- **Asset Optimization**: Automatic image optimization with WebP/AVIF support

### SEO Strategy

- **Structured Data**: JSON-LD for LocalBusiness, Organization, and Article schemas
- **Dynamic Metadata**: Page-specific titles and descriptions
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Local SEO**: Location-specific content and schema for Houston/Humble area

## 🎨 Contentful Content Model

The site uses the following Contentful content types:

- **Homepage** - Hero images and featured content
- **Blog Post** - Articles with rich text and images
- **Photo Gallery** - Collections of photographs
- **Park/Location** - Photography location information
- **Service** - Photography services offered
- **Photographer Info** - Contact and bio information

See `contentful-content-model.md` for detailed schema information.

## 🚢 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import project in Vercel**

   - Connect your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure environment variables**

   - Add all required environment variables in Vercel dashboard

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Build Commands

```bash
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## 🧪 Development

### Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

### Code Style

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** (recommended) for code formatting

## 🎯 Performance Metrics

Target metrics for this project:

- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Pass all thresholds
- **Time to First Byte**: < 200ms (with CDN)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s

## 🔒 Security

- **Environment Variables**: Sensitive data stored securely
- **CSRF Protection**: Built into Next.js forms
- **XSS Prevention**: React's automatic escaping
- **Content Security Policy**: Ready for implementation
- **Rate Limiting**: Ready for API routes

## 🤝 Contributing

This is a personal portfolio project, but suggestions and bug reports are welcome!

## 📝 License

This project is private and proprietary.

## 👤 Author

**David Martin**

- Website: [daveypicsstudio.com](https://daveypicsstudio.com)
- Instagram: [@davey.pics](https://www.instagram.com/davey.pics/)
- Email: daveypicsstudio@gmail.com
- Location: Humble, Texas (Houston Area)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Headless CMS by [Contentful](https://www.contentful.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**Note**: This project showcases modern web development practices including Server Components, ISR, TypeScript, and comprehensive SEO optimization. It demonstrates proficiency with the Next.js ecosystem and production-ready application architecture.
