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
  title: "Néstor Iriondo - Web Developer | Websites That Make Your Berlin Business Grow",
  description: "Professional web developer helping Berlin businesses grow with custom websites, modern web applications, and API integrations. 5+ years enterprise experience. Currently accepting select projects.",
  keywords: ["Berlin Web Developer", "Website Development Berlin", "React Developer", "Next.js", "TypeScript", "Custom Web Applications", "API Integration", "Business Websites", "E-commerce Development"],
  authors: [{ name: "Néstor Iriondo" }],
  creator: "Néstor Iriondo",
  icons: {
    icon: "/icons/favicon.svg",
  },
  openGraph: {
    title: "Néstor Iriondo - Web Developer | Berlin Business Websites",
    description: "Professional web developer helping Berlin businesses grow with custom websites, modern web applications, and API integrations. 5+ years enterprise experience.",
    type: "website",
    locale: "en_US",
    siteName: "Néstor Iriondo - Web Developer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
