import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

// ========== Metadata Configuration ==========
export const metadata: Metadata = {
  metadataBase: new URL('https://dan.haloway.co'),
  title: {
    default: 'Dan - Essay Coach | AI College Essay Writing Assistant',
    template: '%s | Dan - Essay Coach',
  },
  description:
    'Transform your ideas into compelling college essays with Dan, an ethical AI essay coach. Get personalized guidance, authentic outlines, and professional feedback for your college applications.',
  keywords: [
    'college essay coach',
    'AI essay writing',
    'college application essays',
    'essay brainstorming',
    'college admissions',
    'essay writing help',
    'personal statement coach',
    'college essay guidance',
    'academic writing assistant',
    'essay outline generator',
  ],
  authors: [{ name: 'Alex Wang' }],
  creator: 'Haloway',
  publisher: 'Haloway',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dan.haloway.co',
    title: 'Dan - Essay Coach | AI College Essay Writing Assistant',
    description:
      'Transform your ideas into compelling college essays with Dan, an ethical AI essay coach. Get personalized guidance for your college applications.',
    siteName: 'Dan - Essay Coach',
    images: [
      {
        url: 'https://res.cloudinary.com/dqdasxxho/image/upload/v1752610512/opengraph-image_gpidac.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Dan - Essay Coach - AI College Essay Writing Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dan - Essay Coach | AI College Essay Writing Assistant',
    description:
      'Transform your ideas into compelling college essays with Dan, an ethical AI essay coach.',
    creator: '@danessaycoach',
    site: '@danessaycoach',
    images: [
      {
        url: 'https://res.cloudinary.com/dqdasxxho/image/upload/v1752610512/opengraph-image_gpidac.png',
        alt: 'Dan helping students write college essays',
      },
    ],
  },
  verification: {
    google: 'your-google-verification-code-here',
  },
  alternates: {
    canonical: 'https://dan.haloway.co',
  },
  category: 'Education',
  classification: 'Education, AI Writing Assistant, College Admissions',
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  //   { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  // ],
};

// ========== Viewport Settings ==========
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

// ========== Font Setup ==========
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

// ========== Theme Color Script (Dynamic) ==========
const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

// ========== Structured Data ==========
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dan - Essay Coach',
  description:
    'An ethical and professional AI college essay coach that helps transform ideas into compelling college essays',
  url: 'https://dan.haloway.co',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  creator: {
    '@type': 'Person',
    name: 'Dan',
    description: 'AI Essay Coach specializing in college application essays',
  },
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
    audienceType: 'College Applicants',
  },
  featureList: [
    'AI-powered essay brainstorming',
    'Personalized essay guidance',
    'Authentic outline generation',
    'College application essay coaching',
    'Real-time writing feedback',
  ],
  sameAs: ['https://dan.haloway.co'],
};

// ========== Root Layout ==========
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Dynamically updates <meta name="theme-color"> based on light/dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(STRUCTURED_DATA),
          }}
        />
        {/* Favicon / PWA Metadata */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
