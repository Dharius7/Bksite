'use client';

import WavePreloader from '@/components/WavePreloader';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, PiggyBank, TrendingUp } from 'lucide-react';

const plans = [
  {
    name: 'PROFESSIONAL AI',
    min: 10000,
    max: 50000,
    rate: 15,
    frequency: 'Daily',
    duration: 10,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'FIXED AI',
    min: 100000,
    max: 500000,
    rate: 8,
    frequency: 'Daily',
    duration: 20,
    gradient: 'from-violet-500 to-rose-500',
  },
  {
    name: 'AMATEUR AI',
    min: 1500,
    max: 10000,
    rate: 20,
    frequency: 'Every 10 Minutes',
    duration: 5,
    gradient: 'from-fuchsia-500 to-rose-500',
  },
  {
    name: 'VARIETY AI',
    min: 50000,
    max: 100000,
    rate: 10,
    frequency: 'Daily',
    duration: 15,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'SUPERIOR AI',
    min: 500000,
    max: 1000000,
    rate: 6,
    frequency: 'Daily',
    duration: 20,
    gradient: 'from-violet-500 to-rose-500',
  },
];

export default function InvestmentPlansPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [wallet, setWallet] = useState<any | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const fetchWallet = useCallback(async () => {
    if (!user) return;
    try {
      const walletRes = await api.get('/investments/wallet/balance');
      setWallet(walletRes.data || null);
    } catch {
      setWallet(null);
    }
  }, [user]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  const handleInvest = async (e: FormEvent, plan: typeof plans[number]) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(plan.name);

    const amount = Number(amounts[plan.name] || 0);
    if (amount < plan.min || amount > plan.max) {
      setError(`Amount must be between ${plan.min} and ${plan.max} USD`);
      setSubmitting(null);
      return;
    }

    try {
      const response = await api.post('/investments', {
        planName: plan.name,
        amount,
        returnRate: plan.rate,
        duration: plan.duration,
      });
      setMessage(response.data?.message || 'Investment created');
      setAmounts((prev) => ({ ...prev, [plan.name]: '' }));
      await fetchWallet();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create investment');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button
        type="button"
        onClick={() => router.push('/dashboard/investments')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Save & Invest
      </button>

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Investment Plans</h1>
        <p className="text-gray-600">Choose an investment plan that suits your goals</p>
      </div>

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

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <div className="text-sm text-white/80">Investment Wallet Balance</div>
          <div className="text-2xl font-semibold">
            USD {Number(wallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push('/dashboard/investments')}
          className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold"
        >
          Deposit Funds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <form
            key={plan.name}
            onSubmit={(e) => handleInvest(e, plan)}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div className={`p-5 text-white bg-gradient-to-r ${plan.gradient}`}>
              <div className="text-lg font-semibold">{plan.name}</div>
              <div className="text-sm">Minimum: USD {plan.min.toLocaleString()}</div>
              <div className="text-sm">Maximum: USD {plan.max.toLocaleString()}</div>
            </div>
            <div className="p-5 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Return Rate</span>
                <span className="font-semibold text-gray-900">{plan.rate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Earning Frequency</span>
                <span className="font-semibold text-gray-900">{plan.frequency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Duration</span>
                <span className="font-semibold text-gray-900">{plan.duration} Days</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700">Investment Amount (USD)</div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amounts[plan.name] || ''}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, [plan.name]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-2"
                  placeholder="Enter amount"
                  required
                />
                <div className="text-xs text-gray-400 mt-1">
                  Min: USD {plan.min.toLocaleString()} | Max: USD {plan.max.toLocaleString()}
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting === plan.name}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-2"
              >
                {submitting === plan.name ? 'Submitting...' : 'Invest Now'}
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
