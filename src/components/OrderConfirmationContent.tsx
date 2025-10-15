'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setIsLoading(false);
        return;
      }

      try {
        // In a real application, you would fetch the actual order details from your backend
        // For now, we'll use session storage to retrieve the order data sent from checkout
        const storedOrder = sessionStorage.getItem(`order_${orderId}`);
        
        if (storedOrder) {
          const parsedOrder = JSON.parse(storedOrder);
          setOrderData(parsedOrder);
        } else {
          // Fallback: try to get from localStorage if sessionStorage fails
          const orders: OrderData[] = JSON.parse(localStorage.getItem('orders') || '[]');
          const foundOrder = orders.find((order: OrderData) => order.orderId === orderId);
          
          if (foundOrder) {
            setOrderData(foundOrder);
          } else {
            setError('Order not found');
          }
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 flex items-center justify-center h-64">
        <p className="text-xl">Loading order details...</p>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'Could not retrieve order details'}</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {orderData.orderId}</p>
              <p><span className="font-medium">Date:</span> {new Date(orderData.date).toLocaleString()}</p>
              <p><span className="font-medium">Status:</span> <span className="text-green-600">Confirmed</span></p>
              <p><span className="font-medium">Payment Method:</span> {orderData.customer.deliveryMethod}</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {orderData.customer.name}</p>
              <p><span className="font-medium">Contact:</span> {orderData.customer.contact}</p>
              <p><span className="font-medium">Address:</span> {orderData.customer.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {orderData.items.map((item) => (
            <div key={item.id} className="flex items-center py-3 border-b border-gray-200">
              <div className="w-16 h-16 mr-4">
                <Image 
                  src={item.images?.[0] || "/api/placeholder/80/80"} 
                  alt={item.name} 
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
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
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center text-xl font-semibold">
          <span>Total:</span>
          <span>${orderData.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">Your order has been confirmed and will be processed shortly.</p>
        <Link 
          href="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}