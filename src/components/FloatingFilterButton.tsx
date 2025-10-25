
'use client';

import { motion } from 'framer-motion';

interface FloatingFilterButtonProps {
  onClick: () => void;
}

export default function FloatingFilterButton({ onClick }: FloatingFilterButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="md:hidden fixed bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg z-30 flex items-center justify-center"
      aria-label="Filter products"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6m-3 4h0" />
      </svg>
    </motion.button>
  );
}
