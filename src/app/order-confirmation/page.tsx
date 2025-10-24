import { Metadata } from 'next';
import OrderConfirmationContent from '@/components/OrderConfirmationContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Order Confirmation | BabyAGES',
  description: 'Thank you for your order! Your purchase has been confirmed and will be shipped soon.',
  openGraph: {
    title: 'Order Confirmation | BabyAGES',
    description: 'Thank you for your order! Your purchase has been confirmed and will be shipped soon.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/order-confirmation`,
  },
  twitter: {
    card: 'summary',
    title: 'Order Confirmation | BabyAGES',
    description: 'Thank you for your order! Your purchase has been confirmed.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/order-confirmation`,
  },
  robots: {
    index: false, // Don't index confirmation pages as they contain order-specific data
    follow: false,
  },
};

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pt-32 md:pt-40">
      <Suspense fallback={<div className="max-w-4xl mx-auto p-4 md:p-6 flex items-center justify-center h-64"><p className="text-xl">Loading order details...</p></div>}>
        <OrderConfirmationContent />
      </Suspense>
    </div>
  );
}