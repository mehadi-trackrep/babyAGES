'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Product } from '@/context/AppContext';

interface OrderItem extends Product {
  quantity: number;
}

interface OrderData {
  orderId: string;
  customer: {
    name: string;
    email?: string;
    contact: string;
    address: string;
    deliveryMethod: string;
  };
  items: OrderItem[];
  total: number;
  date: string;
}

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setIsLoading(false);
      return;
    }

    try {
      const storedOrder = sessionStorage.getItem(`order_${orderId}`);
      if (storedOrder) {
        setOrderData(JSON.parse(storedOrder));
      } else {
        const orders: OrderData[] = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = orders.find(order => order.orderId === orderId);
        if (foundOrder) {
          setOrderData(foundOrder);
        } else {
          setError('Order not found');
        }
      }
    } catch {
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  if (isLoading) {
    return <div className="text-center py-20">Loading order details...</div>;
  }

  if (error || !orderData) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-lg p-8">
        <FaExclamationCircle className="text-6xl text-red-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-8">{error || 'Could not retrieve order details'}</p>
        <Link href="/shop" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 mt-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-white rounded-2xl shadow-2xl p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 150 }}
          >
            <FaCheckCircle className="text-7xl text-green-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-8">Your order has been successfully placed.</p>
          
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-lg text-green-800 font-medium">
              শীঘ্রই আমাদের একজন কাস্টমার প্রতিনিধি আপনাকে ফোন দিয়ে অর্ডার কনফার্ম করবেন এবং ডেলিভারির পদক্ষেপ গ্রহণ করবেন।
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 text-left mb-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Order Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold">Order ID:</p>
                <p className="text-gray-700">{orderData.orderId}</p>
              </div>
              <div>
                <p className="font-semibold">Order Date:</p>
                <p className="text-gray-700">{orderData.date}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-semibold">Shipping Address:</p>
                <p className="text-gray-700">{orderData.customer.name}</p>
                {orderData.customer.email && <p className="text-gray-700">{orderData.customer.email}</p>}
                <p className="text-gray-700">{orderData.customer.contact}</p>
                <p className="text-gray-700">{orderData.customer.address}</p>
              </div>
              <div>
                <p className="font-semibold">Total Amount:</p>
                <p className="text-xl font-bold text-blue-600">৳{orderData.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="text-left mb-8">
            <h3 className="text-xl font-bold text-indigo-600 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {orderData.items.map(item => {
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
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-semibold text-blue-600">
                          ৳{(((item.priceAfterDiscount !== undefined && item.priceAfterDiscount > 0) ? item.priceAfterDiscount : item.price) * item.quantity).toFixed(2)}
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
          </div>

          <div className="mt-8">
            <Link href="/shop" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
