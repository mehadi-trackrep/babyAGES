'use client';

import { useAppContext } from '@/context/AppContext';
import { Product } from '@/context/AppContext';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import FeatureSection from '@/components/FeatureSection';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import HotProductsSlider from '@/components/HotProductsSlider';

export default function Home() {
  const { dispatch } = useAppContext();
  const [sortOption, setSortOption] = useState('price-asc');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch products from the API route
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts: Product[] = await response.json();
        const initialFeaturedProducts = allProducts.slice(0, 8);
        
        // Apply initial sorting
        const sortedProducts = [...initialFeaturedProducts];
        switch (sortOption) {
          case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'rating-desc':
            sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          default:
            break;
        }
        setFeaturedProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortOption]);

  

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', product });
  };

  const handleQuickView = (product: Product) => {
    dispatch({ type: 'OPEN_QUICK_VIEW', product });
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="min-h-screen">
      <HeroSlider />
      {/* <CoverPhotoBanner /> */}
      <HotProductsSlider />
      
      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
            <p className="text-gray-600">Discover our most popular products</p>
          </div>

          <div className="flex justify-end mb-4">
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
            </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading state for featured products section - skeleton loader in the same grid layout
              Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 animate-pulse"
                >
                  <div className="h-48 flex items-center justify-center p-4">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <div className="h-10 bg-gray-200 rounded flex-grow"></div>
                      <div className="h-10 bg-gray-200 rounded w-10"></div>
                      <div className="h-10 bg-gray-200 rounded w-10"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onQuickView={handleQuickView}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Special Offer!</h2>
          <p className="text-xl mb-6">Get 20% off on your first order with code: FIRST20</p>
          <Link 
            href="/shop"
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>
      
      <FeatureSection />
    </div>
  );
}
