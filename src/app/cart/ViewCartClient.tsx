'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTrashAlt, FaBroom } from 'react-icons/fa';

export default function ViewCartClient() {
  const { state, dispatch } = useAppContext();
  const { cartItems, couponCode, discountPercentage, lastAction } = state;
  const [couponInput, setCouponInput] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const newSubtotal = cartItems.reduce(
      (total, item) => total + ((item.priceAfterDiscount !== undefined && item.priceAfterDiscount > 0) ? item.priceAfterDiscount : item.price) * item.quantity,
      0
    );
    const newDiscountAmount = newSubtotal * (discountPercentage || 0);
    const newGrandTotal = newSubtotal - newDiscountAmount;
    
    setSubtotal(newSubtotal);
    setDiscountAmount(newDiscountAmount);
    setGrandTotal(newGrandTotal);
  }, [cartItems, discountPercentage]);

  // This effect ensures the cart page updates when actions occur from other components (like wishlist)
  useEffect(() => {
    if (lastAction?.type === 'ADD_TO_CART') {
      // Force re-calculation when an item is added to cart from another component
      const newSubtotal = cartItems.reduce(
        (total, item) => total + ((item.priceAfterDiscount !== undefined && item.priceAfterDiscount > 0) ? item.priceAfterDiscount : item.price) * item.quantity,
        0
      );
      const newDiscountAmount = newSubtotal * (discountPercentage || 0);
      const newGrandTotal = newSubtotal - newDiscountAmount;
      
      setSubtotal(newSubtotal);
      setDiscountAmount(newDiscountAmount);
      setGrandTotal(newGrandTotal);
    }
  }, [lastAction, cartItems, discountPercentage]);

  const handleRemoveItem = (id: number, selectedOptions?: { size?: string; color?: string }) => {
    dispatch({ type: 'REMOVE_FROM_CART', id, selectedOptions });
  };

  const handleUpdateQuantity = (id: number, quantity: number, selectedOptions?: { size?: string; color?: string }) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', id, selectedOptions });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', id, quantity, selectedOptions });
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
          <Link href="/" className="inline-block hover:underline">
            <h1 className="text-4xl font-extrabold text-indigo-600">Your Shopping Cart</h1>
          </Link>
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-indigo-600">Your Items</h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your entire cart?')) {
                        dispatch({ type: 'CLEAR_CART' });
                      }
                    }}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                    aria-label="Clear cart"
                  >
                    <FaBroom /> <span>Clear Cart</span>
                  </button>
                )}
              </div>
              <div className="space-y-6 mt-6">
                {cartItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedOptions?.size || 'none'}-${item.selectedOptions?.color || 'none'}`} /* Use ID with size and color to uniquely identify variants */
                    variants={itemVariants}
                    initial="hidden" /* Initial state for animation */
                    animate="visible" /* Animate to visible state */
                    className="flex items-center py-4 border-b border-gray-200"
                  >
                    <div className="w-16 h-16 flex-shrink-0">
                      <Image 
                        src={item.images?.[0] || "/api/placeholder/80/80"} 
                        alt={item.name} 
                        width={64}
                        height={64}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 ml-4">
                      <Link href={`/product/${item.category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized'}/${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\\w-]/g, '')}-${item.id}`} onClick={() => dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Loading product details...' })} className="hover:underline block">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      </Link>
                      <p className="text-blue-600 font-semibold mt-1">৳{((item.priceAfterDiscount !== undefined && item.priceAfterDiscount > 0) ? item.priceAfterDiscount : item.price).toFixed(2)}</p>
                      {item.selectedOptions && (item.selectedOptions.size || item.selectedOptions.color) && (
                        <div className="mt-1 text-xs text-gray-600">
                          {item.selectedOptions.size && <span><span className="font-bold">Size:</span> {item.selectedOptions.size} </span>}
                          {item.selectedOptions.color && <span><span className="font-bold">Color:</span> {item.selectedOptions.color}</span>}
                        </div>
                      )}
                      
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.selectedOptions)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-lg font-medium rounded-l-md"
                        >
                          -
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center border-x border-gray-300 bg-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.selectedOptions)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-lg font-medium rounded-r-md"
                        >
                          +
                        </button>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id, item.selectedOptions)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          <FaTrashAlt />
                        </button>
                        
                        <p className="ml-auto font-bold text-blue-600">
                          ৳{(((item.priceAfterDiscount !== undefined && item.priceAfterDiscount > 0) ? item.priceAfterDiscount : item.price) * item.quantity).toFixed(2)}
                        </p>
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
                <h2 className="text-xl font-bold text-indigo-600 mb-4">Order Summary</h2>
                
                {/* Coupon Code Input */}
                <form className="mb-4" onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(); }}>
                  <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {couponCode ? (
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <input 
                          type="text" 
                          id="coupon"
                          value={couponCode} // Show applied coupon code
                          disabled // Disable input when coupon is applied
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-100"
                        />
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <input 
                            type="text" 
                            id="coupon"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Enter FIRST20"
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-blue"
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button 
                              type="submit"
                              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
                            >
                              Apply
                            </button>
                            <button
                              type="button"
                              onClick={() => { setCouponInput('FIRST20'); }}
                              className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 whitespace-nowrap text-sm"
                            >
                              Use FIRST20
                            </button>
                          </div>
                        </div>
                      </>
                    )}
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