import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'BabyAGES - Top Selected Baby Products',
    description: 'Shop the best quality baby products with free packaging. Discover a wide range of baby essentials for your little ones.',
    keywords: 'baby products, baby essentials, baby toys, baby clothes, baby care, online baby store',
    openGraph: {
      title: 'BabyAGES - Top Selected Baby Products',
      description: 'Shop the best quality baby products with free packaging. Discover a wide range of baby essentials for your little ones.',
      type: 'website',
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app',
      images: [
        {
          url: '/images/og/og-website.png',
          width: 1200,
          height: 630,
          alt: 'BabyAGES - Top Selected Baby Products',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'BabyAGES - Top Selected Baby Products',
      description: 'Shop the best quality baby products with free packaging. Discover a wide range of baby essentials for your little ones.',
      images: ['/images/og/og-website.png'],
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app',
    },
  };
}

// Import and render the client component
import HomeClient from './HomeClient';

export default function Home() {
  return <HomeClient />;
}