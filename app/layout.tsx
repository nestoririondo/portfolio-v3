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
import { StructuredData } from "@/components/seo/StructuredData";
import { defaultMetadata } from "@/lib/seo/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
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
