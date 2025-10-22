import { FaShoppingCart, FaHeart, FaEye, FaStar, FaRegStar, FaStarHalfAlt, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/context/AppContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView 
}: ProductCardProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
  };

  const handleQuickView = () => {
    onQuickView(product);
  };

  const handleViewDetails = () => {
    setIsNavigating(true);
    // The navigation is handled by the Link component, but we show the loading state
    // and reset it after a short timeout to provide visual feedback
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000); // Reset loading after 1 second (or page navigation will prevent this)
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-200">
      <div className="relative overflow-hidden">
        <div className="w-full h-64">
          <Image 
            src={product.images?.[0] || "/api/placeholder/300/300"} 
            alt={product.name} 
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute top-4 right-4 md:right-0 flex flex-col space-y-2 transform md:translate-x-12 md:group-hover:translate-x-[-8px] transition-transform duration-300">
          <button 
            onClick={handleAddToWishlist}
            className="bg-white p-3 rounded-l-full shadow-md hover:bg-red-500 hover:text-white text-gray-700 transition-colors duration-300"
            aria-label="Add to wishlist"
          >
            <FaHeart />
          </button>
          <button 
            onClick={handleQuickView}
            className="bg-white p-3 rounded-l-full shadow-md hover:bg-blue-500 hover:text-white text-blue-500 transition-colors duration-300"
            aria-label="Quick view"
          >
            <FaEye />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <Link href={`/product/${product.category?.toLowerCase().replace(/\s+/g, '-')}/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${product.id}`}>
          <h3 className="font-bold text-xl mb-2 text-gray-800 cursor-pointer hover:text-blue-600 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            {product.priceAfterDiscount !== undefined && product.priceAfterDiscount > 0 ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">৳{product.priceAfterDiscount.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">৳{product.price.toFixed(2)}</span>
              </div>
            ) : product.discountAmount && product.discountAmount > 0 ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">৳{(product.price - product.discountAmount).toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">৳{product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-indigo-600">৳{product.price.toFixed(2)}</span>
            )}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                const rating = product.rating || 0;
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;
                
                if (i < fullStars) {
                  return <FaStar key={i} className="text-yellow-400" />;
                } else if (i === fullStars && hasHalfStar) {
                  return <FaStarHalfAlt key={`half-${i}`} className="text-yellow-400" />;
                } else {
                  return <FaRegStar key={`empty-${i}`} className="text-gray-300" />;
                }
              })}
            </div>
          </div>
          {product.priceAfterDiscount !== undefined && product.priceAfterDiscount > 0 ? (
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded">Save ৳{(product.price - product.priceAfterDiscount).toFixed(2)}</span>
              <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-1 rounded">
                {(((product.price - product.priceAfterDiscount) / product.price) * 100).toFixed(0)}% OFF
              </span>
            </div>
          ) : product.discountAmount && product.discountAmount > 0 ? (
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded">Save ৳{product.discountAmount}</span>
              <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-1 rounded">
                {((product.discountAmount / product.price) * 100).toFixed(0)}% OFF
              </span>
            </div>
          ) : null}
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </button>
          <Link href={`/product/${product.category?.toLowerCase().replace(/\s+/g, '-')}/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${product.id}`} onClick={handleViewDetails}>
            <button
              className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50"
              disabled={isNavigating}
            >
              {isNavigating ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Loading...
                </>
              ) : (
                'View Details'
              )}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;