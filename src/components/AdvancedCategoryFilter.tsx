'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategorySubcategoryFilterProps {
  onFilterChange: (category: string, subcategory: string) => void;
  initialCategory?: string;
  initialSubcategory?: string;
}

interface CategoryData {
  name: string;
  subcategories: string[];
}

const AdvancedCategoryFilter = ({ 
  onFilterChange, 
  initialCategory, 
  initialSubcategory
}: CategorySubcategoryFilterProps) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || '');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories and their subcategories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products?action=categories-with-subcategories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        
        // Set expanded category if one was selected
        if (initialCategory) {
          setExpandedCategory(initialCategory);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [initialCategory]);

  const handleCategorySelect = (category: string) => {
    // If clicking the same category, just expand/collapse it
    if (selectedCategory === category) {
      setExpandedCategory(expandedCategory === category ? null : category);
    } else {
      // Select new category and expand it
      setSelectedCategory(category);
      setSelectedSubcategory('');
      setExpandedCategory(category);
      onFilterChange(category, '');
    }
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    onFilterChange(selectedCategory, subcategory);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setExpandedCategory(null);
    onFilterChange('', '');
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Categories</h2>
        <button 
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Reset
        </button>
      </div>
      
      <div className="max-h-[500px] overflow-y-auto p-2">
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className={`w-full flex justify-between items-center px-4 py-3 text-left font-medium transition-colors duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => handleCategorySelect(category.name)}
              >
                <span className="truncate">{category.name}</span>
                <span className="ml-2 flex-shrink-0 text-lg font-bold transition-transform duration-200">
                  {expandedCategory === category.name ? '-' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {expandedCategory === category.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="py-2 px-4 bg-gray-50 border-t border-gray-200">
                      <div className="space-y-2">
                        
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                              selectedSubcategory === subcategory
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-200 text-gray-700'
                            }`}
                            onClick={() => handleSubcategorySelect(subcategory)}
                          >
                            {subcategory}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(AdvancedCategoryFilter);