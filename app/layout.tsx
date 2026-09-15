import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import CookieBanner from "@/components/ui/CookieBanner";
import Analytics from "@/components/Analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Luminate | AI-Powered Study & Flashcard Generator",
    template: "%s | Luminate"
  },
  description: "Upload your PDFs and let Luminate's AI instantly generate spaced repetition flashcards, quizzes, and interactive notes. Learn faster and retain more.",
  keywords: ["AI study tool", "flashcard generator", "PDF to quiz", "spaced repetition"],
  openGraph: {
    title: "Luminate | AI-Powered Study Generator",
    description: "Convert PDFs into interactive flashcards and quizzes instantly.",
    url: "https://luminate-j0x.firebaseapp.com/",
    siteName: "Luminate",
    images: [{ url: "https://luminate-j0x.firebaseapp.com/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luminate | AI-Powered Study Generator",
    description: "Convert PDFs into interactive flashcards and quizzes instantly.",
    images: ["https://luminate-j0x.firebaseapp.com/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://db.onlinewebfonts.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <Analytics />
      </head>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:rounded-lg">Skip to main content</a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
