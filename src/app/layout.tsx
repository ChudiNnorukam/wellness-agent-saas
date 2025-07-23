import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WellnessAI - AI-Powered Wellness Optimization Platform",
    template: "%s | WellnessAI"
  },
  description: "Transform your wellness journey with AI-powered personalized plans, progress tracking, and expert guidance. Start your free trial today!",
  keywords: [
    "wellness AI",
    "health optimization", 
    "fitness tracking",
    "personalized wellness",
    "AI health coach",
    "wellness platform",
    "health goals",
    "fitness app",
    "wellness optimization",
    "health technology"
  ],
  authors: [{ name: "WellnessAI Team" }],
  creator: "WellnessAI",
  publisher: "WellnessAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wellnessai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wellnessai.com',
    siteName: 'WellnessAI',
    title: 'WellnessAI - AI-Powered Wellness Optimization Platform',
    description: 'Transform your wellness journey with AI-powered personalized plans, progress tracking, and expert guidance.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WellnessAI - AI-Powered Wellness Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wellnessai',
    creator: '@wellnessai',
    title: 'WellnessAI - AI-Powered Wellness Optimization',
    description: 'Transform your wellness journey with AI-powered personalized plans and expert guidance.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'health',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WellnessAI",
              "url": "https://wellnessai.com",
              "logo": "https://wellnessai.com/logo.png",
              "description": "AI-powered wellness optimization platform",
              "foundingDate": "2024",
              "sameAs": [
                "https://twitter.com/wellnessai",
                "https://linkedin.com/company/wellnessai"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@wellnessai.com"
              }
            })
          }}
        />
        
        {/* Structured Data for WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "WellnessAI",
              "url": "https://wellnessai.com",
              "description": "AI-powered wellness optimization platform",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free trial available"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
