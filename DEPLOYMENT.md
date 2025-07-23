# WellnessAI Deployment Guide

## 🚀 GitHub Pages Deployment

This guide will help you deploy the WellnessAI application to GitHub Pages with full SEO optimization.

### Prerequisites

- GitHub account with a repository
- Node.js 18+ installed
- Git configured locally

### Quick Deployment

1. **Clone and setup the repository:**
   ```bash
   git clone <your-repo-url>
   cd wellness-agent-saas
   npm install
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

### Manual Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source
   - Choose "Deploy from a branch" option

3. **Push changes to trigger deployment:**
   ```bash
   git add .
   git commit -m "Deploy: Add privacy policy and SEO optimization"
   git push origin main
   ```

### SEO Features Implemented

✅ **Privacy Policy Page** (`/privacy`)
- Comprehensive GDPR/CCPA compliant policy
- Google SEO optimized structure
- Semantic HTML with proper headings
- Internal navigation links

✅ **Terms of Service Page** (`/terms`)
- Complete legal terms and conditions
- User rights and obligations
- Acceptable use policy
- Contact information

✅ **SEO Optimization**
- Meta tags and Open Graph data
- Structured data (JSON-LD)
- Sitemap.xml generation
- Robots.txt configuration
- Canonical URLs

✅ **Technical SEO**
- Fast loading with Next.js optimization
- Mobile-responsive design
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images

### File Structure

```
wellness-agent-saas/
├── src/app/
│   ├── privacy/page.tsx          # Privacy Policy
│   ├── terms/page.tsx            # Terms of Service
│   ├── sitemap.ts               # Dynamic sitemap
│   ├── robots.ts                # Robots.txt
│   └── layout.tsx               # SEO metadata
├── .github/workflows/
│   └── deploy.yml               # GitHub Actions
├── scripts/
│   └── deploy-github-pages.js   # Deployment script
└── next.config.js               # Static export config
```

### Customization

#### Update Contact Information

Edit the following files to update contact details:
- `src/app/privacy/page.tsx` - Privacy contact info
- `src/app/terms/page.tsx` - Legal contact info
- `src/app/layout.tsx` - Organization structured data

#### Custom Domain Setup

1. Add your custom domain in GitHub repository settings
2. Update the `CUSTOM_DOMAIN` environment variable
3. The deployment script will automatically create a CNAME file

#### SEO Configuration

Update SEO settings in:
- `src/app/layout.tsx` - Global metadata
- `src/app/page.tsx` - Homepage metadata
- `src/app/sitemap.ts` - Sitemap URLs

### Monitoring and Analytics

#### Google Search Console
1. Add your domain to Google Search Console
2. Submit the sitemap: `https://yourdomain.com/sitemap.xml`
3. Monitor indexing status and search performance

#### Analytics Setup
- Google Analytics 4
- Google Tag Manager (optional)
- Search Console integration

### Performance Optimization

The application includes:
- Next.js static export for fast loading
- Optimized images and assets
- Minimal JavaScript bundle
- CDN-ready static files

### Security Features

- HTTPS enforcement
- Secure headers configuration
- Privacy-first data handling
- GDPR/CCPA compliance

### Troubleshooting

#### Build Issues
```bash
# Clean and rebuild
rm -rf .next out node_modules
npm install
npm run build
```

#### Deployment Issues
1. Check GitHub Actions logs
2. Verify repository permissions
3. Ensure main branch is selected for deployment

#### SEO Issues
1. Validate structured data with Google's testing tools
2. Check sitemap accessibility
3. Verify meta tags with browser dev tools

### Support

For deployment issues:
- Check GitHub Actions workflow logs
- Review Next.js build output
- Verify repository settings

For SEO questions:
- Use Google Search Console for monitoring
- Test structured data with Google's tools
- Validate sitemap with online validators

---

**Last Updated:** January 2025
**Version:** 1.0.0 