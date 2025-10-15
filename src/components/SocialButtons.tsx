'use client';

import { FaLinkedin, FaFacebook } from 'react-icons/fa';

const SocialButtons = () => {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-2">
      <a
        href="https://www.linkedin.com/in/your-profile"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white p-3 rounded-l-lg flex items-center space-x-2 w-12 hover:w-32 transition-all duration-300 group"
      >
        <FaLinkedin size={24} />
        <span className="hidden group-hover:inline">LinkedIn</span>
      </a>
      <a
        href="https://www.facebook.com/your-profile"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-800 text-white p-3 rounded-l-lg flex items-center space-x-2 w-12 hover:w-32 transition-all duration-300 group"
      >
        <FaFacebook size={24} />
        <span className="hidden group-hover:inline">Facebook</span>
      </a>
    </div>
  );
};

export default SocialButtons;
