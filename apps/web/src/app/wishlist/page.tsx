'use client';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import ProductImage from '@/components/ProductImage';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { items: wishlistItems, removeItem: removeWishlistItem } = useWishlistStore();
  const { addItem: addCartItem } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] pt-12 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">❤️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is currently empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Save items you love and buy them later. Explore the marketplace to find fresh organic produce.
            </p>
            <Link href="/">
              <Button variant="primary" className="px-8 py-3 text-lg shadow-lg shadow-green-900/20">Explore Marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <div
                key={product.productId}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 h-36 flex items-center justify-center text-6xl select-none relative overflow-hidden">
                  <ProductImage id={product.productId} name={product.name} category={product.category} />
                  
                  <button 
                    onClick={() => removeWishlistItem(product.productId)}
                    className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm text-red-500 fill-current"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{product.name}</h3>
                  <p className="text-xs text-[#6D4C41] font-medium mb-4">by {product.farmer}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-2xl font-bold text-[#4A7C59]">₹{product.price}</span>
                      <span className="text-gray-400 text-sm ml-1">/{product.unit}</span>
                    </div>
                    <button
                      onClick={() => addCartItem({ productId: product.productId, name: product.name, price: product.price, quantity: 1 })}
                      className="px-4 py-2 rounded-xl text-sm font-bold bg-[#4A7C59] hover:bg-[#3a6347] text-white transition-all hover:scale-105 shadow-sm"
                    >
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
