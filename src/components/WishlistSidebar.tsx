import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import { Product } from '@/context/AppContext';

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveItem: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

const WishlistSidebar = ({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  onRemoveItem,
  onAddToCart
}: WishlistSidebarProps) => {
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Wishlist</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close wishlist"
          >
            <FaTimes />
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
            <p className="text-gray-400">Add some items to your wishlist</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-gray-200">
                  <div className="w-16 h-16">
                    <Image 
                      src={item.images?.[0] || "/api/placeholder/80/80"} 
                      alt={item.name} 
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-blue-600 font-semibold">${item.price.toFixed(2)}</p>
                    
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => onAddToCart(item)}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                      >
                        <FaShoppingCart className="mr-1 text-xs" />
                        Add to Cart
                      </button>
                      
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistSidebar;