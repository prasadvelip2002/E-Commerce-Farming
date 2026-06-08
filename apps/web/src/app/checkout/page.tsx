'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldCheck, MapPin, CreditCard, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  useEffect(() => {
    setMounted(true);
    if (items.length === 0 && paymentStatus === 'idle') {
      router.push('/cart');
    }
  }, [items, router, paymentStatus]);

  if (!mounted) return null;

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    // Simulate a network delay for the payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPaymentStatus('success');
    
    // Show success checkmark for 1 second before redirecting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save order to frontend store
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    addOrder({
      id: orderId,
      date: new Date().toISOString(),
      total: getTotal(),
      items: [...items],
      status: 'Processing',
      paymentMethod: paymentMethod
    });

    // Save order to actual backend so Admin can see it
    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      await fetch(`http://${hostname}:5153/api/orders/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id || '00000000-0000-0000-0000-000000000000',
          shippingAddress: 'Dynamic Address', // Would be from form in real app
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });
    } catch (error) {
      console.error("Failed to post order to backend:", error);
    }
    
    clearCart();
    router.push(`/checkout/success?orderId=${orderId}&paymentMethod=${paymentMethod}`);
  };

  const total = getTotal();

  return (
    <div className="min-h-screen bg-[#F9F6F0] pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-bold tracking-tight">Secure Server</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form Steps */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Step 1: Address */}
            <div className={`bg-white rounded-2xl border ${step === 1 ? 'border-[#4A7C59] shadow-md ring-1 ring-[#4A7C59]' : 'border-gray-200 shadow-sm'} overflow-hidden transition-all`}>
              <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-[#4A7C59] text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
                  <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                </div>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-sm text-[#4A7C59] font-bold hover:underline">Edit</button>
                )}
              </div>
              
              <AnimatePresence>
                {step === 1 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input type="text" defaultValue={user?.email?.split('@')[0] || ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none" placeholder="+91 98765 43210" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 1</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none" placeholder="Flat / House No, Building Name" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">City / District</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none" placeholder="City" />
                      </div>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-sm"
                    >
                      Use this address
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 2: Payment */}
            <div className={`bg-white rounded-2xl border ${step === 2 ? 'border-[#4A7C59] shadow-md ring-1 ring-[#4A7C59]' : 'border-gray-200 shadow-sm'} overflow-hidden transition-all`}>
              <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-[#4A7C59] text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              
              <AnimatePresence>
                {step === 2 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-6"
                  >
                    <div className="space-y-4 mb-6">
                      
                      <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#4A7C59] bg-green-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 text-[#4A7C59] focus:ring-[#4A7C59]" />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">Credit / Debit Card</p>
                          <p className="text-xs text-gray-500">Secure payment powered by Razorpay</p>
                        </div>
                        <CreditCard className="w-6 h-6 text-gray-400" />
                      </label>

                      <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-[#4A7C59] bg-green-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 text-[#4A7C59] focus:ring-[#4A7C59]" />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">UPI (GPay, PhonePe, Paytm)</p>
                          <p className="text-xs text-gray-500">Instant transfer</p>
                        </div>
                      </label>

                      <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#4A7C59] bg-green-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-[#4A7C59] focus:ring-[#4A7C59]" />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">Cash on Delivery</p>
                          <p className="text-xs text-gray-500">Pay when you receive the fresh crops</p>
                        </div>
                      </label>
                      
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <input type="text" placeholder="Card Number" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none" />
                        </div>
                        <div>
                          <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none" />
                        </div>
                        <div>
                          <input type="text" placeholder="CVV" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#4A7C59] focus:outline-none" />
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => setStep(3)}
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-8 py-3 rounded-xl transition-colors shadow-sm"
                    >
                      Use this payment method
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items ({items.length}):</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>AgriMart Fee:</span>
                  <span>₹0.00</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold text-[#b12704]">
                  <span>Order Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                disabled={step !== 3 || paymentStatus !== 'idle'}
                onClick={handlePayment}
                className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                  step === 3 
                    ? 'bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Place Your Order
              </button>

              <div className="mt-4 flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                <ShieldCheck className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <p className="text-xs text-gray-500 leading-tight">
                  Safe and secure payments. 100% Authentic products guaranteed.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Processing Overlay */}
      <AnimatePresence>
        {paymentStatus !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4"
            >
              {paymentStatus === 'processing' ? (
                <>
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-[#4A7C59] rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {paymentMethod === 'cod' ? 'Confirming Order...' : 'Processing Payment...'}
                  </h3>
                  <p className="text-gray-500 text-sm text-center">Please do not close this window or hit back.</p>
                </>
              ) : (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircle className="w-20 h-20 text-[#4A7C59] mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {paymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Successful!'}
                  </h3>
                  <p className="text-gray-500 text-sm text-center">Redirecting to your order confirmation...</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
