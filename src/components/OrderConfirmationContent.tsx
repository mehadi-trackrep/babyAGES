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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Not Found</h2>
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-8">Your order has been successfully placed.</p>

          <div className="bg-gray-100 rounded-lg p-6 text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold">Order ID:</p>
                <p className="text-gray-700">{orderData.orderId}</p>
              </div>
              <div>
                <p className="font-semibold">Order Date:</p>
                <p className="text-gray-700">{new Date(orderData.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Customer:</p>
                <p className="text-gray-700">{orderData.customer.name}</p>
              </div>
              <div>
                <p className="font-semibold">Total Amount:</p>
                <p className="text-xl font-bold text-blue-600">${orderData.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="text-left mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {orderData.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <Image src={item.images?.[0] || ''} alt={item.name} width={64} height={64} className="rounded-md object-cover" />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
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
