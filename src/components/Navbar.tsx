'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useAppContext } from '@/context/AppContext';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[]; // Array of image URLs
  rating: number;
  category: string;
  videos?: string[]; // Optional array of video links
  subcategory?: string;
  subtitle?: string;
  discountAmount?: number;
  priceAfterDiscount?: number; // New field for discounted price
  sizes?: string[];
  colors?: string[];
  itemsLeft?: number;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const pathname = usePathname();
  const { state, dispatch } = useAppContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const toggleWishlist = () => {
    dispatch({ type: 'TOGGLE_WISHLIST' });
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Searching products...' });
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Fetch search results as user types
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&limit=6`); // Limit to 6 results
        const data = await response.json();
        if (response.ok) {
          // Limit to 6 results for the dropdown
          setSearchResults(data.results.slice(0, 6) || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (isSearchOpen && searchContainer && !searchContainer.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <>
      <nav className="bg-white shadow-md py-4 px-4 md:px-8 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <Link href="/">
              <Image src="/logo.png" alt="BabyAGES" width={100} height={50} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`font-medium ${pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className={`font-medium ${pathname === '/shop' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className={`font-medium ${pathname === '/about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              About Us
            </Link>
          </div>

          {/* Icons and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <div id="search-container" className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex flex-col">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 md:w-64"
                      autoFocus
                    />
                    <button 
                      type="button" 
                      className="ml-2 text-gray-700"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <FiX size={20} />
                    </button>
                    <button 
                      type="submit"
                      className="ml-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <FiSearch size={16} />
                    </button>
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {searchQuery && (
                    <div className="absolute top-full mt-1 w-full md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      {isLoading ? (
                        <div className="p-4 text-center">Searching...</div>
                      ) : searchResults.length > 0 ? (
                        <div className="divide-y">
                          {searchResults.map((product) => (
                            <Link 
                              key={product.id} 
                              href={`/product/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${product.id}`}
                              className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                              onClick={() => {
                                dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Loading product...' });
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }}
                            >
                              <div className="w-16 h-16 flex-shrink-0">
                                <Image
                                  src={product.images?.[0] || '/placeholder-image.jpg'}
                                  alt={product.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-contain rounded-md"
                                />
                              </div>
                              <div className="ml-3 flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1">{product.category}</p>
                                <div className="mt-1 flex items-center justify-between">
                                  <div>
                                    {product.priceAfterDiscount && product.priceAfterDiscount < product.price ? (
                                      <div className="flex flex-col">
                                        <div className="flex items-baseline">
                                          <span className="text-sm font-bold text-blue-600 mr-2">
                                            ৳{product.priceAfterDiscount}
                                          </span>
                                          <span className="text-xs text-gray-500 line-through">
                                            ৳{product.price}
                                          </span>
                                        </div>
                                        <div className="flex space-x-2 mt-1">
                                          <span className="text-xs text-red-600 font-medium bg-red-100 px-1.5 py-0.5 rounded">
                                            Save ৳{(product.price - product.priceAfterDiscount).toFixed(0)}
                                          </span>
                                          <span className="text-xs font-bold text-red-700 bg-red-200 px-1.5 py-0.5 rounded">
                                            {(((product.price - product.priceAfterDiscount) / product.price) * 100).toFixed(0)}% OFF
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-sm font-medium text-blue-600">
                                        ৳{product.price}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-xs text-gray-600"><FaStar className="text-yellow-400" />({product.rating})</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          {searchQuery ? 'No products found' : 'Start typing to search'}
                        </div>
                      )}
                    </div>
                  )}
                </form>
              ) : (
                <button 
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <FiSearch size={20} />
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <button 
              className="relative p-2"
              onClick={toggleWishlist}
            >
              <FiHeart className="text-gray-700 text-2xl hover:text-blue-600 transition-colors" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {state.wishlistItems.length}
              </span>
            </button>

            {/* Cart Icon */}
            <button 
              className="relative p-2"
              onClick={toggleCart}
            >
              <FiShoppingCart className="text-gray-700 text-2xl" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {state.cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`font-medium px-4 py-2 ${pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/shop" 
                className={`font-medium px-4 py-2 ${pathname === '/shop' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className={`font-medium px-4 py-2 ${pathname === '/about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
            </div>
          </div>
        )}
        
        
      </nav>
    </>
  );
};

export default Navbar;