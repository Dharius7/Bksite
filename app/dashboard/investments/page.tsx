'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Banknote,
  PiggyBank,
  Plus,
  TrendingUp,
  Wallet,
  ArrowDownRight,
} from 'lucide-react';

export default function InvestmentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [wallet, setWallet] = useState<any | null>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const [investmentsRes, walletRes] = await Promise.all([
        api.get('/investments'),
        api.get('/investments/wallet/balance'),
      ]);
      setInvestments(investmentsRes.data || []);
      setWallet(walletRes.data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  useEffect(() => {
    if (message || error) {
      fetchData();
    }
  }, [message, error]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Save & Invest</h1>
            <p className="text-gray-600">Grow your wealth with secure investments</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard/investments/deposit')}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Deposit
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
          >
            <ArrowDownRight className="w-4 h-4" />
            Withdraw
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/investments/plans')}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-white font-semibold hover:bg-purple-700"
          >
            <TrendingUp className="w-4 h-4" />
            Invest Now
          </button>
        </div>
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

      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="relative z-10 space-y-2">
          <div className="text-sm text-white/80">Investment Wallet Balance</div>
          <div className="text-3xl md:text-4xl font-semibold">
            USD {Number(wallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/80">
            <div>Total Earnings: USD {Number(wallet?.totalEarnings || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div>Active Investments: {Number(wallet?.activeInvestments || 0)}</div>
          </div>
        </div>
        <div className="absolute right-6 top-6 w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
          <Wallet className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard/investments/deposit')}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 text-left hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Deposit Funds</div>
            <div className="text-sm text-gray-500">Add money to invest</div>
          </div>
        </button>
        <button
          type="button"
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 text-left hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Withdraw Funds</div>
            <div className="text-sm text-gray-500">Cash out your earnings</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/investments/plans')}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 text-left hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">View Plans</div>
            <div className="text-sm text-gray-500">Browse investment options</div>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <PiggyBank className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Start Your Investment Journey</h2>
        <p className="text-gray-500">
          Deposit funds and choose an investment plan to start earning returns.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/investments/deposit')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Make First Deposit
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/investments/plans')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-50"
          >
            <TrendingUp className="w-4 h-4" />
            View Plans
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Deposit History</div>
            <div className="text-sm text-gray-500">View all deposits</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Withdrawal History</div>
            <div className="text-sm text-gray-500">View all withdrawals</div>
          </div>
        </div>
      </div>

    </div>
  );
}
