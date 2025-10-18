'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTrashAlt, FaTicketAlt } from 'react-icons/fa';

export default function ViewCartPage() {
  const { state, dispatch } = useAppContext();
  const { cartItems, couponCode, discountPercentage } = state;
  const [couponInput, setCouponInput] = useState('');

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

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      dispatch({ type: 'APPLY_COUPON', couponCode: couponInput.trim() });
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountAmount = subtotal * (discountPercentage || 0);
  const grandTotal = subtotal - discountAmount;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900">Your Shopping Cart</h1>
          <p className="mt-2 text-lg text-gray-600">Review your items and proceed to checkout.</p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-white rounded-2xl shadow-lg"
          >
            <p className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</p>
            <Link 
              href="/shop" 
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Items</h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-200 pb-6"
                  >
                    <div className="w-32 h-32 flex-shrink-0">
                      <Image 
                        src={item.images?.[0] || "/api/placeholder/128/128"} 
                        alt={item.name} 
                        width={128}
                        height={128}
                        className="object-cover rounded-lg shadow-md"
                      />
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-gray-500">৳{item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-xl font-bold text-blue-600">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-full">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-full"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 border-x border-gray-300 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-full"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
                        >
                          <FaTrashAlt /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                {/* Coupon Code Input */}
                <form className="mb-6" onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(); }}>
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      id="coupon"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter FIRST20"
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-custom-blue"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-custom-blue text-white font-semibold rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-blue"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({couponCode})</span>
                      <span>-৳{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {couponCode && (
                  <div className="mt-4 text-center">
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove Coupon
                    </button>
                  </div>
                )}

                <div className="mt-8">
                  <Link
                    href="/checkout"
                    className="w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Proceed to Checkout
                  </Link>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href="/shop"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
