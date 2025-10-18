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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BabyAGES - Top Selected Baby Care Solution",
  description: "A top select e-commerce baby platform for your beautiful family",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
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
        </AppProvider>
        <script>
          {
            "if ('serviceWorker' in navigator) {\n              window.addEventListener('load', () => {\n                navigator.serviceWorker.register('/sw.js').then(registration => {\n                  console.log('SW registered: ', registration);\n                }).catch(registrationError => {\n                  console.log('SW registration failed: ', registrationError);\n                });\n              });\n            }"
          }
        </script>
      </body>
    </html>
  );
}
