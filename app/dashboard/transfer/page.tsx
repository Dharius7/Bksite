'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Coins,
  CreditCard,
  DollarSign,
<<<<<<< HEAD
  Globe,
=======
  ArrowLeft,
>>>>>>> b2ccfa7 (First Update commit)
  Landmark,
  MoreHorizontal,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

export default function TransferPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [method, setMethod] = useState('wire');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const transferMethods = useMemo(
    () => [
      {
        id: 'wire',
        title: 'Wire Transfer',
        description: 'Transfer funds directly to bank accounts worldwide.',
        icon: Landmark,
        color: 'bg-blue-100 text-blue-600',
      },
      {
        id: 'crypto',
        title: 'Cryptocurrency',
        description: 'Send funds to your cryptocurrency wallet.',
        icon: Coins,
        color: 'bg-amber-100 text-amber-600',
      },
      {
        id: 'paypal',
        title: 'PayPal',
        description: 'Transfer funds to your PayPal account.',
        icon: CreditCard,
        color: 'bg-indigo-100 text-indigo-600',
      },
      {
        id: 'wise',
        title: 'Wise Transfer',
        description: 'Transfer with lower fees using Wise.',
        icon: Wallet,
        color: 'bg-green-100 text-green-600',
      },
      {
        id: 'cashapp',
        title: 'Cash App',
        description: 'Transfers funds to your Cash App account.',
        icon: DollarSign,
        color: 'bg-pink-100 text-pink-600',
      },
      {
        id: 'other',
        title: 'Zelle Transfer',
        description: 'Send money using Zelle.',
        icon: MoreHorizontal,
        color: 'bg-yellow-100 text-yellow-600',
      },
    ],
    []
  );

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

    try {
      const payload = {
        toAccount: toAccount.trim(),
        amount: Number(amount),
        description: description.trim(),
        method,
      };
      const response = await api.post('/transfers', payload);
      setMessage(response.data?.message || 'Transfer submitted successfully');
      setToAccount('');
      setAmount('');
      setDescription('');
      setMethod('wire');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
<<<<<<< HEAD
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">International Transfer</h1>
              <p className="text-gray-600">Send money worldwide with multiple payment methods</p>
            </div>
          </div>
          <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700">
            View Transactions
          </Link>
=======
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="sm:hidden mt-1 inline-flex items-center justify-center rounded-full w-9 h-9 bg-slate-100 text-slate-600"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
              <Landmark className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900">International Transfer</h1>
              <p
                className="text-gray-600 text-sm sm:text-base"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                Send money worldwide with multiple payment methods
              </p>
            </div>
          </div>
>>>>>>> b2ccfa7 (First Update commit)
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Transfer Method</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {transferMethods.map((item) => {
            const Icon = item.icon;
            const isActive = method === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  if (item.id === 'wire') {
                    router.push('/dashboard/transfer/wire');
                    return;
                  }
                  if (item.id === 'paypal') {
                    router.push('/dashboard/transfer/paypal');
                    return;
                  }
                  if (item.id === 'cashapp') {
                    router.push('/dashboard/transfer/cash-app');
                    return;
                  }
                  if (item.id === 'crypto') {
                    router.push('/dashboard/transfer/crypto');
                    return;
                  }
                  if (item.id === 'wise') {
                    router.push('/dashboard/transfer/wise');
                    return;
                  }
                  if (item.id === 'other') {
                    router.push('/dashboard/transfer/zelle');
                    return;
                  }
                  setMethod(item.id);
                }}
                className={`text-left bg-white rounded-2xl shadow-sm p-5 border transition ${
                  isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Secure Transaction</div>
          <div className="text-sm text-gray-500">
            All transfers are encrypted and processed securely. Never share your PIN with anyone.
          </div>
        </div>
      </div>
    </div>
  );
}
