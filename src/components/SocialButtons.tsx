'use client';

import { useState } from 'react';
import { FaLinkedin, FaFacebook } from 'react-icons/fa';

const SocialButtons = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-2">
      <a
        href="https://www.linkedin.com/in/your-profile"
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-blue-600 text-white p-3 rounded-l-lg flex items-center space-x-1 transition-all duration-300 overflow-hidden ${
          activeButton === 'linkedin' ? 'w-28' : 'w-12'
        }`}
        onMouseEnter={() => setActiveButton('linkedin')}
        onMouseLeave={() => setActiveButton(null)}
      >
        <FaLinkedin size={20} className="flex-shrink-0" />
        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          activeButton === 'linkedin' ? 'w-20 opacity-100' : 'w-0 opacity-0'
        }`}>LinkedIn</span>
      </a>
      <a
        href="https://www.facebook.com/your-profile"
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-blue-800 text-white p-3 rounded-l-lg flex items-center space-x-1 transition-all duration-300 overflow-hidden ${
          activeButton === 'facebook' ? 'w-28' : 'w-12'
        }`}
        onMouseEnter={() => setActiveButton('facebook')}
        onMouseLeave={() => setActiveButton(null)}
      >
        <FaFacebook size={20} className="flex-shrink-0" />
        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          activeButton === 'facebook' ? 'w-20 opacity-100' : 'w-0 opacity-0'
        }`}>Facebook</span>
      </a>
    </div>
  );
};

export default SocialButtons;
