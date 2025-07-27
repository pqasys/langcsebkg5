import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { InstitutionProvider } from "@/components/providers/InstitutionProvider";
import { ServiceWorkerProvider } from "@/components/ServiceWorkerProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster as SonnerToaster } from 'sonner';
import { generateOrganizationStructuredData } from "@/lib/seo-config";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fluentship.com'),
  title: {
    default: "FluentShip - Where fluency meets friendship",
    template: "%s | FluentShip"
  },
  description: "Learn together. Speak with confidence. Join FluentShip's community-powered language learning journey with native speakers and personalized learning paths.",
  keywords: [
    "language learning",
    "online courses", 
    "interactive learning",
    "native speakers",
    "language platform",
    "fluentship",
    "learn languages online",
    "language courses",
    "speaking practice",
    "language education",
    "community learning",
    "language friendship"
  ],
  authors: [{ name: "FluentShip Team" }],
  creator: "FluentShip",
  publisher: "FluentShip",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fluentship.com",
    siteName: "FluentShip",
    title: "FluentShip - Where fluency meets friendship",
    description: "Learn together. Speak with confidence. Join FluentShip's community-powered language learning journey.",
    images: [
      {
        url: "/images/fluentship-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FluentShip - Community Language Learning Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FluentShip - Where fluency meets friendship",
    description: "Learn together. Speak with confidence. Join FluentShip's community-powered language learning journey.",
    images: ["/images/fluentship-og-image.jpg"],
    creator: "@fluentship",
    site: "@fluentship"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": "-1",
      "max-image-preview": "large",
      "max-snippet": "-1"
    }
  },
  alternates: {
    canonical: "https://fluentish.com",
    languages: {
      "en": "https://fluentish.com",
      "es": "https://fluentish.com/es",
      "fr": "https://fluentish.com/fr"
    }
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || "your-google-verification-code",
    yandex: process.env.YANDEX_VERIFICATION_CODE || "your-yandex-verification-code",
    bing: process.env.BING_VERIFICATION_CODE || "your-bing-verification-code"
  },
  other: {
    "application-name": "Fluentish",
    "apple-mobile-web-app-title": "Fluentish",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#2563eb",
    "color-scheme": "light dark"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = generateOrganizationStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FluentShip" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/mask-icon.svg" color="#2563eb" />
      </head>
      <body className={`${inter.className} ${poppins.variable}`} suppressHydrationWarning>
        <ServiceWorkerProvider>
          <AuthProvider>
            <InstitutionProvider>
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster />
              <SonnerToaster position="top-right" richColors />
            </InstitutionProvider>
          </AuthProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
