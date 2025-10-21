'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import TermsAndConditionsPopup from '@/components/TermsAndConditionsPopup';

interface FormData {
  name: string;
  email?: string;
  contact: string;
  address: string;
  deliveryMethod: string;
}

const steps = [
  { id: 'shipping', name: 'Shipping', icon: FaUser },
  { id: 'payment', name: 'Payment', icon: FaCreditCard },
  { id: 'confirm', name: 'Confirmation', icon: FaCheckCircle },
];

export default function CheckoutPage() {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const { cartItems, couponCode, discountPercentage } = state;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '', // Initialize email field to prevent uncontrolled input error
    contact: '',
    address: '',
    deliveryMethod: 'cash-on-delivery'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercentage || 0);
  const grandTotal = subtotal - discountAmount;

  // Bangladesh mobile number validation function
  const validateBangladeshMobile = (contact: string): boolean => {
    // Remove any spaces, hyphens, or parentheses
    const cleanedContact = contact.replace(/[\s\-\(\)]/g, '');
    
    // Check if it starts with +880 and has 11 digits after (+880)
    if (cleanedContact.startsWith('+880') && cleanedContact.length === 14) {
      const number = cleanedContact.substring(4); // Remove +880 prefix
      // Check if it's a valid Bangladeshi number pattern
      return /^(1[3-9]\d{8}|7\d{8}|8\d{8}|9\d{8})$/.test(number);
    }
    
    // Check if it starts with 880 and has 13 digits
    if (cleanedContact.startsWith('880') && cleanedContact.length === 13) {
      const number = cleanedContact.substring(3); // Remove 880 prefix
      return /^(1[3-9]\d{8}|7\d{8}|8\d{8}|9\d{8})$/.test(number);
    }
    
    // Check if it's a 11 digit number starting with 01 (no country code)
    if (cleanedContact.startsWith('01') && cleanedContact.length === 11) {
      return /^(01[3-9]\d{8})$/.test(cleanedContact);
    }
    
    // Check if it's just the number without country code (11 digits starting with 1[3-9])
    if (cleanedContact.length === 10 && /^1[3-9]\d{8}$/.test(cleanedContact)) {
      return true;
    }
    
    return false;
  };

  // Address validation function
  const validateAddress = (address: string): boolean => {
    // Check if address is at least 25 characters
    if (address.length < 25) {
      return false;
    }
    
    // Count the number of words (split by spaces, tabs, or newlines)
    const words = address.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length < 3) {
      return false;
    }
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'contact') {
      const isValid = validateBangladeshMobile(value);
      if (!isValid && value !== '') {
        setContactError('Please enter a valid Bangladesh mobile number (e.g., +880 1XXX-XXXXXX, 01XXX-XXXXXX, or 1XXX-XXXXXX)');
      } else {
        setContactError(null);
      }
    } else if (name === 'address') {
      const isValid = validateAddress(value);
      if (!isValid && value !== '') {
        setAddressError('Address must be at least 25 characters and contain at least 3 words');
      } else {
        setAddressError(null);
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const form = document.getElementById('shipping-form') as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    // Validate contact number before allowing next step
    if (!validateBangladeshMobile(formData.contact)) {
      setContactError('Please enter a valid Bangladesh mobile number (e.g., +880 1XXX-XXXXXX, 01XXX-XXXXXX, or 1XXX-XXXXXX)');
      return;
    }
    
    // Validate address before allowing next step
    if (!validateAddress(formData.address)) {
      setAddressError('Address must be at least 25 characters and contain at least 3 words');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTermsAccepted) {
      alert('Please accept the Terms & Conditions to proceed.');
      return;
    }
    setIsLoading(true);

    // Format date in Dhaka timezone with AM/PM format
    const now = new Date();
    const dhakaTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true  // Use AM/PM format
    }).format(now);

    const orderData = {
      orderId: `ORD-${Date.now()}`,
      customer: formData,
      items: cartItems,
      subtotal,
      discountAmount,
      couponCode,
      total: grandTotal,
      date: dhakaTime
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem(`order_${orderData.orderId}`, JSON.stringify(orderData));
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        cartItems.forEach(item => {
          dispatch({ type: 'REMOVE_FROM_CART', id: item.id });
        });
        dispatch({ type: 'REMOVE_COUPON' });

        router.push(`/order-confirmation?orderId=${orderData.orderId}`);
      } else {
        alert(`Order failed: ${result.error || 'Unknown error'}. Please contact support.`);
      }
    } catch (error) {
      alert(`An error occurred: ${(error as Error).message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-block hover:underline">
            <h1 className="text-4xl font-extrabold text-gray-900">Checkout</h1>
          </Link>
          <p className="mt-2 text-lg text-gray-600">Complete your purchase in a few simple steps.</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index === currentStep ? 'bg-blue-600 text-white scale-110' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p className={`mt-2 font-semibold ${index === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Steps */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <ShippingStep formData={formData} handleChange={handleChange} contactError={contactError} addressError={addressError} />}
                {currentStep === 1 && <PaymentStep formData={formData} handleChange={handleChange} />}
                {currentStep === 2 && <ConfirmationStep 
                  formData={formData} 
                  subtotal={subtotal} 
                  discountAmount={discountAmount} 
                  total={grandTotal} 
                  isTermsAccepted={isTermsAccepted}
                  setIsTermsAccepted={setIsTermsAccepted}
                  setIsPopupOpen={setIsPopupOpen}
                />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 0 && (
                <button onClick={handlePrev} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  Back
                </button>
              )}
              <div className="flex-grow"></div>
              {currentStep < steps.length - 1 && (
                <button onClick={handleNext} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Next
                </button>
              )}
              {currentStep === steps.length - 1 && (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || cartItems.length === 0 || !isTermsAccepted}
                  className={`w-full max-w-xs ml-auto py-3 px-6 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                    isLoading || cartItems.length === 0 || !isTermsAccepted
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
                  }`}
                >
                  {isLoading ? 'Processing...' : `Place Order - ৳${grandTotal.toFixed(2)}`}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map(item => {
                  // Create a unique key that includes product id, size, and color options
                  const uniqueKey = item.selectedOptions 
                    ? `${item.id}-${item.selectedOptions.size || 'default'}-${item.selectedOptions.color || 'default'}` 
                    : item.id;
                  return (
                    <div key={uniqueKey} className="flex items-center py-4 border-b border-gray-200">
                      <div className="w-16 h-16 flex-shrink-0">
                        <Image 
                          src={item.images?.[0] || ''} 
                          alt={item.name} 
                          width={64} 
                          height={64} 
                          className="object-contain w-full h-full" 
                        />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <Link href={`/product/${item.category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized'}/${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^w-]/g, '')}-${item.id}`} className="hover:underline block">
                          <p className="font-semibold text-gray-900 truncate cursor-pointer">{item.name}</p>
                        </Link>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="font-semibold text-blue-600">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        {item.selectedOptions && (item.selectedOptions.size || item.selectedOptions.color) && (
                          <div className="mt-1 text-xs text-gray-600">
                            {item.selectedOptions.size && <span>Size: {item.selectedOptions.size} </span>}
                            {item.selectedOptions.color && <span>Color: {item.selectedOptions.color}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponCode})</span>
                    <span>-৳{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>৳{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPopupOpen && <TermsAndConditionsPopup onClose={() => setIsPopupOpen(false)} />}
    </div>
  );
}

// Step Components
const ShippingStep = ({ formData, handleChange, contactError, addressError }: { formData: FormData, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, contactError: string | null, addressError: string | null }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
    <form id="shipping-form" className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Md. Mehadi Hasan" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
        <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} required className={`w-full px-4 py-3 border ${contactError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="(+880) 1330-414242" />
        {contactError && <p className="mt-1 text-sm text-red-600">{contactError}</p>}
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address <span className="text-red-500">*</span></label>
        <textarea 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          required 
          rows={3} 
          className={`w-full px-4 py-3 border ${addressError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} 
          placeholder="123 Main St, City, Country" 
        />
        {addressError && <p className="mt-1 text-sm text-red-600">{addressError}</p>}
      </div>
    </form>
  </div>
);

const PaymentStep = ({ formData, handleChange }: { formData: FormData, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
    <div className="space-y-4">
      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
        <input type="radio" name="deliveryMethod" value="cash-on-delivery" checked={formData.deliveryMethod === 'cash-on-delivery'} onChange={handleChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
        <span className="ml-4">
          <p className="font-semibold">Cash on Delivery</p>
          <p className="text-sm text-gray-500">Pay with cash upon delivery.</p>
        </span>
      </label>
      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-100">
        <input type="radio" name="deliveryMethod" value="standard-delivery" checked={formData.deliveryMethod === 'standard-delivery'} onChange={handleChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" disabled />
        <span className="ml-4">
          <p className="font-semibold text-gray-500">Credit Card (Coming Soon)</p>
          <p className="text-sm text-gray-400">Pay with your credit card.</p>
        </span>
      </label>
    </div>
  </div>
);

const ConfirmationStep = ({ 
  formData, 
  subtotal, 
  discountAmount, 
  total, 
  isTermsAccepted,
  setIsTermsAccepted,
  setIsPopupOpen
}: { 
  formData: FormData, 
  subtotal: number, 
  discountAmount: number, 
  total: number,
  isTermsAccepted: boolean,
  setIsTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>,
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Order</h2>
    <div className="space-y-4 bg-gray-100 p-6 rounded-lg">
      <div>
        <h3 className="font-semibold">Shipping Details:</h3>
        <p>Full Name: {formData.name}</p>
        {formData.email && <p>Email: {formData.email}</p>}
        <p>Contact Number: {formData.contact}</p>
        <p>Delivery Address: {formData.address}</p>
      </div>
      <div>
        <h3 className="font-semibold">Payment Method:</h3>
        <p>{formData.deliveryMethod === 'cash-on-delivery' ? 'Cash on Delivery' : 'Standard Delivery'}</p>
      </div>
      <div className="border-t pt-4 mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>৳{subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-৳{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-xl">
          <span>Total</span>
          <span>৳{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
    <div className="mt-6">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={isTermsAccepted}
          onChange={() => setIsTermsAccepted(!isTermsAccepted)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span className="ml-2 text-sm text-gray-600">
          I have read and agree to the{' '}
          <button
            type="button"
            onClick={() => setIsPopupOpen(true)}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Terms & Conditions
          </button>
        </span>
      </label>
    </div>
  </div>
);
