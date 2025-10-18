'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTrashAlt } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-16">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900">Your Shopping Cart</h1>
          <p className="mt-2 text-lg text-gray-600">Review your items and proceed to checkout.</p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg"
          >
            <p className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</p>
            <Link 
              href="/shop" 
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 text-base"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {/* Cart Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Items</h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b border-gray-200 pb-4 sm:pb-6"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                      <Image 
                        src={item.images?.[0] || "/api/placeholder/128/128"} 
                        alt={item.name} 
                        width={128}
                        height={128}
                        className="object-cover rounded-lg shadow-md w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-1 w-full min-w-0"> {/* min-w-0 allows flex child to shrink below content size */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{item.name}</h3>
                          <p className="mt-1 text-gray-500">৳{item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-blue-600 self-end sm:self-auto">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                        <div className="flex items-center border border-gray-300 rounded-full w-fit">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-full text-sm sm:text-base"
                          >
                            -
                          </button>
                          <span className="px-3 py-2 border-x border-gray-300 font-medium text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-full text-sm sm:text-base"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm"
                        >
                          <FaTrashAlt /> <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Order Summary - now below cart items on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className=""
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
                {/* Coupon Code Input */}
                <form className="mb-4" onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(); }}>
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text" 
                      id="coupon"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter FIRST20"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-blue"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-custom-blue text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-blue whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                      <span>Discount ({couponCode})</span>
                      <span>-৳{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Packaging</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3 mt-6">
                  <Link
                    href="/checkout"
                    className="w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Proceed to Checkout
                  </Link>

                  {couponCode && (
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-xs sm:text-sm text-red-500 hover:underline"
                    >
                      Remove Coupon
                    </button>
                  )}

                  <Link
                    href="/shop"
                    className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
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
