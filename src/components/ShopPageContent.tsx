
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/AppContext';

interface ShopPageContentProps {
  products: Product[];
  categories: string[];
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function ShopPageContent({
  products,
  categories,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: ShopPageContentProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterProducts = (category: string | undefined, query: string) => {
    let result = products;
    if (category && category !== 'All') {
      result = result.filter((p) => p.category === category);
    }
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }
    setFilteredProducts(result);
  };

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    filterProducts(category, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterProducts(selectedCategory, query);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-lg text-left text-sm font-medium transition-all duration-300 ${
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

              {/* Search Filter */}
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
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-full py-12 bg-white rounded-2xl shadow-lg"
              >
                <p className="text-2xl font-semibold text-gray-700">No products found</p>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search query.</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onAddToWishlist={onAddToWishlist}
                      onQuickView={onQuickView}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
