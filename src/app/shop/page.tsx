import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Shop All Products | BabyAGES',
    description: 'Browse our complete collection of baby products. Find everything you need for your little ones in one place.',
    keywords: 'baby products, online shop, baby essentials, baby toys, baby clothes',
    openGraph: {
      title: 'Shop All Products | BabyAGES',
      description: 'Browse our complete collection of baby products. Find everything you need for your little ones in one place.',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/shop`,
      images: [
        {
          url: '/images/og/og-shop.png',
          width: 1200,
          height: 630,
          alt: 'Shop All Products | BabyAGES',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Shop All Products | BabyAGES',
      description: 'Browse our complete collection of baby products.',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/shop`,
    },
  };
}

// Import and render the client component
import ShopClient from './ShopClient';

export default function ShopPage() {
  return <ShopClient />;
}