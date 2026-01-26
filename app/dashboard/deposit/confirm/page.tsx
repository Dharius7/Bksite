'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, Copy, Check, AlertCircle, Link2 } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_RATE = 89372;
const WALLET_ADDRESS = 'bc1qluw8kfan5f97j9qteh6jlq6lfmuguzv9rwmkk3';

export default function DepositConfirmPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bitcoinRate, setBitcoinRate] = useState(DEFAULT_RATE);
  const [copied, setCopied] = useState(false);
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const amount = searchParams.get('amount') || '0';
  const currency = searchParams.get('currency') || 'USD';
  const method = searchParams.get('method') || 'bitcoin';
  const depositId = searchParams.get('depositId') || '';

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await api.get('/currency-swap/rate');
        setBitcoinRate(response.data?.rate || DEFAULT_RATE);
      } catch {
        setBitcoinRate(DEFAULT_RATE);
      }
    };
    fetchRate();
  }, []);

  const btcAmount = useMemo(() => {
    const numericAmount = Number(amount || 0);
    if (!numericAmount || bitcoinRate <= 0) return 0;
    return numericAmount / bitcoinRate;
  }, [amount, bitcoinRate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmitHash = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!hash.trim()) {
      setSubmitting(false);
      setError('Transaction hash is required');
      return;
    }

    setTimeout(() => {
      setSubmitting(false);
      setError('Deposit failed');
    }, 600);
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/dashboard/deposit" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Deposit Payment</h1>
          <p className="text-gray-600 mt-1">Send the cryptocurrency amount to the wallet address below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 space-y-6">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
            <div className="text-sm text-gray-600">Amount to Deposit</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              BTC {btcAmount.toFixed(8)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              ~ {currency} {Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500 mt-2">Rate: 1 BTC = {currency} {bitcoinRate.toLocaleString()}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-800 mb-2">Send BTC to this wallet address:</div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="text-sm font-mono text-gray-700 break-all">{WALLET_ADDRESS}</div>
              <button
                type="button"
                onClick={handleCopy}
                className="ml-auto inline-flex items-center justify-center rounded-lg bg-green-100 text-green-700 p-2 hover:bg-green-200"
                aria-label="Copy wallet address"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Copy the wallet address above and send exactly {btcAmount.toFixed(8)} BTC
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-800 mb-2">Transaction ID:</div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <div className="text-sm font-mono text-gray-700">{depositId || 'COR-4DB6706E52'}</div>
              <div className="ml-auto inline-flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 p-2">
                <Link2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 flex gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-semibold">Important Instructions</div>
              <div className="text-blue-700">
                Send the exact Bitcoin amount to the wallet address shown. Double-check the address before sending. Transaction may take 10-30 minutes to confirm.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitHash} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Transaction Hash <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <input
                  type="text"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="w-full text-sm text-gray-700 focus:outline-none"
                  placeholder="Enter your BTC transaction hash"
                  required
                />
                <Link2 className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                After sending {btcAmount.toFixed(8)} BTC to the wallet address above, copy and paste the transaction hash from your wallet or blockchain explorer.
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Transaction Hash'}
                <Check className="w-4 h-4" />
              </button>
              <Link
                href="/dashboard"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Skip for Now
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 sm:p-5 text-sm text-yellow-800">
          <div className="font-semibold mb-2">Important Notes</div>
          <ul className="space-y-1">
            <li>- Send exactly {btcAmount.toFixed(8)} BTC - sending the wrong amount may delay processing</li>
            <li>- Double-check the wallet address before sending</li>
            <li>- After sending, submit your transaction hash to speed up approval</li>
            <li>- Your deposit will be credited to your investment wallet after admin approval</li>
            <li>- Processing time is usually within 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
