'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-UNKNOWN';
  const paymentMethod = searchParams.get('paymentMethod') || 'card';

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center p-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center relative overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-green-50 to-emerald-100 opacity-50"></div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-md mb-6"
          >
            <CheckCircle className="w-16 h-16 text-[#4A7C59]" strokeWidth={2.5} />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-8">Thank you for supporting our farmers. Your fresh produce will arrive soon.</p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="font-bold font-mono text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Date</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleDateString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Payment</span>
              {paymentMethod === 'cod' ? (
                <span className="font-bold text-gray-700">Cash on Delivery (Pending)</span>
              ) : (
                <span className="font-bold text-green-600">Paid successfully</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/orders" className="flex items-center justify-center gap-2 w-full bg-[#4A7C59] hover:bg-[#3a6347] text-white font-bold py-3.5 rounded-xl transition-all shadow-sm">
              <Package className="w-5 h-5" /> View Your Orders
            </Link>
            
            <Link href="/" className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all border border-gray-200">
              <ShoppingBag className="w-5 h-5" /> Continue Shopping
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
