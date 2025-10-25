'use client';

import { useState, useEffect } from 'react';
import { useAppContext, Product } from '@/context/AppContext';
import ShopPageContent from '@/components/ShopPageContent';

export default function ShopClient() {
  const { dispatch } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the API route
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const allProducts: Product[] = await response.json();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
      onAddToCart={handleAddToCart}
      onAddToWishlist={handleAddToWishlist}
      onQuickView={handleQuickView}
    />
  );
}