'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Product } from '@/context/AppContext';
import ProductCard from './ProductCard';

const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'Stylish Baby Onesie',
    price: 25.99,
    images: ['https://images.unsplash.com/photo-1596481360364-585458a38916?q=80&w=1974&auto=format&fit=crop'],
    category: 'Apparel',
    rating: 4.8,
    description: 'A stylish and comfortable onesie for your baby.',
  },
  {
    id: 2,
    name: 'Organic Baby Food',
    price: 8.99,
    images: ['https://images.unsplash.com/photo-1519733066400-2251713b3462?q=80&w=2070&auto=format&fit=crop'],
    category: 'Food',
    rating: 4.9,
    description: 'Healthy and delicious organic baby food.',
  },
  {
    id: 3,
    name: 'Wooden Baby Toy',
    price: 15.00,
    images: ['https://images.unsplash.com/photo-1578652520312-2a2916b555a1?q=80&w=1974&auto=format&fit=crop'],
    category: 'Toys',
    rating: 4.7,
    description: 'A safe and fun wooden toy for your baby.',
  },
  {
    id: 4,
    name: 'Soft Baby Blanket',
    price: 35.00,
    images: ['https://images.unsplash.com/photo-1566150905458-1bf1ba194f5f?q=80&w=2070&auto=format&fit=crop'],
    category: 'Bedding',
    rating: 4.9,
    description: 'A soft and cozy blanket to keep your baby warm.',
  },
];

const HotProductsSlider = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Hot Products</h2>
          <p className="text-gray-600">Check out our trending items</p>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {dummyProducts.map((product) => (
              <div className="flex-grow-0 flex-shrink-0 w-1/3 pl-4" key={product.id}>
                <ProductCard product={product} onAddToCart={() => {}} onAddToWishlist={() => {}} onQuickView={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotProductsSlider;