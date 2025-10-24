'use client';

import Script from 'next/script';
import { Product } from '@/context/AppContext';

interface ProductStructuredDataProps {
  product: Product;
}

const ProductStructuredData = ({ product }: ProductStructuredDataProps) => {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images?.[0],
    description: product.description,
    sku: product.id.toString(),
    mpn: product.id.toString(), // Manufacturer part number
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.itemsLeft && product.itemsLeft > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app'}/product/${product.category?.toLowerCase().replace(/\s+/g, '-')}/${product.subcategory?.toLowerCase().replace(/\s+/g, '-') || ''}/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\\w-]/g, '')}-${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'BabyAGES',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 0,
      reviewCount: product.commentsAndRatings?.length || 0,
    },
    brand: {
      '@type': 'Brand',
      name: 'BabyAGES',
    },
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default ProductStructuredData;