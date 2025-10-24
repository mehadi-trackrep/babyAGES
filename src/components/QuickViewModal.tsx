'use client';

import { useState, useRef } from 'react';
import { FaTimes, FaShoppingCart, FaHeart, FaChevronLeft, FaChevronRight, FaExpand, FaCompress } from 'react-icons/fa';
import Image from 'next/image';
import Slider from 'react-slick';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  videos?: string[];
  category?: string;
  sizes?: string[];
  colors?: string[];
  selectedOptions?: {
    size?: string;
    color?: string;
  };
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const PrevArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style, display: 'block', left: '10px', zIndex: 1 }}
      onClick={onClick}
    >
      <FaChevronLeft />
    </div>
  );
};

const NextArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style, display: 'block', right: '10px', zIndex: 1 }}
      onClick={onClick}
    >
      <FaChevronRight />
    </div>
  );
};

const QuickViewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist
}: QuickViewModalProps) => {
  const { dispatch } = useAppContext();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    // Create a product with default options if available
    const productWithOptions = {
      ...product,
      selectedOptions: {
        size: product.selectedOptions?.size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined),
        color: product.selectedOptions?.color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined)
      }
    };
    
    onAddToCart(productWithOptions);
    onClose();
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
    onClose();
  };

  const nextVideo = () => {
    if (product.videos && product.videos.length > 0) {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === product.videos!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevVideo = () => {
    if (product.videos && product.videos.length > 0) {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === 0 ? product.videos!.length - 1 : prevIndex - 1
      );
    }
  };

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed && imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery Section */}
            <div 
              className="relative"
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
            >
              <Slider {...sliderSettings}>
                {product.images.map((image, index) => (
                  <div key={index} className="relative h-[50vh]">
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className={`object-contain ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onClick={toggleZoom}
                      style={{
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: isZoomed ? 'scale(2)' : 'scale(1)',
                      }}
                    />
                  </div>
                ))}
              </Slider>
              <button
                onClick={toggleZoom}
                className="absolute top-3 right-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2.5 shadow-lg transition-all"
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              >
                {isZoomed ? <FaCompress className="text-gray-800" /> : <FaExpand className="text-gray-800" />}
              </button>
            </div>
            
            {/* Product Details Section */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">৳{product.price.toFixed(2)}</span>
                <div className="ml-4 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">({product.rating})</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center"
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleAddToWishlist}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100"
                  aria-label="Add to wishlist"
                >
                  <FaHeart className="text-gray-700" />
                </button>
                
                {/* View Details Button */}
                <Link
                  href={`/product/${product.category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized'}/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${product.id}`}
                  className="flex-1 min-w-[150px] bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg flex items-center justify-center hover:bg-gray-100"
                  onClick={() => {
                    dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Loading product details...' });
                    onClose(); // Close modal when clicking View Details
                  }}
                >
                  View Details
                </Link>
              </div>

              {/* Video Section - separate and clearly defined */}
              {product.videos && product.videos.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Product Videos</h3>
                  <div className="relative">
                    {product.videos[currentVideoIndex] && (
                      <div className="mt-2">
                        {/* Video Preview with Play Button */}
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          <Image
                            src={product.images?.[0] || "/api/placeholder/400/225"} // Use product image as thumbnail or a generic placeholder
                            alt="Video Thumbnail"
                            fill
                            className="object-cover"
                          />
                          <button
                            onClick={openVideoModal}
                            className="absolute bg-black bg-opacity-50 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-opacity-75 transition-opacity"
                            aria-label="Play video"
                          >
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </button>
                        </div>

                        {/* Video navigation */}
                        {product.videos.length > 1 && (
                          <div className="flex items-center justify-between mt-3">
                            <button
                              onClick={prevVideo}
                              className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              aria-label="Previous video"
                            >
                              <FaChevronLeft className="mr-1" />
                              Prev
                            </button>

                            <span className="text-sm text-gray-600 px-2">
                              {currentVideoIndex + 1} of {product.videos.length}
                            </span>

                            <button
                              onClick={nextVideo}
                              className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              aria-label="Next video"
                            >
                              Next
                              <FaChevronRight className="ml-1" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      {showVideoModal && product.videos && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">{product.name} - Video {currentVideoIndex + 1}</h3>
              <button 
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close video player"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-4">
              {product.videos[currentVideoIndex] && (
                <div className="relative aspect-video">
                  {(() => {
                    const videoUrl = product.videos[currentVideoIndex];
                    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                      return (
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}?autoplay=1&mute=1`}
                          className="w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${product.name} Video ${currentVideoIndex + 1}`}
                        />
                      );
                    } else if (videoUrl.includes('drive.google.com') || (videoUrl.includes('google.com') && videoUrl.includes('/file/d/'))) {
                      // For Google Drive, use the preview URL in an iframe
                      // Google Drive does not support direct video embedding with autoplay due to security restrictions
                      return (
                        <iframe
                          src={getGoogleDriveEmbedUrl(videoUrl)}
                          className="w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${product.name} Video ${currentVideoIndex + 1}`}
                        />
                      );
                    } else {
                      return (
                        <iframe
                          src={`${product.videos[currentVideoIndex]}?autoplay=1`}
                          className="w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${product.name} Video ${currentVideoIndex + 1}`}
                        />
                      );
                    }
                  })()}
                </div>
              )}
              
              {product.videos.length > 1 && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={prevVideo}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Previous video"
                  >
                    <FaChevronLeft className="mr-1 inline" />
                    Previous
                  </button>
                  
                  <span className="text-gray-600">
                    {currentVideoIndex + 1} of {product.videos.length}
                  </span>
                  
                  <button
                    onClick={nextVideo}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label="Next video"
                  >
                    Next
                    <FaChevronRight className="ml-1 inline" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickViewModal;

// Helper function to extract YouTube ID from URL
const extractYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

const extractGoogleDriveId = (url: string): string => {
  // Match different Google Drive URL formats
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return '';
};

// Helper function to create a Google Drive embed URL that's more likely to work in iframes
const getGoogleDriveEmbedUrl = (url: string): string => {
  const fileId = extractGoogleDriveId(url);
  if (!fileId) return url; // Return original URL if we can't extract the ID
  
  // Use the preview format which is most compatible with iframes
  return `https://drive.google.com/file/d/${fileId}/preview`;
};