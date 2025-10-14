'use client';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function ViewCartPage() {
  const { state, dispatch } = useAppContext();

  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', id });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
    }
  };

  const totalPrice = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

      {state.cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {state.cartItems.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start">
                <img 
                  src={item.image || "/api/placeholder/120/120"} 
                  alt={item.name} 
                  className="w-24 h-24 object-contain mr-6"
                />
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                    
                    <p className="mt-2 md:mt-0 text-lg font-semibold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      
                      <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between text-xl font-semibold mb-6">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Link
                href="/"
                className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium"
              >
                Continue Shopping
              </Link>
              
              <Link
                href="/checkout"
                className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}