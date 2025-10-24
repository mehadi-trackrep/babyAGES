import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Checkout | BabyAGES',
    description: 'Securely complete your purchase with BabyAGES. Fast and reliable checkout process.',
    openGraph: {
      title: 'Checkout | BabyAGES',
      description: 'Securely complete your purchase with BabyAGES.',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/checkout`,
    },
    twitter: {
      card: 'summary',
      title: 'Checkout | BabyAGES',
      description: 'Securely complete your purchase with BabyAGES.',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/checkout`,
    },
    robots: {
      index: false, // Don't index checkout pages as they are user-specific
      follow: false,
    },
  };
}

// Import and render the client component
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return <CheckoutClient />;
}