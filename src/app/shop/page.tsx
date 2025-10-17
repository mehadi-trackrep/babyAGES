'use client';

import { useState } from 'react';
import { useAppContext, Product } from '@/context/AppContext';
import { getAllProducts } from '@/data/products';
import ShopPageContent from '@/components/ShopPageContent';

export default function ShopPage() {
  const { dispatch } = useAppContext();
  const [products] = useState<Product[]>(() => getAllProducts());

  const categories = ['All', ...new Set(products.map((p) => p.category))].filter(Boolean) as string[];

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', product });
  };

  const handleQuickView = (product: Product) => {
    dispatch({ type: 'OPEN_QUICK_VIEW', product });
  };

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
