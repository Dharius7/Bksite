'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Check, Copy, Info, Link2 } from 'lucide-react';

export default function InvestmentDepositConfirmPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [txHash, setTxHash] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const amount = Number(searchParams.get('amount') || 0);
  const method = (searchParams.get('method') || 'BTC').toUpperCase();
  const btcRate = 89486; // mock rate, display only
  const txId = useMemo(() => `COR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`, []);
  const walletAddress = useMemo(
    () => (method === 'USDT' ? 'TQ7o3B7Kp7jP7u9qv8e8L3k2nGxw9pLQ1M' : 'bc1qluw8kfan5f97j9qteh6jlq6lfmuguzv9rwmkk3'),
    [method]
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
    setMessage('');
    setError('');
    setSubmitting(true);

    setError('Transaction failed');
    setMessage('');
    setSubmitting(false);
    return;
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-4 md:p-8">
      <button
        type="button"
        onClick={() => router.push('/dashboard/investments/deposit')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="max-w-3xl mx-auto mt-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Send Payment</h1>
          <p className="text-gray-600">Send the cryptocurrency amount to the wallet address below</p>
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

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center">
            <div className="text-sm text-gray-500">Amount to Pay</div>
            <div className="text-2xl font-semibold text-gray-900">{method} {amount.toFixed(8)}</div>
            <div className="text-sm text-gray-500">≈ USD {(amount * btcRate).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-xs text-gray-400 mt-1">Rate: 1 BTC = USD {btcRate.toLocaleString()}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Send {method} to this wallet address:</div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <input
                readOnly
                value={walletAddress}
                className="w-full outline-none text-sm text-gray-700"
              />
              <button
                type="button"
                onClick={() => handleCopy(walletAddress)}
                className="p-2 rounded-lg bg-green-100 text-green-600"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Copy the wallet address above and send exactly {amount.toFixed(8)} {method}
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Transaction ID:</div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <input readOnly value={txId} className="w-full outline-none text-sm text-gray-700" />
              <button
                type="button"
                onClick={() => handleCopy(txId)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 flex gap-2">
            <Info className="w-4 h-4 mt-0.5" />
            Send the exact amount to the wallet address shown. Double-check the address before sending. Transaction may take 10-30 minutes to confirm.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction Hash <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <Link2 className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder={`Enter your ${method} transaction hash`}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                After sending, paste the transaction hash from your wallet or blockchain explorer.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Transaction Hash'}
                <Check className="w-4 h-4 ml-2 inline" />
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/investments')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
              >
                Skip for Now
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800 space-y-2">
          <div className="font-semibold">Important Notes</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Send exactly {amount.toFixed(8)} {method} - sending the wrong amount may delay processing</li>
            <li>Double-check the wallet address before sending</li>
            <li>After sending, submit your transaction hash to speed up approval</li>
            <li>Your deposit will be credited to your investment wallet after admin approval</li>
            <li>Processing time is usually within 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
