'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Home, LayoutGrid, ShoppingCart, Package, User, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: <LayoutGrid className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
    },
    {
      name: 'Cart',
      href: '/cart',
      badge: totalItems,
      icon: <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: <Package className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
    },
    {
      name: isAuthenticated ? (user?.roles?.includes('Farmer') ? 'Dashboard' : 'Profile') : 'Login',
      href: isAuthenticated ? (user?.roles?.includes('Farmer') ? '/dashboard/farmer' : '/profile') : '/login',
      icon: isAuthenticated && user?.roles?.includes('Farmer') 
              ? <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} /> 
              : <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 pb-safe z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-colors ${
                isActive ? 'text-[#4A7C59]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative"
              >
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </motion.div>
              <span className={`text-[10px] tracking-tight transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-3 w-10 h-1 bg-[#4A7C59] rounded-b-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
