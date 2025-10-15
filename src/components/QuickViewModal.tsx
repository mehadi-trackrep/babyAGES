import { useState, useRef, useEffect } from 'react';
import { FaTimes, FaShoppingCart, FaHeart, FaChevronLeft, FaChevronRight, FaExpand, FaCompress } from 'react-icons/fa';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  videos?: string[];
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

const QuickViewModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onAddToWishlist 
}: QuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (product?.images && product.images.length > 0) {
          setCurrentImageIndex(prev => 
            prev === product.images!.length - 1 ? 0 : prev + 1
          );
        }
      } else if (e.key === 'ArrowLeft') {
        if (product?.images && product.images.length > 0) {
          setCurrentImageIndex(prev => 
            prev === 0 ? product.images!.length - 1 : prev - 1
          );
        }
      } else if (e.key === '+' || e.key === '=') {
        setIsZoomed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
    onClose();
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleImageZoom = (e: React.MouseEvent) => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
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
            <div className="relative">
              <div 
                ref={imageContainerRef}
                className="relative h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden"
              >
                {product.images && product.images.length > 0 && (
                  <div className="w-full h-full relative">
                    <Image 
                      src={product.images[currentImageIndex] || "/api/placeholder/500/500"} 
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className={`object-contain ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onMouseMove={isZoomed ? handleImageZoom : undefined}
                      onClick={toggleZoom}
                    />
                    
                    {/* Zoom overlay */}
                    {isZoomed && (
                      <div 
                        className="absolute inset-0 bg-white z-10"
                        onClick={toggleZoom}
                      >
                        <div 
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(${product.images[currentImageIndex]})`,
                            backgroundSize: '400% 400%',
                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                      aria-label="Previous image"
                      onClickCapture={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                      aria-label="Next image"
                      onClickCapture={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
                
                {/* Zoom button */}
                <button
                  onClick={toggleZoom}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md"
                  aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                >
                  {isZoomed ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
              
              {/* Thumbnail Navigation */}
              {product.images && product.images.length > 1 && (
                <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <div className="w-full h-full">
                        <Image 
                          src={img} 
                          alt={`${product.name} - Thumbnail ${index + 1}`} 
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Video Section */}
              {product.videos && product.videos.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Product Videos</h3>
                  <div className="relative">
                    {product.videos[currentVideoIndex] && (
                      <div className="mt-2">
                        {/* Extract YouTube ID from URL */}
                        {product.videos[currentVideoIndex].includes('youtube.com') || 
                         product.videos[currentVideoIndex].includes('youtu.be') ? (
                          <div className="relative aspect-video">
                            {/* Preview image for YouTube video */}
                            <div className="w-full h-full bg-gray-200 rounded-lg relative">
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-lg">
                                <button 
                                  onClick={openVideoModal}
                                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
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
                            </div>
                          </div>
                        ) : (
                          <iframe 
                            src={product.videos[currentVideoIndex]}
                            className="w-full h-48 rounded-lg"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${product.name} Video ${currentVideoIndex + 1}`}
                          />
                        )}
                        
                        {/* Video navigation */}
                        {product.videos.length > 1 && (
                          <div className="flex justify-between mt-2">
                            <button
                              onClick={prevVideo}
                              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                              aria-label="Previous video"
                            >
                              <FaChevronLeft />
                            </button>
                            
                            <span className="text-sm text-gray-600">
                              {currentVideoIndex + 1} of {product.videos.length}
                            </span>
                            
                            <button
                              onClick={nextVideo}
                              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                              aria-label="Next video"
                            >
                              <FaChevronRight />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Product Details Section */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
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
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center"
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
              </div>
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
                  {product.videos[currentVideoIndex].includes('youtube.com') || 
                   product.videos[currentVideoIndex].includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(product.videos[currentVideoIndex])}?autoplay=1`}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${product.name} Video ${currentVideoIndex + 1}`}
                    />
                  ) : (
                    <iframe
                      src={product.videos[currentVideoIndex]}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${product.name} Video ${currentVideoIndex + 1}`}
                    />
                  )}
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

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  videos?: string[];
  category?: string;
}

// Helper function to extract YouTube ID from URL
const extractYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};