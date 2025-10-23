import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-lg text-gray-600">Loading search...</p></div></div>}>
      <SearchPageClient />
    </Suspense>
  );
}