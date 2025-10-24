import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About BabyAGES - Our Story and Mission',
    description: 'Learn about BabyAGES, our mission to provide safe and quality baby products, and our commitment to families.',
    keywords: 'about babyages, baby products company, baby store mission, parenting, baby care',
    openGraph: {
      title: 'About BabyAGES - Our Story and Mission',
      description: 'Learn about BabyAGES, our mission to provide safe and quality baby products, and our commitment to families.',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/about`,
      images: [
        {
          url: '/images/og/og-about.svg',
          width: 1200,
          height: 630,
          alt: 'About BabyAGES - Our Story and Mission',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About BabyAGES - Our Story and Mission',
      description: 'Learn about BabyAGES, our mission to provide safe and quality baby products.',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/about`,
    },
  };
}

// Import and render the client component
import AboutClient from './AboutClient';

export default function AboutPage() {
  return <AboutClient />;
}