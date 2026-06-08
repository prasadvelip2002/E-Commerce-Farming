'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiRegister } from '../../store/authStore';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => apiRegister(email, password, phone),
    onSuccess: () => {
      router.push('/login');
    },
  });

  const passwordsMatch = password === confirm;

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A7C59]">Join Agri</h1>
          <p className="text-[#6D4C41] mt-2">Create your marketplace account</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              id="register-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              id="register-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition text-gray-900 bg-white ${
                confirm && !passwordsMatch
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-[#4A7C59]'
              }`}
            />
            {confirm && !passwordsMatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
              {(mutation.error as Error).message}
            </p>
          )}

          {mutation.isSuccess && (
            <p className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg">
              Account created! Redirecting to login...
            </p>
          )}

          <button
            id="register-submit"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !email || !password || !passwordsMatch}
            className="w-full bg-[#4A7C59] hover:bg-[#3a6347] disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {mutation.isPending ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-[#4A7C59] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
