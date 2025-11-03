import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://nestoririondo.com'),
  title: {
    default: "Néstor Iriondo - Web Developer Berlin",
    template: "%s | Néstor Iriondo"
  },
  description: "Berlin web developer creating custom websites that drive business growth. Specializing in React, Next.js, and API integrations. 5+ years experience.",
  keywords: [
    "web developer Berlin",
    "React developer Berlin", 
    "Next.js developer",
    "custom website development",
    "web applications Berlin",
    "API integrations",
    "freelance developer Berlin"
  ],
  authors: [{ name: "Néstor Iriondo" }],
  creator: "Néstor Iriondo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nestoririondo.com",
    siteName: "Néstor Iriondo - Web Developer Berlin",
    title: "Néstor Iriondo - Web Developer Berlin",
    description: "Berlin web developer creating custom websites that drive business growth. Specializing in React, Next.js, and API integrations.",
    images: [
      {
        url: "/og-image.jpg", // Add when you create the image
        width: 1200,
        height: 630,
        alt: "Néstor Iriondo - Web Developer Berlin"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Néstor Iriondo - Web Developer Berlin",
    description: "Berlin web developer creating custom websites that drive business growth.",
    images: ["/og-image.jpg"]
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
  alternates: {
    canonical: "https://nestoririondo.com",
    languages: {
      'en': 'https://nestoririondo.com',
      'es': 'https://nestoririondo.com/es', 
      'de': 'https://nestoririondo.com/de'
    }
  }
};