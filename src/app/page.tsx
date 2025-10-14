'use client';

import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import { FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';
import { getAllProducts } from '@/data/products';

// Get featured products (first 4 from the database)
const featuredProducts = getAllProducts().slice(0, 8);

export default function Home() {
  const { dispatch } = useAppContext();
  const router = useRouter();

  const handleAddToCart = (product: any) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleAddToWishlist = (product: any) => {
    dispatch({ type: 'ADD_TO_WISHLIST', product });
  };

  const handleQuickView = (product: any) => {
    dispatch({ type: 'OPEN_QUICK_VIEW', product });
  };

  return (
    <div className="min-h-screen">
      <HeroSlider />
      
      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
            <p className="text-gray-600">Discover our most popular products</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Special Offer!</h2>
          <p className="text-xl mb-6">Get 20% off on your first order with code: FIRST20</p>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition duration-300">
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
}
