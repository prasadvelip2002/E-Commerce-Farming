import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const API_BASE = typeof window !== 'undefined' ? `http://${window.location.hostname}:5153` : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5153');

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'agri-auth-storage' }
  )
);

// --- API helpers (decoupled from store for reuse in react-query) ---

export async function apiLogin(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Login failed');
  }
  const data = await res.json();
  const payload = JSON.parse(atob(data.token.split('.')[1]));
  console.log("JWT Payload Decoded:", payload);
  const rawRole = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  const rawEmail = payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
  return {
    id: payload.sub,
    email: rawEmail,
    roles: rawRole ? [rawRole].flat() : [],
    token: data.token,
  };
}

export async function apiRegister(email: string, password: string, phoneNumber: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, phoneNumber }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Registration failed');
  }
}
