
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import AdvancedCategoryFilter from './AdvancedCategoryFilter';

interface CategoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (category: string, subcategory: string) => void;
  initialCategory: string;
  initialSubcategory: string;
}

export default function CategoryFilterModal({
  isOpen,
  onClose,
  onFilterChange,
  initialCategory,
  initialSubcategory,
}: CategoryFilterModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Filter by Category</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AdvancedCategoryFilter
                onFilterChange={onFilterChange}
                initialCategory={initialCategory}
                initialSubcategory={initialSubcategory}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
