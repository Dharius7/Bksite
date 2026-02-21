'use client';

import WavePreloader from '@/components/WavePreloader';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isPositiveAmount } from '@/lib/validation';
import { ArrowLeftRight, Coins, RefreshCw } from 'lucide-react';

const currencyOptions = [
  { code: 'USD', label: 'USD', enabled: true },
  { code: 'BTC', label: 'BTC', enabled: true },
  { code: 'EUR', label: 'EUR', enabled: false },
  { code: 'GBP', label: 'GBP', enabled: false },
  { code: 'JPY', label: 'JPY', enabled: false },
  { code: 'CAD', label: 'CAD', enabled: false },
];

export default function CurrencySwapPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [rate, setRate] = useState<number | null>(null);
  const [usdBalance, setUsdBalance] = useState<number | null>(null);
  const [btcBalance, setBtcBalance] = useState<number | null>(null);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const refreshData = useCallback(async () => {
    if (!user) return;
    try {
      const [rateRes, dashboardRes] = await Promise.all([
        api.get('/currency-swap/rate'),
        api.get('/dashboard'),
      ]);
      setRate(rateRes.data?.rate || null);
      setUsdBalance(dashboardRes.data?.account?.balance ?? null);
      setBtcBalance(dashboardRes.data?.account?.bitcoinBalance ?? null);
    } catch {
      setRate(null);
      setUsdBalance(null);
      setBtcBalance(null);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const isSupportedPair =
    (fromCurrency === 'USD' && toCurrency === 'BTC') ||
    (fromCurrency === 'BTC' && toCurrency === 'USD');

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!isPositiveAmount(amount)) {
      setError('Enter a valid amount.');
      return;
    }

    if (!isSupportedPair) {
      setError('This currency pair is not available yet.');
      return;
    }

    if (fromCurrency === 'USD' && usdBalance !== null && Number(amount) > usdBalance) {
      setError('Amount exceeds your USD balance.');
      return;
    }
    if (fromCurrency === 'BTC' && btcBalance !== null && Number(amount) > btcBalance) {
      setError('Amount exceeds your BTC balance.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/currency-swap', {
        fromCurrency,
        toCurrency,
        amount: Number(amount),
      });
      setMessage(response.data?.message || 'Swap completed');
      setAmount('');
      await refreshData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Swap failed');
    } finally {
      setSubmitting(false);
    }
  };

  const amountNumber = Number(amount || 0);
  const estimate = rate && fromCurrency === 'USD' && toCurrency === 'BTC'
    ? amountNumber / rate
    : rate && fromCurrency === 'BTC' && toCurrency === 'USD'
      ? amountNumber * rate
      : null;

  const currentRateLabel = rate
    ? `1 BTC = ${rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
    : 'Rate unavailable';

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Currency Swap</h1>
            <p className="text-gray-600">Convert between USD and Bitcoin</p>
          </div>
        </div>
        <button
          type="button"
          onClick={refreshData}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Balances</h2>
          <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500">USD Balance</div>
                <div className="text-sm font-semibold text-gray-900">
                  {usdBalance === null
                    ? 'Loading...'
                    : `$${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                ₿
              </div>
              <div>
                <div className="text-sm text-gray-500">Bitcoin Balance</div>
                <div className="text-sm font-semibold text-gray-900">
                  {btcBalance === null ? 'Loading...' : `${btcBalance.toFixed(8)} BTC`}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
            <div className="font-semibold">Current Exchange Rate</div>
            <div className="mt-1">{currentRateLabel}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From Currency</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              >
                {currencyOptions.map((option) => (
                  <option key={option.code} value={option.code} disabled={!option.enabled}>
                    {option.label}
                    {option.code === 'USD' && usdBalance !== null
                      ? ` ($${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                      : ''}
                    {!option.enabled ? ' (Soon)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To Currency</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              >
                {currencyOptions.map((option) => (
                  <option key={option.code} value={option.code} disabled={!option.enabled}>
                    {option.label}
                    {!option.enabled ? ' (Soon)' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {isSupportedPair ? 'Destination currency is available.' : 'Destination currency is not available yet.'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2">
                <input
                  type="number"
                  min="0"
                  step="0.00000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="0.00"
                  required
                />
                <span className="text-xs text-gray-500">{fromCurrency}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter the amount you want to swap</p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4 text-sm text-gray-600 text-center">
              {estimate === null
                ? 'Enter an amount to see conversion'
                : `Estimated conversion: ${estimate.toLocaleString('en-US', { maximumFractionDigits: 8 })} ${toCurrency}`}
            </div>

            <button
              type="submit"
              disabled={submitting || !isSupportedPair}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Swapping...' : 'Swap Currencies'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
