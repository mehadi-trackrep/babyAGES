import OrderConfirmationContent from '@/components/OrderConfirmationContent';
import { Suspense } from 'react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  images: string[];
  rating: number;
  videos?: string[];
  category: string;
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

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-4 md:p-6 flex items-center justify-center h-64"><p className="text-xl">Loading order details...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}