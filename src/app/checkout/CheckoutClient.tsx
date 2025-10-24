'use client';

import React, { useState, useEffect } from 'react';
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
  address: string; // Combined address for storage
  district: string;
  town: string;
  postcode: string;
  street: string;
  deliveryMethod: string;
  courierCost: string; // Inside Dhaka/Outside Dhaka
}

const CHECKOUT_STORAGE_KEY = 'checkout_form_data';

const steps = [
  { id: 'shipping', name: 'Shipping', icon: FaUser },
  { id: 'payment', name: 'Payment', icon: FaCreditCard },
  { id: 'confirm', name: 'Confirmation', icon: FaCheckCircle },
];

export default function CheckoutClient() {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const { cartItems, couponCode, discountPercentage } = state;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '', // Initialize email field to prevent uncontrolled input error
    contact: '',
    address: '', // Combined address
    district: '',
    town: '',
    postcode: '',
    street: '',
    deliveryMethod: 'cash-on-delivery',
    courierCost: 'inside-dhaka' // Default to inside Dhaka
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load form data from localStorage on component mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
        } catch (error) {
          console.error('Error parsing saved checkout data:', error);
        }
      }
    }
    setIsHydrated(true);
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined' && isHydrated) {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isHydrated]);

  // Clear saved form data on successful order submission
  useEffect(() => {
    return () => {
      // This cleanup happens when the component unmounts
      // We'll clear the data only after successful order
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (((item.priceAfterDiscount !== undefined && item.priceAfterDiscount > 0) ? item.priceAfterDiscount : item.price) * item.quantity), 0);
  const discountAmount = subtotal * (discountPercentage || 0);
  const courierCost = formData.courierCost === 'inside-dhaka' ? 60 : 120;
  const grandTotal = (subtotal - discountAmount) + courierCost;

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

  // Bangladesh-specific address validation function
  const validateAddressComponents = (district: string, town: string, street: string): boolean => {
    // All required fields must be filled
    if (!district || !town || !street) {
      return false;
    }
    
    // Check if all required fields have at least 2 characters
    if (district.length < 2 || town.length < 2 || street.length < 2) {
      return false;
    }
    
    return true;
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    // Basic email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    } else if (name === 'email') {
      // Only validate if email is not empty
      if (value !== '' && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null);
      }
    }
    
    // Update form data
    const updatedFormData = { ...formData, [name]: value };
    
    // If any address component field changes, update the combined address
    if (['district', 'town', 'postcode', 'street'].includes(name)) {
      // Combine address components into a single string
      const addressComponents = [
        updatedFormData.street,
        updatedFormData.town,
        updatedFormData.district,
        updatedFormData.postcode ? updatedFormData.postcode : null
      ].filter(Boolean); // Remove null/empty values
      
      updatedFormData.address = addressComponents.join(', ');
    }
    
    setFormData(updatedFormData);
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
    
    // Validate address components before allowing next step
    if (!validateAddressComponents(formData.district, formData.town, formData.street)) {
      alert('Please fill in all required address fields (District, Town/City, and Street/Village)');
      return;
    }
    
    // Validate email if provided
    if (formData.email && formData.email !== '' && !validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
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
      courierCost: formData.courierCost === 'inside-dhaka' ? 60 : 120,
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

        // Clear saved checkout form data after successful order
        localStorage.removeItem(CHECKOUT_STORAGE_KEY);

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

  // Don't render until form data is hydrated from localStorage
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 mt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading checkout form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-block hover:underline">
            <h1 className="text-4xl font-extrabold text-indigo-600">Checkout</h1>
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
                {currentStep === 0 && <ShippingStep formData={formData} handleChange={handleChange} contactError={contactError} emailError={emailError} />}
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
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Order Summary</h2>
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
                        <Link href={`/product/${item.category?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized'}/${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\\w-]/g, '')}-${item.id}`} onClick={() => dispatch({ type: 'SET_LOADING', isLoading: true, message: 'Loading product details...' })} className="hover:underline block">
                          <p className="font-semibold text-gray-900 truncate cursor-pointer">{item.name}</p>
                        </Link>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="font-semibold text-blue-600">
                            ৳{(((item.priceAfterDiscount !== undefined && item.priceAfterDiscount > 0) ? item.priceAfterDiscount : item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        {item.selectedOptions && (item.selectedOptions.size || item.selectedOptions.color) && (
                          <div className="mt-1 text-xs text-gray-600">
                            {item.selectedOptions.size && <span><span className="font-bold">Size:</span> {item.selectedOptions.size} </span>}
                            {item.selectedOptions.color && <span><span className="font-bold">Color:</span> {item.selectedOptions.color}</span>}
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
                <div className="flex justify-between">
                  <span>Courier Cost</span>
                  <span>৳{formData.courierCost === 'inside-dhaka' ? 60 : 120}</span>
                </div>
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
const ShippingStep = ({ formData, handleChange, contactError, emailError }: { formData: FormData, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void, contactError: string | null, emailError: string | null }) => {
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  
const districts = [
  { value: 'Bagerhat', label: 'Bagerhat' },
  { value: 'Bandarban', label: 'Bandarban' },
  { value: 'Barguna', label: 'Barguna' },
  { value: 'Barishal', label: 'Barishal' },
  { value: 'Bhola', label: 'Bhola' },
  { value: 'Bogura', label: 'Bogura' },
  { value: 'Brahmanbaria', label: 'Brahmanbaria' },
  { value: 'Chandpur', label: 'Chandpur' },
  { value: 'Chapai Nawabganj', label: 'Chapai Nawabganj' },
  { value: 'Chattogram', label: 'Chattogram' },
  { value: 'Chuadanga', label: 'Chuadanga' },
  { value: 'Cumilla', label: 'Cumilla' },
  { value: 'Coxs Bazar', label: 'Coxs Bazar' },
  { value: 'Dhaka', label: 'Dhaka' },
  { value: 'Dinajpur', label: 'Dinajpur' },
  { value: 'Faridpur', label: 'Faridpur' },
  { value: 'Feni', label: 'Feni' },
  { value: 'Gaibandha', label: 'Gaibandha' },
  { value: 'Gazipur', label: 'Gazipur' },
  { value: 'Gopalganj', label: 'Gopalganj' },
  { value: 'Habiganj', label: 'Habiganj' },
  { value: 'Jamalpur', label: 'Jamalpur' },
  { value: 'Jashore', label: 'Jashore' },
  { value: 'Jhalakathi', label: 'Jhalakathi' },
  { value: 'Jhenaidah', label: 'Jhenaidah' },
  { value: 'Joypurhat', label: 'Joypurhat' },
  { value: 'Khagrachhari', label: 'Khagrachhari' },
  { value: 'Khulna', label: 'Khulna' },
  { value: 'Kishoreganj', label: 'Kishoreganj' },
  { value: 'Kurigram', label: 'Kurigram' },
  { value: 'Kushtia', label: 'Kushtia' },
  { value: 'Lakshmipur', label: 'Lakshmipur' },
  { value: 'Lalmonirhat', label: 'Lalmonirhat' },
  { value: 'Madaripur', label: 'Madaripur' },
  { value: 'Magura', label: 'Magura' },
  { value: 'Manikganj', label: 'Manikganj' },
  { value: 'Meherpur', label: 'Meherpur' },
  { value: 'Moulvibazar', label: 'Moulvibazar' },
  { value: 'Munshiganj', label: 'Munshiganj' },
  { value: 'Mymensingh', label: 'Mymensingh' },
  { value: 'Naogaon', label: 'Naogaon' },
  { value: 'Narail', label: 'Narail' },
  { value: 'Narayanganj', label: 'Narayanganj' },
  { value: 'Narsingdi', label: 'Narsingdi' },
  { value: 'Natore', label: 'Natore' },
  { value: 'Netrokona', label: 'Netrokona' },
  { value: 'Nilphamari', label: 'Nilphamari' },
  { value: 'Noakhali', label: 'Noakhali' },
  { value: 'Pabna', label: 'Pabna' },
  { value: 'Panchagarh', label: 'Panchagarh' },
  { value: 'Patuakhali', label: 'Patuakhali' },
  { value: 'Pirojpur', label: 'Pirojpur' },
  { value: 'Rajbari', label: 'Rajbari' },
  { value: 'Rajshahi', label: 'Rajshahi' },
  { value: 'Rangamati', label: 'Rangamati' },
  { value: 'Rangpur', label: 'Rangpur' },
  { value: 'Satkhira', label: 'Satkhira' },
  { value: 'Shariatpur', label: 'Shariatpur' },
  { value: 'Sherpur', label: 'Sherpur' },
  { value: 'Sirajganj', label: 'Sirajganj' },
  { value: 'Sunamganj', label: 'Sunamganj' },
  { value: 'Sylhet', label: 'Sylhet' },
  { value: 'Tangail', label: 'Tangail' },
  { value: 'Thakurgaon', label: 'Thakurgaon' }
];

  
  const filteredDistricts = districts.filter(district => 
    district.label.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const handleDistrictChange = (value: string) => {
    // Create a synthetic event to match the expected handleChange function signature
    const event = {
      target: {
        name: 'district',
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    
    handleChange(event);
    setShowDistrictDropdown(false);
    setDistrictSearch('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">Shipping Information</h2>
      <form id="shipping-form" className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Md. Mehadi Hasan" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className={`w-full px-4 py-3 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} 
            placeholder="you@example.com" 
          />
          {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
        </div>
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
          <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} required className={`w-full px-4 py-3 border ${contactError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} placeholder="(+880) 1330-414242" />
          {contactError && <p className="mt-1 text-sm text-red-600">{contactError}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                id="district"
                name="district"
                value={formData.district ? districts.find(d => d.value === formData.district)?.label || formData.district : districtSearch}
                onChange={(e) => {
                  setDistrictSearch(e.target.value);
                  setShowDistrictDropdown(true);
                }}
                onClick={() => setShowDistrictDropdown(true)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search District"
              />
              <div className={`absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${showDistrictDropdown ? 'block' : 'hidden'}`}>
                {filteredDistricts.map((district) => (
                  <div
                    key={district.value}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDistrictChange(district.value)}
                  >
                    {district.label}
                  </div>
                ))}
                {filteredDistricts.length === 0 && districtSearch && (
                  <div className="px-4 py-2 text-gray-500">No districts found</div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">Town / City <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="town"
              name="town"
              value={formData.town}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Town / City"
            />
          </div>
        </div>
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street / Village <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Street / Village"
          />
        </div>
        <div>
          <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">Postcode / Union Parishad (Optional)</label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Postcode / Union Parishad (Optional)"
          />
        </div>
      </form>
    </div>
  );
};

const PaymentStep = ({ formData, handleChange }: { formData: FormData, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) => (
  <div>
    <h2 className="text-2xl font-bold text-indigo-600 mb-6">Payment Requirements</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
        <div className="space-y-4">
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
            <input type="radio" name="deliveryMethod" value="cash-on-delivery" checked={formData.deliveryMethod === 'cash-on-delivery'} onChange={handleChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
            <span className="ml-4">
              <p className="font-semibold">Cash on Delivery(COD)</p>
              <p className="text-sm text-gray-500">Pay with cash upon delivery.</p>
            </span>
          </label>
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-not-allowed bg-gray-100">
            <input type="radio" name="deliveryMethod" value="standard-delivery" checked={formData.deliveryMethod === 'standard-delivery'} onChange={handleChange} className="h-5 w-5 text-blue-600 focus:ring-blue-500" disabled />
            <span className="ml-4">
              <p className="font-semibold text-gray-500">Visa Card, Bkash, Nagad (Coming Soon)</p>
              <p className="text-sm text-gray-400">Pay with your visa card.</p>
            </span>
          </label>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Courier Option</h3>
        <div className="space-y-4">
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
            <input 
              type="radio" 
              name="courierCost" 
              value="inside-dhaka" 
              checked={formData.courierCost === 'inside-dhaka'} 
              onChange={handleChange} 
              className="h-5 w-5 text-blue-600 focus:ring-blue-500" 
            />
            <span className="ml-4 flex-1">
              <div className="flex justify-between">
                <p className="font-semibold">Inside Dhaka City</p>
                <p className="font-semibold text-blue-600">৳60</p>
              </div>
              <p className="text-sm text-gray-500">Courier cost within Dhaka city</p>
            </span>
          </label>
          <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
            <input 
              type="radio" 
              name="courierCost" 
              value="outside-dhaka" 
              checked={formData.courierCost === 'outside-dhaka'} 
              onChange={handleChange} 
              className="h-5 w-5 text-blue-600 focus:ring-blue-500" 
            />
            <span className="ml-4 flex-1">
              <div className="flex justify-between">
                <p className="font-semibold">Outside Dhaka City</p>
                <p className="font-semibold text-blue-600">৳120</p>
              </div>
              <p className="text-sm text-gray-500">Courier cost outside Dhaka city</p>
            </span>
          </label>
        </div>
      </div>
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
}) => {
  const courierCost = formData.courierCost === 'inside-dhaka' ? 60 : 120;
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">Confirm Your Order</h2>
      <div className="space-y-4 bg-gray-100 p-6 rounded-lg">
        <div>
          <h3 className="font-semibold">Shipping Details:</h3>
          <p>Full Name: {formData.name}</p>
          {formData.email && <p>Email: {formData.email}</p>}
          <p>Contact Number: {formData.contact}</p>
          <p>Delivery Address: {formData.address}</p>
          <p>District: {formData.district}</p>
          <p>Town/City: {formData.town}</p>
          <p>Street/Village: {formData.street}</p>
          {formData.postcode && <p>Postcode/Union Parishad: {formData.postcode}</p>}
        </div>
        <div>
          <h3 className="font-semibold">Payment & Delivery:</h3>
          <p>Payment Method: {formData.deliveryMethod === 'cash-on-delivery' ? 'Cash on Delivery' : 'Standard Delivery'}</p>
          <p>Courier Option: {formData.courierCost === 'inside-dhaka' ? 'Inside Dhaka City' : 'Outside Dhaka City'}</p>
          <p>Courier Cost: ৳{courierCost}</p>
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
          <div className="flex justify-between">
            <span>Courier Cost</span>
            <span>৳{courierCost}</span>
          </div>
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
};