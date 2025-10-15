import OrderConfirmationContent from '@/components/OrderConfirmationContent';
import { Suspense } from 'react';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-4 md:p-6 flex items-center justify-center h-64"><p className="text-xl">Loading order details...</p></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}