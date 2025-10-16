'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaShoppingCart, FaHeart, FaBars, FaTimes, FaHandPointUp } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  // Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
            {/* Wishlist Icon */}
            <button 
              className="relative p-2"
              onClick={toggleWishlist}
            >
              <FaHeart className="text-gray-700 text-xl" />
              {state.wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              className="relative p-2"
              onClick={toggleCart}
            >
              <FaShoppingCart className="text-gray-700 text-xl" />
              {state.cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
          aria-label="Scroll to top"
        >
          <FaHandPointUp />
        </button>
      )}
    </>
  );
};

export default Navbar;