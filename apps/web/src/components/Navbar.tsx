'use client';
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShoppingCart, Leaf } from 'lucide-react';

export default function Navbar() {
  const { items } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    // eslint-disable-next-line
    setMounted(true); 
  }, []);

  const totalItems = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-[0_4px_30px_rgb(0,0,0,0.03)] sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-gradient-to-br from-[#4A7C59] to-[#2d5c3f] rounded-lg shadow-sm group-hover:shadow transition-all">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#2d5c3f]">AgriMart</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-[#4A7C59] transition-colors">Marketplace</Link>
          <Link href="/categories" className="hover:text-[#4A7C59] transition-colors">Categories</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            id="nav-cart"
            href="/cart"
            className="relative p-2 rounded-lg hover:bg-gray-100/80 transition-colors hidden md:block"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600" strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4A7C59] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {mounted && isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.roles?.includes('SuperAdmin') && (
                <Link href="/dashboard/admin" className="text-sm font-bold text-red-600 hover:text-red-800 hidden md:block">Admin Panel</Link>
              )}
              {user?.roles?.includes('Farmer') && (
                <Link href="/dashboard/farmer" className="text-sm font-bold text-[#4A7C59] hover:text-[#3a6347] hidden md:block">Farmer Portal</Link>
              )}
              <Link href="/wishlist" className="text-sm font-semibold text-gray-600 hover:text-[#4A7C59] hidden md:block">Wishlist</Link>
              <Link href="/orders" className="text-sm font-semibold text-gray-600 hover:text-[#4A7C59] hidden md:block">Orders</Link>
              <Link href="/profile" className="text-sm font-semibold text-gray-600 hover:text-[#4A7C59] hidden md:block">Profile</Link>
              <span className="text-sm text-gray-300 hidden md:block">|</span>
              <span className="text-xs md:text-sm text-gray-600 font-medium">Hi, {user?.email?.split('@')[0]}</span>
              <button
                onClick={() => { logout(); router.push('/login'); }}
                className="text-xs md:text-sm text-[#6D4C41] font-semibold bg-red-50 md:bg-transparent px-3 py-1.5 md:p-0 rounded-lg hover:underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                id="nav-login"
                href="/login"
                className="text-xs md:text-sm font-semibold text-[#4A7C59] hover:underline"
              >
                Sign In
              </Link>
              <Link
                id="nav-register"
                href="/register"
                className="text-xs md:text-sm bg-[#4A7C59] text-white font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-[#3a6347] transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
