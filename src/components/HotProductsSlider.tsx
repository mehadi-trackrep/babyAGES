'use client';

import React, { useState, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Product, useAppContext } from '@/context/AppContext';
import ProductCard from './ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HotProductsSlider = () => {
  const { dispatch } = useAppContext();
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1
  }, [Autoplay({ delay: 3000, stopOnMouseEnter: false })]);
  
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts: Product[] = await response.json();
        
        // Filter to only include products where isHotProduct === 1 (handling both number and string from sheet)
        const filteredProducts = allProducts.filter(product => product.isHotProduct === 1 || String(product.isHotProduct) === '1');
        
        setHotProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching hot products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  // Set up navigation buttons
  useEffect(() => {
    if (!emblaApi) return;
    
    const scrollPrev = () => emblaApi.scrollPrev();
    const scrollNext = () => emblaApi.scrollNext();
    
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    
    if (prevBtn) prevBtn.addEventListener('click', scrollPrev);
    if (nextBtn) nextBtn.addEventListener('click', scrollNext);
    
    return () => {
      if (prevBtn) prevBtn.removeEventListener('click', scrollPrev);
      if (nextBtn) nextBtn.removeEventListener('click', scrollNext);
    };
  }, [emblaApi]);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', product });
  };

  const handleQuickView = (product: Product) => {
    dispatch({ type: 'OPEN_QUICK_VIEW', product });
  };

  return (
    <section className="py-16 px-4 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-600 mb-2">Hot Products</h2>
          <p className="text-gray-600">Check out our trending items</p>
        </div>
        <div className="overflow-hidden relative" ref={emblaRef}>
          <div className="flex -ml-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 pl-4" key={index}>
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
                <div className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 pl-4" key={product.id}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} onQuickView={handleQuickView} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <p className="text-gray-600">No hot products available at the moment.</p>
              </div>
            )}
          </div>
          
          {/* Navigation Arrows */}
          <button
            ref={prevBtnRef}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            ref={nextBtnRef}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition-colors"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HotProductsSlider;