'use client';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductImage from '@/components/ProductImage';

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { orders } = useOrderStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F9F6F0] pt-12 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4 text-gray-300">📦</div>
            <p className="text-gray-500 font-medium">No recent orders found.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center text-sm">
                <div className="flex gap-8">
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Order Placed</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Total</p>
                    <p className="text-gray-900 font-medium">₹{order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Payment</p>
                    <p className="text-gray-900 font-medium">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Order #</p>
                  <p className="text-gray-900 font-medium">{order.id}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${order.paymentMethod === 'cod' ? 'text-blue-700' : 'text-green-700'}`}>
                  {order.paymentMethod === 'cod' ? (
                    <><span className="text-2xl">⏳</span> Preparing for Delivery (COD)</>
                  ) : (
                    <><span className="text-2xl">✓</span> {order.status}</>
                  )}
                </h3>
                
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center text-4xl border border-gray-200 overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl">🌾</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity} | ₹{item.price.toFixed(2)} each</p>
                        <div className="mt-4 flex gap-3">
                          <button className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-colors">
                            Buy it again
                          </button>
                          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-colors">
                            Track package
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
