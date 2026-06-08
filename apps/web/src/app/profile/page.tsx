'use client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Package, MapPin, CreditCard, LogOut, ShieldCheck, Wheat } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
               <User className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Login & security</h3>
              <p className="text-sm text-gray-500">Edit your email, name, and mobile number</p>
              <div className="mt-2 text-sm">
                <span className="font-semibold">Current Email:</span> {user?.email}
              </div>
            </div>
          </div>

          <div onClick={() => router.push('/orders')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100">
               <Package className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your Orders</h3>
              <p className="text-sm text-gray-500">Track, return, or buy things again</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 border border-yellow-100">
               <MapPin className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your Addresses</h3>
              <p className="text-sm text-gray-500">Edit addresses for orders and gifts</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 border border-purple-100">
               <CreditCard className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Payment options</h3>
              <p className="text-sm text-gray-500">Edit or add payment methods</p>
            </div>
          </div>

          {(user?.roles?.includes('SuperAdmin') || user?.roles?.includes('Admin')) && (
            <div onClick={() => router.push('/dashboard/admin')} className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 flex items-start gap-4 cursor-pointer hover:bg-red-50 transition-colors">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 border border-red-200">
                 <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-700">Admin Panel</h3>
                <p className="text-sm text-gray-600">Access the master control dashboard</p>
              </div>
            </div>
          )}

          {user?.roles?.includes('Farmer') && (
            <div onClick={() => router.push('/dashboard/farmer')} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-200 flex items-start gap-4 cursor-pointer hover:bg-emerald-50 transition-colors">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
                 <Wheat className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-700">Farmer Portal</h3>
                <p className="text-sm text-gray-600">Manage your crops and orders</p>
              </div>
            </div>
          )}

          <div onClick={() => { logout(); router.push('/login'); }} className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-start gap-4 cursor-pointer hover:bg-red-50 transition-colors">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 border border-red-100">
               <LogOut className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-600">Sign Out</h3>
              <p className="text-sm text-gray-500">Log out of your Agri account on this device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
