import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = 'https://shadrishya55-afk.github.io/LOVE-FOR-BARSANA';

export const viewport: Viewport = {
  themeColor: '#050e26',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '💕 For Barsana Mukhopadhyay — With All My Love',
  description:
    'An interactive 3D romantic love universe crafted exclusively for Barsana Mukhopadhyay. Featuring 3D floating hearts, cute cats, soothing 432Hz ambient music, and personalized love letters.',
  keywords: [
    'Barsana Mukhopadhyay',
    'Barsana',
    'Love for Barsana',
    'Beloved Rasgulla',
    'Romantic 3D website',
    'Love Letter',
    '3D Hearts Three.js',
    "J'adore La Vie 432Hz",
  ],
  authors: [{ name: 'With Love for Barsana' }],
  creator: 'For Barsana Mukhopadhyay',
  publisher: 'Love for Barsana',
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
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: '💕 For Barsana Mukhopadhyay — With All My Love',
    description:
      'An interactive 3D love universe created with love, floating balloon hearts, cute cats, and sweet memories for Barsana Mukhopadhyay.',
    siteName: 'Love For Barsana',
    images: [
      {
        url: `${siteUrl}/images/barsana.jpg`,
        width: 1200,
        height: 1600,
        alt: 'Barsana Mukhopadhyay — My Beloved Rasgulla',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '💕 For Barsana Mukhopadhyay — With All My Love',
    description:
      'An interactive 3D love universe with floating hearts and cute cats for Barsana Mukhopadhyay.',
    images: [`${siteUrl}/images/barsana.jpg`],
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'For Barsana Mukhopadhyay — A 3D Love Universe',
  alternateName: 'Love for Barsana',
  url: siteUrl,
  description:
    'A romantic 3D interactive tribute for Barsana Mukhopadhyay featuring personalized love letters, 3D hearts, cute cats, and calming music.',
  about: {
    '@type': 'Person',
    name: 'Barsana Mukhopadhyay',
    description: 'Beloved Rasgulla & the sweetest person in the universe',
  },
  image: `${siteUrl}/images/barsana.jpg`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-love-deep text-white selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
