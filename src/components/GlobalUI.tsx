'use client';

import { useAppContext } from '@/context/AppContext';
import CartSidebar from '@/components/CartSidebar';
import WishlistSidebar from '@/components/WishlistSidebar';
import QuickViewModal from '@/components/QuickViewModal';
import { useRouter } from 'next/navigation';

// Global UI component that manages sidebars and modals across all pages
const GlobalUI = () => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();

  const handleRemoveFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', id });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };

  const handleRemoveFromWishlist = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', id });
  };

  const handleCartAddFromWishlist = (product: any) => {
    dispatch({ type: 'ADD_TO_CART', product });
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

  const handleAddToCart = (product: any) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleAddToWishlist = (product: any) => {
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
    </>
  );
};

export default GlobalUI;