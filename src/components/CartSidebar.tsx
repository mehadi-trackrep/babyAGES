import { FaTimes, FaTrash, FaShoppingCart, FaArrowRight, FaBroom } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/context/AppContext';
import { useEffect, useRef } from 'react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: number, selectedOptions?: { size?: string; color?: string }) => void;
  onUpdateQuantity: (id: number, quantity: number, selectedOptions?: { size?: string; color?: string }) => void;
  onCheckout: () => void;
  onViewCart: () => void;
}

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity,
  onCheckout,
  onViewCart
}: CartSidebarProps) => {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            {cartItems.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your entire cart?')) {
                    cartItems.forEach(item => onRemoveItem(item.id, item.selectedOptions));
                  }
                }}
                className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                aria-label="Clear cart"
              >
                <FaBroom /> <span>Clear Cart</span>
              </button>
            )}

          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close cart"
          >
            <FaTimes />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <p className="text-gray-400">Add some items to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-gray-200">
                  <div className="w-16 h-16 mr-4">
                    <Image 
                      src={item.images[0] || "/api/placeholder/80/80"} 
                      alt={item.name} 
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${item.category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized'}/${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${item.id}`} className="hover:underline">
                      <h3 className="font-medium cursor-pointer">{item.name}</h3>
                    </Link>
                    <p className="text-blue-600 font-semibold">৳{item.price.toFixed(2)}</p>
                    {item.selectedOptions && (item.selectedOptions.size || item.selectedOptions.color) && (
                      <div className="mt-1 text-xs text-gray-600">
                        {item.selectedOptions.size && <span>Size: {item.selectedOptions.size} </span>}
                        {item.selectedOptions.color && <span>Color: {item.selectedOptions.color}</span>}
                      </div>
                    )}
                    
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedOptions)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l"
                      >
                        -
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.selectedOptions)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r"
                      >
                        +
                      </button>
                      
                      <button 
                        onClick={() => onRemoveItem(item.id, item.selectedOptions)}
                        className="ml-4 text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total:</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={onViewCart}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 rounded-lg font-medium"
                >
                  <FaShoppingCart className="mr-2" />
                  View Cart
                </button>
                
                <button
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                >
                  Checkout
                  <FaArrowRight className="ml-2" />
                </button>
                
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;