
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import AdvancedCategoryFilter from '@/components/AdvancedCategoryFilter';
import { Product } from '@/context/AppContext';
import FloatingFilterButton from './FloatingFilterButton';
import CategoryFilterModal from './CategoryFilterModal';

interface ShopPageContentProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function ShopPageContent({
  products,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: ShopPageContentProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('price-asc');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [currentSubcategory, setCurrentSubcategory] = useState<string>('');
  const [currentTag, setCurrentTag] = useState<string>('');
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  // Listen for category filter changes from the modal
  useEffect(() => {
    const handleCategoryFilterChange = (e: CustomEvent) => {
      const { category, subcategory } = e.detail;
      setCurrentCategory(category);
      setCurrentSubcategory(subcategory);
    };

    // Add event listener for category filter changes
    window.addEventListener('categoryFilterChanged', handleCategoryFilterChange as EventListener);
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('categoryFilterChanged', handleCategoryFilterChange as EventListener);
    };
  }, []);

  // Update filtered products when products, category, subcategory, or searchQuery changes
  useEffect(() => {
    let filtered = [...products];
    
    if (currentCategory && currentCategory !== 'Shop by Age') {
      filtered = filtered.filter(product => product.category === currentCategory);
      if (currentSubcategory) {
        filtered = filtered.filter(product => product.subcategory === currentSubcategory);
      }
    } else if (currentCategory === 'Shop by Age' && currentTag) {
      filtered = filtered.filter(product => product.tags?.includes(currentTag));
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply sort
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, currentCategory, currentSubcategory, currentTag, searchQuery, sortOption]);

  // Scroll to top when filtered products change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filteredProducts]);

  const handleCategorySubcategoryFilter = useCallback((category: string, subcategory: string, tag: string) => {
    setCurrentCategory(category);
    setCurrentSubcategory(subcategory);
    setCurrentTag(tag);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
  }, []);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen py-8 mt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Our Exclusive Collection
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover a world of comfort and joy for your little ones. High-quality products crafted with love.
          </p>
        </motion.div>

        {/* Floating Filter Button - Mobile Only */}
        <FloatingFilterButton onClick={() => setFilterModalOpen(true)} />

        {/* Category Filter Modal - Mobile Only */}
        <CategoryFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onFilterChange={handleCategorySubcategoryFilter}
          initialCategory={currentCategory}
          initialSubcategory={currentSubcategory}
          initialTag={currentTag}
        />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Advanced Filter Sidebar - Hidden on mobile */}
          <div className="w-full md:w-1/5 flex-shrink-0 md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:overflow-y-auto hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AdvancedCategoryFilter 
                onFilterChange={handleCategorySubcategoryFilter}
                initialCategory={currentCategory}
                initialSubcategory={currentSubcategory}
                initialTag={currentTag}
              />
              
              {/* Search Filter */}
              <div className="mt-6 p-4 bg-white rounded-xl shadow-lg">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">Search Products</h2>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Products Grid */}
          <div className="w-full md:w-4/5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              {/* Search input - visible on mobile */}
              <div className="md:hidden mb-4 w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
                />
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {currentCategory && (
                  <span> in <span className="font-medium">{currentCategory}</span></span>
                )}
                {currentSubcategory && (
                  <span> - <span className="font-medium">{currentSubcategory}</span></span>
                )}
              </div>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue text-sm"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
            </div>
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-full py-12 bg-white rounded-2xl shadow-lg"
              >
                <p className="text-2xl font-semibold text-indigo-600">No products found</p>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search query.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id} 
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onAddToWishlist={onAddToWishlist}
                      onQuickView={onQuickView}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
