'use client';

import { useAppContext } from '@/context/AppContext';
import { Product } from '@/context/AppContext';
import CartSidebar from '@/components/CartSidebar';
import WishlistSidebar from '@/components/WishlistSidebar';
import QuickViewModal from '@/components/QuickViewModal';
import MobileBottomNavigation from '@/components/MobileBottomNavigation';
import { useRouter } from 'next/navigation';

// Global UI component that manages sidebars and modals across all pages
const GlobalUI = () => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();

  const handleRemoveFromCart = (id: number, selectedOptions?: { size?: string; color?: string }) => {
    dispatch({ type: 'REMOVE_FROM_CART', id, selectedOptions });
  };

  const handleUpdateQuantity = (id: number, quantity: number, selectedOptions?: { size?: string; color?: string }) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity, selectedOptions });
  };

  const handleRemoveFromWishlist = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', id });
  };

  const handleCartAddFromWishlist = (product: Product) => {
    // Create a new product object with default options if they don't exist
    const productWithDefaults = {
      ...product,
      selectedOptions: {
        size: product.selectedOptions?.size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined),
        color: product.selectedOptions?.color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined)
      }
    };
    
    dispatch({ type: 'ADD_TO_CART_WITH_QUANTITY', product: productWithDefaults, quantity: 1 });
    dispatch({ type: 'REMOVE_FROM_WISHLIST', id: product.id });
  };

  const handleCheckout = () => {
    dispatch({ type: 'TOGGLE_CART', isOpen: false });
    router.push('/checkout');
  };

  const handleViewCart = () => {
    dispatch({ type: 'TOGGLE_CART', isOpen: false });
    router.push('/cart');
  };

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleAddToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', product });
  };

  return (
    <>
      <CartSidebar
        isOpen={state.isCartOpen}
        onClose={() => dispatch({ type: 'TOGGLE_CART', isOpen: false })}
        cartItems={state.cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
        onViewCart={handleViewCart}
      />

      <WishlistSidebar
        isOpen={state.isWishlistOpen}
        onClose={() => dispatch({ type: 'TOGGLE_WISHLIST', isOpen: false })}
        wishlistItems={state.wishlistItems}
        onRemoveItem={handleRemoveFromWishlist}
        onAddToCart={handleCartAddFromWishlist}
      />

      <QuickViewModal
        product={state.quickViewProduct}
        isOpen={state.isQuickViewOpen}
        onClose={() => dispatch({ type: 'CLOSE_QUICK_VIEW' })}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />

      {/* Mobile Bottom Navigation for screens smaller than md */}
      <MobileBottomNavigation />
    </>
  );
};

export default GlobalUI;