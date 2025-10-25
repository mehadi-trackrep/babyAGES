
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import CategorySubcategoryFilter from '@/components/CategorySubcategoryFilter';
import { Product } from '@/context/AppContext';

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

  // Update filtered products when products, category, subcategory, or searchQuery changes
  useEffect(() => {
    let filtered = [...products];
    
    // Apply category filter
    if (currentCategory) {
      filtered = filtered.filter(product => product.category === currentCategory);
    }
    
    // Apply subcategory filter if category is also selected
    if (currentCategory && currentSubcategory) {
      filtered = filtered.filter(product => 
        product.category === currentCategory && 
        product.subcategory === currentSubcategory
      );
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
  }, [products, currentCategory, currentSubcategory, searchQuery, sortOption]);

  const handleCategorySubcategoryFilter = (category: string, subcategory: string) => {
    setCurrentCategory(category);
    setCurrentSubcategory(subcategory);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

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

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/4"
          >
            {/* Category-Subcategory Filter */}
            <CategorySubcategoryFilter 
              onFilterChange={handleCategorySubcategoryFilter}
              initialCategory={currentCategory}
              initialSubcategory={currentSubcategory}
            />
            
            {/* Search Filter */}
            <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-600">Other Filters</h2>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Search</h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-blue"
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
