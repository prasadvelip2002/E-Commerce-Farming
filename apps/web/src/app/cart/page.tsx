'use client';
import { useCartStore } from '../../store/cartStore';
import { Button } from '@agri/shared-ui';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-8 font-medium">Loading cart...</div>;

  return (
    <div className="min-h-screen bg-[#F9F6F0] pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 font-medium hidden sm:block">Price</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your AgriMart Cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any fresh farm produce to your cart yet. Discover organic vegetables, fruits, and grains directly from farmers.
            </p>
            <Link href="/">
              <Button variant="primary" className="px-8 py-3 text-lg shadow-lg shadow-green-900/20">Shop Today's Harvest</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column - Cart Items */}
            <div className="w-full lg:w-3/4 space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
                  {/* Image Placeholder */}
                  <div className="w-full sm:w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">🌾</span>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-green-700 font-semibold mt-1">In Stock</p>
                        <p className="text-xs text-gray-500 mt-1">Sold by: Verified Farmer Partner</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button 
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-r border-gray-300 transition-colors"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        >−</button>
                        <span className="px-6 py-2 font-semibold text-gray-900 w-12 text-center">{item.quantity}</span>
                        <button 
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-l border-gray-300 transition-colors"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >+</button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm tracking-wide"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-right pr-4">
                <p className="text-lg text-gray-900">Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items): <span className="font-bold text-2xl">₹{getTotal().toFixed(2)}</span></p>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-2">
                    <span className="text-lg">✓</span> Your order is eligible for secure delivery.
                  </div>
                  <h2 className="text-xl font-medium text-gray-900 leading-tight">
                    Subtotal: <span className="font-bold text-2xl block mt-1">₹{getTotal().toFixed(2)}</span>
                  </h2>
                </div>
                
                <Link href="/checkout" className="block w-full">
                  <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold py-3.5 rounded-xl transition-all text-sm shadow-sm">
                    Proceed to Buy
                  </button>
                </Link>
                
                <div className="mt-6 space-y-4">
                  <div className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-xl">🛡️</span>
                    <p className="text-xs font-semibold text-gray-600 leading-tight">AgriMart Buyer Protection<br/><span className="font-normal text-gray-500">Secure payments & fresh guarantee</span></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
