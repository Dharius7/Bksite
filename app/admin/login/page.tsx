'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
<<<<<<< HEAD
  const [email, setEmail] = useState('');
=======
  const [emailOrName, setEmailOrName] = useState('');
  const [password, setPassword] = useState('');
>>>>>>> b2ccfa7 (First Update commit)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
<<<<<<< HEAD
      const response = await adminApi.post('/admin/login', { email });
      localStorage.setItem('admin_token', response.data?.token);
      localStorage.setItem('admin', JSON.stringify(response.data?.admin));
=======
      const response = await adminApi.post('/admin/login', { emailOrName, password });
      localStorage.setItem('admin_token', response.data?.token || '');
      localStorage.setItem('admin', JSON.stringify(response.data?.admin || {}));
>>>>>>> b2ccfa7 (First Update commit)
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
=======
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 border border-slate-100 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500" />
        <div className="flex items-center gap-3 mb-6 rounded-2xl px-4 py-3 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100">
>>>>>>> b2ccfa7 (First Update commit)
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
<<<<<<< HEAD
            <h1 className="text-xl font-bold text-gray-900">Admin Login</h1>
=======
            <h1 className="text-xl font-bold text-blue-800">Admin Login</h1>
>>>>>>> b2ccfa7 (First Update commit)
            <p className="text-sm text-gray-600">Sign in with your admin email</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
<<<<<<< HEAD
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="admin@coralcredit.com"
=======
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email or Username</label>
            <input
              type="text"
              value={emailOrName}
              onChange={(e) => setEmailOrName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white"
              placeholder="admin@coralcredit.com or infobank"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white"
              placeholder="Enter your password"
>>>>>>> b2ccfa7 (First Update commit)
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
<<<<<<< HEAD
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
=======
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
>>>>>>> b2ccfa7 (First Update commit)
          >
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
