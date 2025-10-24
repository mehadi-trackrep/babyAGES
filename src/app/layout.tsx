import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppProvider } from "@/context/AppContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalUI from '@/components/GlobalUI';
import ToastManager from '@/components/ToastManager';
import FloatingButtons from "@/components/FloatingButtons";
import SocialButtons from "@/components/SocialButtons";
import DraggableScrollBar from "@/components/DraggableScrollBar";
import LoadingIndicator from '@/components/LoadingIndicator';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://babyages.vercel.app"),
  title: {
    default: "BabyAGES - Top Selected Baby Products",
    template: "%s | BabyAGES"
  },
  description: "Shop the best quality baby products with free packaging. Discover a wide range of baby essentials for your little ones.",
  keywords: "baby products, baby toys, baby clothes, baby care, online baby store, kids products",
  authors: [{ name: "BabyAGES Team" }],
  creator: "BabyAGES",
  publisher: "BabyAGES",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "BabyAGES - Top Selected Baby Products",
    description: "Shop the best quality baby products with free packaging. Discover a wide range of baby essentials for your little ones.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://babyages.vercel.app",
    siteName: "BabyAGES",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BabyAGES - Top Selected Baby Products",
    description: "Shop the best quality baby products with free packaging.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <Navbar />
          {children}
          <Footer />
          <GlobalUI />
          <ToastManager />
          <ToastContainer />
          <FloatingButtons />
          <SocialButtons />
          <DraggableScrollBar />
          <LoadingIndicator />
        </AppProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                  }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
