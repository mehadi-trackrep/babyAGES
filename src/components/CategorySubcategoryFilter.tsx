'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategorySubcategoryFilterProps {
  onFilterChange: (category: string, subcategory: string) => void;
  initialCategory?: string;
  initialSubcategory?: string;
}



export default function CategorySubcategoryFilter({ 
  onFilterChange, 
  initialCategory, 
  initialSubcategory 
}: CategorySubcategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || '');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products?action=categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        try {
          const response = await fetch(`/api/products?action=subcategories&category=${encodeURIComponent(selectedCategory)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch subcategories');
          }
          const data = await response.json();
          setSubcategories(data);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  // Apply filter whenever category or subcategory changes
  useEffect(() => {
    onFilterChange(selectedCategory, selectedSubcategory);
  }, [selectedCategory, selectedSubcategory, onFilterChange]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
  };

  // Mobile filter toggle button
  const MobileFilterButton = () => (
    <button
      onClick={() => setShowMobileFilters(!showMobileFilters)}
      className="md:hidden w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium mb-4 flex items-center justify-between"
    >
      <span>Filter by Category</span>
      <svg 
        className={`w-5 h-5 transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // Mobile filter content
  const MobileFilterContent = () => (
    <AnimatePresence>
      {showMobileFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Category Filter</h3>
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Category selection */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Select Category</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`px-3 py-1.5 text-sm rounded-full ${
                      !selectedCategory 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`px-3 py-1.5 text-sm rounded-full ${
                        selectedCategory === category 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory selection (only if category is selected) */}
              {selectedCategory && subcategories.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">Select Subcategory</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSubcategorySelect('')}
                      className={`px-3 py-1.5 text-sm rounded-full ${
                        !selectedSubcategory 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All
                    </button>
                    {subcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => handleSubcategorySelect(subcategory)}
                        className={`px-3 py-1.5 text-sm rounded-full ${
                          selectedSubcategory === subcategory 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Desktop filter content
  const DesktopFilterContent = () => (
    <div className="hidden md:block p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600">Categories & Subcategories</h2>
        <button 
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset All
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Category selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                !selectedCategory 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory selection (only if category is selected) */}
        {selectedCategory && subcategories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Subcategories in &quot;{selectedCategory}&quot;</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSubcategorySelect('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  !selectedSubcategory 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                }`}
              >
                All {selectedCategory}
              </button>
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedSubcategory === subcategory 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                  }`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MobileFilterButton />
      <MobileFilterContent />
      <DesktopFilterContent />
    </div>
  );
}