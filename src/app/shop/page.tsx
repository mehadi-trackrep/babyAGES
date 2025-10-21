'use client';

import { useState, useEffect } from 'react';
import { useAppContext, Product } from '@/context/AppContext';
import ShopPageContent from '@/components/ShopPageContent';

export default function ShopPage() {
  const { dispatch } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        // Fetch products from the API route
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts: Product[] = await response.json();
        setProducts(allProducts);

        // Extract categories from products
        const allCategories = [...new Set(allProducts.map(p => p.category).filter(cat => cat !== undefined))] as string[];
        setCategories(['All', ...allCategories]);
      } catch (error) {
        console.error('Error fetching products or categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', product });
  };

  const handleQuickView = (product: Product) => {
    dispatch({ type: 'OPEN_QUICK_VIEW', product });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <ShopPageContent
      products={products}
      categories={categories}
      onAddToCart={handleAddToCart}
      onAddToWishlist={handleAddToWishlist}
      onQuickView={handleQuickView}
    />
  );
}
