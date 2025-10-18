'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';

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
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    address: '',
    deliveryMethod: 'cash-on-delivery'
  });
  const [isLoading, setIsLoading] = useState(false);

  const total = state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const form = document.getElementById('shipping-form') as HTMLFormElement;
    if (form && !form.checkValidity()) {
      form.reportValidity();
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
    setIsLoading(true);

    const orderData = {
      orderId: `ORD-${Date.now()}`,
      customer: formData,
      items: state.cartItems,
      total,
      date: new Date().toISOString()
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

        state.cartItems.forEach(item => {
          dispatch({ type: 'REMOVE_FROM_CART', id: item.id });
        });

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
          <h1 className="text-4xl font-extrabold text-gray-900">Checkout</h1>
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
                {currentStep === 0 && <ShippingStep formData={formData} handleChange={handleChange} />}
                {currentStep === 1 && <PaymentStep formData={formData} handleChange={handleChange} />}
                {currentStep === 2 && <ConfirmationStep formData={formData} total={total} />}
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
                  disabled={isLoading || state.cartItems.length === 0}
                  className={`w-full max-w-xs ml-auto py-3 px-6 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                    isLoading || state.cartItems.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
                  }`}
                >
                  {isLoading ? 'Processing...' : `Place Order - ৳${total.toFixed(2)}`}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4">
                {state.cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Image src={item.images?.[0] || ''} alt={item.name} width={64} height={64} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
const ShippingStep = ({ formData, handleChange }: { formData: FormData, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) => (
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
        <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(+880) 1330-414242" />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address <span className="text-red-500">*</span></label>
        <textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="123 Main St, City, Country" />
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

const ConfirmationStep = ({ formData, total }: { formData: FormData, total: number }) => (
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
      <div>
        <h3 className="font-semibold">Order Total:</h3>
        <p className="text-xl font-bold">৳{total.toFixed(2)}</p>
      </div>
    </div>
    <p className="mt-6 text-sm text-gray-600">By clicking &quot;Place Order&quot;, you agree to our Terms of Service and Privacy Policy.</p>
  </div>
);
