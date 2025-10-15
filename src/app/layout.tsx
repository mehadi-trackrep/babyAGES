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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BabyAGES - Your E-commerce Solution",
  description: "A simple e-commerce platform for your shopping needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
