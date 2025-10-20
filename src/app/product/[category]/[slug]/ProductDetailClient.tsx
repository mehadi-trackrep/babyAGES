'use client';

import { useState, useEffect } from 'react';
import { Product, useAppContext } from '@/context/AppContext';
import { getProductById, getProductsByCategory } from '@/data/products';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { FiHeart, FiShoppingCart, FiShare2, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

interface ProductDetailClientProps {
  productId: number | null;
}

// Mock reviews data - in a real app, this would come from an API
const mockReviews = [
  {
    id: 1,
    userName: 'John Doe',
    rating: 5,
    comment: 'This product is amazing! Very high quality and worth the money.',
    date: '2023-10-15'
  },
  {
    id: 2,
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Great product overall. My only complaint is that it took a bit long to ship.',
    date: '2023-10-18'
  },
  {
    id: 3,
    userName: 'Robert Johnson',
    rating: 5,
    comment: 'Exceeded my expectations! Will definitely buy again.',
    date: '2023-10-20'
  }
];

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const { dispatch } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(mockReviews);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (productId !== null) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Get related products based on category
        const related = getProductsByCategory(foundProduct.category || '')
          .filter(p => p.id !== foundProduct.id)
          .slice(0, 6); // Limit to 6 related products
        setRelatedProducts(related);
      }
    }
    
    setLoaded(true);
  }, [productId]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-600">Product not found</p>
          <p className="mt-2 text-gray-500">We couldn&#39;t find the product you&#39;re looking for.</p>
          <Link href="/shop" className="mt-4 inline-block text-blue-600 hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART_WITH_QUANTITY', product, quantity });
  };

  const handleAddToWishlist = () => {
    dispatch({ type: 'ADD_TO_WISHLIST', product });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the review to an API
    const review = {
      id: reviews.length + 1,
      userName: 'Current User',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-blue-600">Shop</Link></li>
            <li>/</li>
            <li className="capitalize text-gray-900 font-medium">{product.category}</li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <Image
                  src={product.images?.[selectedImage] || '/api/placeholder/600/600'}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-96 object-contain rounded-lg"
                />
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="ml-2 text-gray-600">({product.rating} Reviews)</span>
              </div>

              <div className="text-3xl font-bold text-indigo-600 mb-6">৳{product.price.toFixed(2)}</div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              <div className="flex items-center mb-6">
                <label className="mr-4 text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <FiShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 min-w-[150px] bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors duration-300"
                >
                  <FiHeart className="mr-2" />
                  Wishlist
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex-1 min-w-[150px] bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors duration-300"
                >
                  <FiShare2 className="mr-2" />
                  Share
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex">
                    <span className="w-32 text-gray-500">Category</span>
                    <span className="font-medium capitalize">{product.category}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-500">Rating</span>
                    <span className="font-medium">{product.rating}/5</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-500">Availability</span>
                    <span className="font-medium text-green-600">In Stock</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 px-6 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleAddReview}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className="text-2xl"
                        >
                          {star <= newReview.rating ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Share your experience with this product..."
                    />
                    {newReview.comment.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1 text-right">
                        {newReview.comment.length}/500 characters
                      </p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(review.rating) ? (
                            <FaStar className="text-yellow-400" />
                          ) : i === Math.floor(review.rating) && review.rating % 1 >= 0.5 ? (
                            <FaStarHalfAlt className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-gray-300" />
                          )}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="border-t border-gray-200 px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
              <Link href="/shop" className="text-blue-600 hover:underline flex items-center">
                View All <FiChevronRight className="ml-1" />
              </Link>
            </div>
            
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedProductSlug = `${relatedProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${relatedProduct.id}`;
                  return (
                    <Link 
                      key={relatedProduct.id} 
                      href={`/product/${relatedProduct.category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized'}/${relatedProductSlug}`}
                    >
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="h-48 flex items-center justify-center p-4">
                          <Image
                            src={relatedProduct.images?.[0] || '/api/placeholder/300/300'}
                            alt={relatedProduct.name}
                            width={300}
                            height={300}
                            className="object-contain max-h-32"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">{relatedProduct.name}</h3>
                          <p className="text-indigo-600 font-bold">৳{relatedProduct.price.toFixed(2)}</p>
                          <div className="flex items-center mt-2">
                            <div className="flex">
                              {renderStars(relatedProduct.rating)}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">({relatedProduct.rating})</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No related products found in this category.</p>
                <Link href="/shop" className="mt-4 inline-block text-blue-600 hover:underline">
                  Browse other products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}