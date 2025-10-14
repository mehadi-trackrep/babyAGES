import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
      <body className={inter.className}>
        <AppProvider>
          <Navbar />
          {children}
          <Footer />
          <GlobalUI />
          <ToastManager />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
