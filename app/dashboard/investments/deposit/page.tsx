'use client';

import WavePreloader from '@/components/WavePreloader';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isPositiveAmount } from '@/lib/validation';
import { ArrowLeft, Coins } from 'lucide-react';

export default function InvestmentDepositPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('BTC');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    if (!isPositiveAmount(amount)) {
      setError('Enter a valid amount.');
      setSubmitting(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        amount,
        method,
      });
      router.push(`/dashboard/investments/deposit/confirm?${params.toString()}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Deposit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <button
        type="button"
        onClick={() => router.push('/dashboard/investments')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Save & Invest
      </button>

      <div className="max-w-3xl mx-auto mt-6">
        <h1 className="text-2xl font-semibold text-gray-900">Deposit to Investment Wallet</h1>
        <p className="text-gray-600">Enter the USD amount you want to deposit</p>

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
          {message && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount in USD <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-gray-500 font-semibold">USD</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Minimum deposit: USD 1.00</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Payment Method <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['BTC', 'USDT'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMethod(item)}
                    className={`flex items-center gap-3 border rounded-xl px-4 py-4 text-left transition ${
                      method === item
                        ? 'border-blue-500 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {item === 'BTC' ? 'Bitcoin' : 'USDT (Tether)'}
                      </div>
                      <div className="text-xs text-gray-500">{item}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Continue to Invest'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/investments')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
