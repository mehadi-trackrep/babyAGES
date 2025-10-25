
'use client';

import { FaLinkedin, FaFacebook } from 'react-icons/fa';

const SocialButtons = () => {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-2">
      <a
        href="https://www.linkedin.com/in/babyages-bd-19422938b/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white p-2 rounded-r-lg flex items-center justify-center w-10 h-10"
      >
        <FaLinkedin size={20} />
      </a>
      <a
        href="https://www.facebook.com/profile.php?id=61582673437666"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-800 text-white p-2 rounded-r-lg flex items-center justify-center w-10 h-10"
      >
        <FaFacebook size={20} />
      </a>
    </div>
  );
};

export default SocialButtons;
