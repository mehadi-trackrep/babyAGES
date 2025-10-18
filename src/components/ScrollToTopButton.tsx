
'use client';

import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

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
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-blue-700"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
