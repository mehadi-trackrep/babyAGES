'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  contact: string;
  address: string;
  deliveryMethod: string;
}

export default function CheckoutPage() {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    address: '',
    deliveryMethod: 'cash-on-delivery'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Calculate total price
    const totalPrice = state.cartItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    // Prepare order data
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      customer: {
        name: formData.name,
        contact: formData.contact,
        address: formData.address,
        deliveryMethod: formData.deliveryMethod
      },
      items: state.cartItems,
      total: totalPrice,
      date: new Date().toISOString()
    };

    try {
      // Call the API endpoint to save order to Google Sheets
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // Store order data in sessionStorage for the confirmation page
        sessionStorage.setItem(`order_${orderData.orderId}`, JSON.stringify(orderData));
        
        // Also store in localStorage as backup
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        state.cartItems.forEach(item => {
          dispatch({ type: 'REMOVE_FROM_CART', id: item.id });
        });

        // Redirect to order confirmation page
        router.push(`/order-confirmation?orderId=${orderData.orderId}`);
      } else {
        // Handle Google Sheets save failure with a more specific message
        alert(`Order was processed but failed to save to our records: ${result.error || 'Unknown error'}. Please contact support with your order ID: ${orderData.orderId}`);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      
      // Show user-friendly error message for Google Sheets failure
      alert(`There was an error saving your order to our records: ${error.message || 'Please try again'}. Your payment may have been processed. Please contact support with the order ID for verification.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total
  const total = state.cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {state.cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <div>
                <div className="space-y-4">
                  {state.cartItems.map((item) => (
                    <div key={item.id} className="flex items-center py-3 border-b border-gray-200">
                      <img 
                        src={item.image || "/api/placeholder/80/80"} 
                        alt={item.name} 
                        className="w-16 h-16 object-contain mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <div className="text-lg font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (234) 567-8900"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Main St, City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="cash-on-delivery"
                        checked={formData.deliveryMethod === 'cash-on-delivery'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard-delivery"
                        checked={formData.deliveryMethod === 'standard-delivery'}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        disabled
                      />
                      <span className="ml-2 text-gray-500">Standard Delivery (Coming Soon)</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || state.cartItems.length === 0}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                    isLoading || state.cartItems.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}