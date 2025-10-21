'use client';

import { useState } from 'react';
import { Product, useAppContext } from '@/context/AppContext';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { FiHeart, FiShoppingCart, FiShare2, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductDetailPageContentProps {
  product: Product;
  relatedProducts: Product[];
}


export default function ProductDetailPageContent({ product, relatedProducts }: ProductDetailPageContentProps) {
  const { dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  // Load reviews from session storage if available
  const loadReviews = () => {
    // Get session reviews (user submitted reviews during this session)
    let sessionReviews = [];
    try {
      const sessionKey = `product_reviews_${product.id}`;
      const sessionReviewsStr = sessionStorage.getItem(sessionKey);
      if (sessionReviewsStr) {
        sessionReviews = JSON.parse(sessionReviewsStr);
      }
    } catch (error) {
      console.error('Failed to load reviews from session storage:', error);
    }
    
    // If session reviews exist, return just those (the user has already submitted reviews)
    if (sessionReviews.length > 0) {
      return sessionReviews;
    }
    
    // Otherwise, return the original product reviews or mock reviews
    if (product.commentsAndRatings && product.commentsAndRatings.length > 0) {
      return product.commentsAndRatings.map((review, index) => ({
        id: index + 1, // Since the original reviews don't have ids, use index + 1
        userName: 'Anonymous User',
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString().split('T')[0] // Use current date for demo purposes
      }));
    } else {
      return [
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
    }
  };
  
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const hasSubmittedReview = reviews.some(review => review.userName === 'Current User');

  const handleAddToCart = () => {
    const productWithOptions = {
      ...product,
      selectedOptions: {
        size: selectedSize,
        color: selectedColor,
      }
    };
    dispatch({ type: 'ADD_TO_CART_WITH_QUANTITY', product: productWithOptions, quantity });
  };

  const handleAddToWishlist = () => {
    const productWithOptions = {
      ...product,
      selectedOptions: {
        size: selectedSize,
        color: selectedColor,
      }
    };
    dispatch({ type: 'ADD_TO_WISHLIST', product: productWithOptions });
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
      id: Date.now(), // Using timestamp as unique ID to avoid conflicts
      userName: 'Current User',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Add to current state
    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    
    // Save to session storage to persist during user session
    try {
      const sessionKey = `product_reviews_${product.id}`;
      sessionStorage.setItem(sessionKey, JSON.stringify(updatedReviews));
    } catch (error) {
      console.error('Failed to save review to session storage:', error);
    }
    
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
            {product.subcategory && (
              <>
                <li>/</li>
                <li className="capitalize text-gray-900 font-medium">{product.subcategory}</li>
              </>
            )}
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
              {product.subtitle && <p className="text-lg text-gray-600 mb-2">{product.subtitle}</p>}
              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="ml-2 text-gray-600">({product.rating} Reviews)</span>
              </div>

              <div className="flex items-center mb-6">
                {product.discountAmount && product.discountAmount > 0 ? (
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <div className="text-3xl font-bold text-indigo-600">৳{(product.price - product.discountAmount).toFixed(2)}</div>
                      <div className="ml-4 text-xl text-gray-500 line-through">৳{product.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium mr-2">
                        Save ৳{product.discountAmount}
                      </div>
                      <div className="px-3 py-1 bg-red-200 text-red-700 rounded-full text-sm font-bold">
                        {((product.discountAmount / product.price) * 100).toFixed(0)}% OFF
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-indigo-600">৳{product.price.toFixed(2)}</div>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
              
              {/* Product Videos Section */}
              {product.videos && product.videos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.videos.map((video, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                          <div className="relative pb-[56.25%] h-0">
                            <iframe
                              src={video}
                              className="absolute top-0 left-0 w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={`Product video ${index + 1}`}
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Size:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-100 text-blue-700'
                            : 'border-gray-300 hover:border-blue-500 hover:text-blue-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Color:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          selectedColor === color
                            ? 'border-blue-500 ring-2 ring-blue-300 scale-110'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <span className="text-white text-xs font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center mb-4">
                <label className="mr-4 text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-lg font-medium"
                  >
                    -
                  </button>
                  <span className="w-10 h-8 flex items-center justify-center border-x border-gray-300 bg-white font-medium">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              {product.itemsLeft !== undefined && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="text-red-600">Item Left Only: <span className="font-bold text-red-600">   {product.itemsLeft}</span> </span>
                  </div>
                </div>
              )}

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
                  {product.subcategory && (
                    <li className="flex">
                      <span className="w-32 text-gray-500">Subcategory</span>
                      <span className="font-medium capitalize">{product.subcategory}</span>
                    </li>
                  )}
                  <li className="flex">
                    <span className="w-32 text-gray-500">Rating</span>
                    <span className="font-medium">{product.rating}/5</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 text-gray-500">Availability</span>
                    <span className={`font-medium ${product.itemsLeft && product.itemsLeft < 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.itemsLeft && product.itemsLeft < 5 ? `${product.itemsLeft} left` : 'In Stock'}
                    </span>
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
                {hasSubmittedReview ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">Thank you for your review! You have already submitted a review for this product.</p>
                    <p className="text-sm text-gray-500">Each user can submit only one review per product per session.</p>
                  </div>
                ) : (
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
                )}
              </div>
              
              <div className="space-y-6">
                {/* Display all reviews: original product reviews + user session reviews */}
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
                          {relatedProduct.subtitle && (
                            <p className="text-sm text-gray-600 truncate">{relatedProduct.subtitle}</p>
                          )}
                          <div className="flex flex-col">
                            {relatedProduct.discountAmount && relatedProduct.discountAmount > 0 ? (
                              <>
                                <div className="flex items-center">
                                  <span className="text-indigo-600 font-bold">৳{(relatedProduct.price - relatedProduct.discountAmount).toFixed(2)}</span>
                                  <span className="ml-2 text-sm text-gray-500 line-through">৳{relatedProduct.price.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-0.5 rounded mr-1">
                                    Save ৳{relatedProduct.discountAmount}
                                  </span>
                                  <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-0.5 rounded">
                                    {((relatedProduct.discountAmount / relatedProduct.price) * 100).toFixed(0)}% OFF
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-indigo-600 font-bold">৳{relatedProduct.price.toFixed(2)}</span>
                            )}
                          </div>
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