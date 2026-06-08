'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf } from 'lucide-react';

import { LayoutDashboard, ShieldCheck, Package, ShoppingCart, Key, Users, ScanSearch, DollarSign, Settings, Truck, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { href: '/dashboard/admin/ai-insights', label: 'AI Insights Hub', icon: <Activity className="w-5 h-5 text-blue-400" /> },
  { href: '/dashboard/admin/approvals', label: 'KYC Approvals', icon: <ShieldCheck className="w-5 h-5" /> },
  { href: '/dashboard/admin/quality-control', label: 'Quality Control', icon: <ScanSearch className="w-5 h-5" /> },
  { href: '/dashboard/admin/products', label: 'Products', icon: <Package className="w-5 h-5" /> },
  { href: '/dashboard/admin/orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
  { href: '/dashboard/admin/delivery-provider', label: 'Deliveries', icon: <Truck className="w-5 h-5" /> },
  { href: '/dashboard/admin/authorize', label: 'Authorize Roles', icon: <Key className="w-5 h-5" /> },
  { href: '/dashboard/admin/sub-admins', label: 'Sub-Admins', icon: <Users className="w-5 h-5" /> },
  { href: '/dashboard/admin/pricing', label: 'Pricing Rules', icon: <DollarSign className="w-5 h-5" /> },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-[#1a2e20] text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-white/10 hidden md:block">
        <div className="flex items-center gap-3">
          <Leaf className="w-8 h-8 text-green-400" />
          <div>
            <p className="font-bold text-lg leading-tight">AgriMart</p>
            <p className="text-green-400 text-xs font-medium">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-row md:flex-col overflow-x-auto p-2 md:p-4 md:space-y-1 gap-2 md:gap-0 no-scrollbar whitespace-nowrap">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-[#4A7C59] text-white shadow-md'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 hidden md:block">
        <p className="text-xs text-gray-500 text-center">AgriMart Admin v1.0</p>
      </div>
    </aside>
  );
}
