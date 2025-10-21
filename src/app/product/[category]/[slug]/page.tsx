import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { parseProductIdFromSlug } from '@/utils/productUtils';
import ProductDetailPageContent from './ProductDetailPageContent';
import { getProductById, getProductsByCategory } from '@/data/products';

// Generate metadata for SEO
export async function generateMetadata({ 
  params: paramsPromise 
}: { 
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await paramsPromise;
  let productId: number | null = null;
  
  // Try to parse ID from slug (slug format: product-name-123)
  if (typeof slug === 'string') {
    productId = parseProductIdFromSlug(slug);
  } else if (Array.isArray(slug) && slug[0]) {
    productId = parseProductIdFromSlug(slug[0]);
  }
  
  // If parsing failed, try as direct ID
  if (!productId && typeof slug === 'string') {
    productId = parseInt(slug);
  } else if (!productId && Array.isArray(slug) && slug[0]) {
    productId = parseInt(slug[0]);
  }
  
  if (!productId) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }
  
  const product = await getProductById(productId);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  return {
    title: `${product.name} | BabyAGES E-commerce`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website', // Changed from 'product' to 'website' as 'product' is not a valid OpenGraph type
      url: `https://your-domain.com/product/${product.category?.toLowerCase().replace(/\\s+/g, '-')}/${product.subcategory?.toLowerCase().replace(/\\s+/g, '-') || ''}/${product.name.toLowerCase().replace(/\\s+/g, '-').replace(/[^\w-]/g, '')}-${product.id}`,
      images: [
        {
          url: product.images?.[0] || '/default-product-image.jpg',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.images?.[0] || '/default-product-image.jpg'],
    },
    alternates: {
      canonical: `https://your-domain.com/product/${product.category?.toLowerCase().replace(/\\s+/g, '-')}/${product.subcategory?.toLowerCase().replace(/\\s+/g, '-') || ''}/${product.name.toLowerCase().replace(/\\s+/g, '-').replace(/[^\w-]/g, '')}-${product.id}`,
    },
  };
}

export default async function ProductDetailPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await paramsPromise; // Only using slug, category is available if needed later
  let productId: number | null = null;
  
  // Try to parse ID from slug (slug format: product-name-123)
  if (typeof slug === 'string') {
    productId = parseProductIdFromSlug(slug);
  } else if (Array.isArray(slug) && slug[0]) {
    productId = parseProductIdFromSlug(slug[0]);
  }
  
  // If parsing failed, try as direct ID
  if (!productId && typeof slug === 'string') {
    productId = parseInt(slug);
  } else if (!productId && Array.isArray(slug) && slug[0]) {
    productId = parseInt(slug[0]);
  }
  
  if (!productId) {
    notFound();
  }
  
  const product = await getProductById(productId);
  
  if (!product) {
    notFound();
  }
  
  // Get related products based on category
  const relatedProducts = (await getProductsByCategory(product.category || ''))
    .filter(p => p.id !== product.id)
    .slice(0, 6); // Limit to 6 related products

  return <ProductDetailPageContent product={product} relatedProducts={relatedProducts} />;
}