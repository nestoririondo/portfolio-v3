import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { LanguageProvider } from "@/lib/contexts/LanguageContext";
import { AnimationProvider } from "@/lib/contexts/AnimationContext";
import { FloatingContactButton } from "@/components/ui/FloatingContactButton";
import { FloatingControls } from "@/components/ui/FloatingControls";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";
import { PostHogInit } from "@/components/PostHogInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Néstor Iriondo - Web Developer | Berlin Business Websites",
  description: "Berlin web developer creating custom websites that drive business growth. Specializing in React, Next.js, and API integrations. 5+ years experience.",
  keywords: ["Berlin Web Developer", "Website Development Berlin", "React Developer", "Next.js", "TypeScript", "Custom Web Applications", "API Integration", "Business Websites", "E-commerce Development", "Frontend Developer", "Full Stack Developer"],
  authors: [{ name: "Néstor Iriondo" }],
  creator: "Néstor Iriondo",
  metadataBase: new URL("https://nestoririondo.com"),
  icons: {
    icon: "/icons/favicon.svg",
    shortcut: "/icons/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Néstor Iriondo - Web Developer | Berlin Business Websites",
    description: "Berlin web developer creating custom websites that drive business growth. Specializing in React, Next.js, and API integrations.",
    url: "https://nestoririondo.com",
    siteName: "Néstor Iriondo - Web Developer",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Néstor Iriondo - Web Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Néstor Iriondo - Web Developer | Berlin Business Websites",
    description: "Berlin web developer creating custom websites that drive business growth. Specializing in React, Next.js, and API integrations.",
    images: ["/og-image.jpg"],
    creator: "@nestordev",
  },
  alternates: {
    canonical: "https://nestoririondo.com",
    languages: {
      "en-US": "https://nestoririondo.com",
      "de-DE": "https://nestoririondo.com/de",
      "es-ES": "https://nestoririondo.com/es",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Néstor Iriondo",
    "jobTitle": "Web Developer",
    "description": "Professional web developer specializing in React, Next.js, and custom web applications for Berlin businesses",
    "url": "https://nestoririondo.com",
    "image": "https://nestoririondo.com/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Berlin",
      "addressCountry": "Germany"
    },
    "sameAs": [
      "https://github.com/nestorcode",
      "https://linkedin.com/in/nestor-iriondo"
    ],
    "offers": {
      "@type": "Offer",
      "description": "Custom website development, web applications, and API integrations",
      "areaServed": "Berlin, Germany"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <AnimationProvider>
              <PostHogInit />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <FloatingControls />
              <FloatingContactButton />
              <Toaster />
            </AnimationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
