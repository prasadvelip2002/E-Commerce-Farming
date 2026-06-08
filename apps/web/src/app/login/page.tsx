'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore, apiLogin } from '../../store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => apiLogin(email, password),
    onSuccess: (user) => {
      login(user);
      
      console.log("Logged in user:", user);
      
      // Role-Based Routing
      if (user.roles.includes('SuperAdmin') || user.roles.includes('Admin')) {
        router.push('/dashboard/admin');
      } else if (user.roles.includes('Farmer')) {
        router.push('/dashboard/farmer');
      } else {
        router.push('/');
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A7C59]">Welcome Back</h1>
          <p className="text-[#6D4C41] mt-2">Sign in to your Agri account</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition text-gray-900 bg-white"
            />
          </div>

          {mutation.isError && (
            <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
              {(mutation.error as Error).message}
            </p>
          )}

          <button
            id="login-submit"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !email || !password}
            className="w-full bg-[#4A7C59] hover:bg-[#3a6347] disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          New to Agri?{' '}
          <Link href="/register" className="text-[#4A7C59] font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
