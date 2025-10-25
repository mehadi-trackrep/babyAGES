'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiShoppingBag, FiUser, FiInfo } from 'react-icons/fi';

const MobileBottomNavigation = () => {
  const pathname = usePathname();

  // Define navigation items
  const navItems = [
    { 
      href: '/', 
      icon: <FiHome size={20} />, 
      label: 'Home' 
    },
    { 
      href: '/shop', 
      icon: <FiShoppingBag size={20} />, 
      label: 'Shop' 
    },
    { 
      href: '/about', 
      icon: <FiInfo size={20} />, 
      label: 'About' 
    },
    { 
      href: '/account', 
      icon: <FiUser size={20} />, 
      label: 'Account' 
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
              pathname === item.href 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;