import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Your Shopping Cart | BabyAGES',
    description: 'Review your items in the cart and proceed to checkout. Shop safely with BabyAGES.',
    openGraph: {
      title: 'Your Shopping Cart | BabyAGES',
      description: 'Review your items in the cart and proceed to checkout.',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/cart`,
    },
    twitter: {
      card: 'summary',
      title: 'Your Shopping Cart | BabyAGES',
      description: 'Review your items in the cart and proceed to checkout.',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/cart`,
    },
    robots: {
      index: false, // Don't index cart pages as they are user-specific
      follow: false,
    },
  };
}

// Import and render the client component
import ViewCartClient from './ViewCartClient';

export default function ViewCartPage() {
  return <ViewCartClient />;
}