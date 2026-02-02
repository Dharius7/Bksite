'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { PiggyBank, Shield, ArrowLeft, Bitcoin } from 'lucide-react';
import { isPositiveAmount } from '@/lib/validation';
import Link from 'next/link';

export default function DepositPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bitcoin');
  const [currency, setCurrency] = useState('USD');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    if (!isPositiveAmount(amount)) {
      setError('Enter a valid deposit amount.');
      setSubmitting(false);
      return;
    }

    try {
      router.push(
        `/dashboard/deposit/confirm?amount=${encodeURIComponent(amount)}&currency=${encodeURIComponent(currency)}&method=${encodeURIComponent(method)}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deposit Funds</h1>
            <p className="text-gray-600">Add money to your account securely</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-sky-600 to-blue-800 px-6 py-8 text-white text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <PiggyBank className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">Fund Your Account</h2>
          <p className="text-sm text-white/80">Choose your preferred deposit method and amount</p>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {message && (
            <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="text-sm font-semibold text-gray-800 mb-3">Select Deposit Method</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('bitcoin')}
                  className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left transition ${
                    method === 'bitcoin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Bitcoin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Bitcoin</div>
                      <div className="text-xs text-gray-500">BTC</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${method === 'bitcoin' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`} />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 sm:p-5">
              <div className="text-sm font-semibold text-gray-800 mb-3">Deposit Amount</div>
              <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-white px-4 py-3">
                <span className="text-lg font-semibold text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-lg font-semibold text-gray-800 focus:outline-none"
                  placeholder="0.00"
                  required
                />
                <span className="text-sm font-semibold text-gray-400">.00</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['100', '500', '1000', '5000', '10000'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(value)}
                    className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>

            <input type="hidden" value={currency} readOnly />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-white font-semibold hover:bg-sky-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Continue to Deposit'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-100 p-4 sm:p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Secure Deposit</div>
            <div className="text-sm text-gray-600">
              All deposits are processed through secure payment channels. Your financial information is never stored on our servers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
