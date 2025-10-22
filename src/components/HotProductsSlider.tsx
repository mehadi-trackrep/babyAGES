'use client';

import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Product } from '@/context/AppContext';
import ProductCard from './ProductCard';

const HotProductsSlider = () => {
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts: Product[] = await response.json();
        
        console.log('All products from API:', allProducts);
        console.log('Sample product with isHotProduct:', allProducts[0]?.isHotProduct);
        
        // Filter to only include products where isHotProduct === 1 (handling both number and string from sheet)
        const filteredProducts = allProducts.filter(product => product.isHotProduct === 1 || String(product.isHotProduct) === '1');
        
        console.log('Filtered hot products:', filteredProducts);
        console.log('Number of hot products found:', filteredProducts.length);
        
        setHotProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching hot products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-600 mb-2">Hot Products</h2>
          <p className="text-gray-600">Check out our trending items</p>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div className="flex-grow-0 flex-shrink-0 w-1/3 pl-4" key={index}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 animate-pulse h-96">
                    <div className="h-64 flex items-center justify-center p-4">
                      <div className="text-gray-500">Loading...</div>
                    </div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-10 bg-gray-200 rounded flex-grow"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : hotProducts.length > 0 ? (
              hotProducts.map((product) => (
                <div className="flex-grow-0 flex-shrink-0 w-1/3 pl-4" key={product.id}>
                  <ProductCard product={product} onAddToCart={() => {}} onAddToWishlist={() => {}} onQuickView={() => {}} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <p className="text-gray-600">No hot products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotProductsSlider;