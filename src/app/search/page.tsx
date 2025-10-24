import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export const metadata: Metadata = {
  title: 'Search Products | BabyAGES',
  description: 'Search for baby products in our extensive collection. Find exactly what you need for your little ones.',
  openGraph: {
    title: 'Search Products | BabyAGES',
    description: 'Search for baby products in our extensive collection.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/search`,
  },
  twitter: {
    card: 'summary',
    title: 'Search Products | BabyAGES',
    description: 'Search for baby products in our extensive collection.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/search`,
  },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-lg text-gray-600">Loading search...</p></div></div>}>
      <SearchPageClient />
    </Suspense>
  );
}