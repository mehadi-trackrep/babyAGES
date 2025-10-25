'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategorySubcategoryFilterProps {
  onFilterChange: (category: string, subcategory: string, tag: string) => void;
  initialCategory?: string;
  initialSubcategory?: string;
  initialTag?: string;
}

interface CategoryData {
  name: string;
  subcategories: string[];
}

const AdvancedCategoryFilter = ({ 
  onFilterChange, 
  initialCategory, 
  initialSubcategory,
  initialTag
}: CategorySubcategoryFilterProps) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || '');
  const [selectedTag, setSelectedTag] = useState<string>(initialTag || '');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories and their subcategories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch('/api/products?action=categories-with-subcategories'),
          fetch('/api/products?action=tags'),
        ]);

        if (!categoriesResponse.ok || !tagsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();

        setCategories(categoriesData);
        setTags(tagsData);
        
        // Set expanded category if one was selected
        if (initialCategory) {
          setExpandedCategory(initialCategory);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialCategory]);

  const handleCategorySelect = (category: string) => {
    if (selectedCategory !== category) {
      setSelectedCategory(category);
      setSelectedSubcategory(''); // Clear subcategory when category changes
      setSelectedTag(''); // Clear tag when category changes
      setExpandedCategory(category);
      onFilterChange(category, '', '');
    } else {
      setExpandedCategory(expandedCategory === category ? null : category);
    }
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setSelectedTag('');
    onFilterChange(selectedCategory, subcategory, '');
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setSelectedSubcategory('');
    setSelectedCategory('Shop by Age');
    setExpandedCategory('Shop by Age');
    onFilterChange('Shop by Age', '', tag);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedTag('');
    setExpandedCategory(null);
    onFilterChange('', '', '');
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
          <div className="border border-dashed border-blue-300 rounded-lg overflow-hidden">
            <button
              className={`w-full flex justify-between items-center px-4 py-3 text-left font-medium transition-colors duration-200 bg-blue-50 ${
                selectedCategory === 'Shop by Age'
                  ? 'text-blue-700'
                  : 'hover:bg-blue-100 text-gray-700'
              }`}
              onClick={() => handleCategorySelect('Shop by Age')}
            >
              <span className="truncate font-bold">Shop by Age</span>
              <span className="ml-2 flex-shrink-0 text-lg font-bold transition-transform duration-200">
                {expandedCategory === 'Shop by Age' ? '-' : '+'}
              </span>
            </button>
            <AnimatePresence>
              {expandedCategory === 'Shop by Age' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="py-2 px-4 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-2">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                            selectedTag === tag
                              ? 'bg-blue-100 text-blue-700' 
                              : 'hover:bg-gray-200 text-gray-700'
                          }`}
                          onClick={() => handleTagSelect(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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