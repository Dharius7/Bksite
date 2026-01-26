'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import TransferConfirmModal from '@/components/TransferConfirmModal';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Globe,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

const quickAmounts = [91, 907, 9074];

export default function CryptoTransferPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [btcRate, setBtcRate] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [amount, setAmount] = useState('');
  const [crypto, setCrypto] = useState('BTC');
  const [network, setNetwork] = useState('Native');
  const [walletAddress, setWalletAddress] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/dashboard');
      setBalance(response.data?.account?.balance ?? null);
    } catch {
      setBalance(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await api.get('/currency-swap/rate');
        setBtcRate(response.data?.rate || null);
      } catch {
        setBtcRate(null);
      }
    };
    if (user) {
      fetchRate();
    }
  }, [user]);

  const transferSummary = useMemo(() => {
    const parts = [
      `Crypto: ${crypto || 'N/A'}`,
      `Network: ${network || 'N/A'}`,
      `Wallet: ${walletAddress || 'N/A'}`,
      note ? `Note: ${note}` : null,
    ].filter(Boolean);
    return parts.join(' | ');
  }, [crypto, network, note, walletAddress]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const submitTransfer = async () => {
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const messageRes = await api.get('/accounts/transfer-message');
      if (messageRes.data?.message) {
        setError(messageRes.data.message);
        setSubmitting(false);
        return;
      }

      const payload = {
        toAccount: walletAddress.trim(),
        amount: Number(amount),
        description: transferSummary,
        method: 'crypto',
      };
      const response = await api.post('/transfers', payload);
      setMessage(response.data?.message || 'Crypto transfer submitted successfully');
      await fetchBalance();
      setAmount('');
      setWalletAddress('');
      setNote('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          <Globe className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">International Transfer</h1>
          <p className="text-gray-600">Send money worldwide with multiple payment methods</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="font-semibold text-gray-900">Quick Transfer</div>
        <button
          type="button"
          onClick={fetchBalance}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center gap-6">
        <button
          type="button"
          className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 text-gray-500 flex flex-col items-center justify-center text-xs"
        >
          <span className="text-2xl">+</span>
          Add New
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Wallet className="w-7 h-7" />
          </div>
          <div className="text-sm text-gray-600">
            <div>No saved beneficiaries yet</div>
            <div className="text-gray-400">Add one to get started</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/transfer')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">Cryptocurrency Transfer</h2>
              <p className="text-sm text-white/80">
                Send Bitcoin or other cryptocurrencies directly to wallet addresses.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-6">
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

          <div>
            <div className="text-sm font-semibold text-gray-900 mb-2">Available Balance</div>
            <div className="border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Account Balance</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {balance === null
                      ? 'Loading...'
                      : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </div>
                  <div className="text-xs text-blue-600">✓ Used for crypto transfers</div>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
            <div className="text-sm font-semibold text-gray-900">Amount to Transfer</div>
            <div className="flex items-center gap-3 border border-blue-200 bg-white rounded-xl px-4 py-3">
              <span className="text-gray-400 font-semibold">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent outline-none text-lg font-semibold text-gray-700"
                placeholder="0.00"
                required
              />
              <span className="text-xs text-blue-600 font-semibold">FIAT → BTC</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setAmount(String(value))}
                  className="px-3 py-1 rounded-lg text-sm bg-gray-200 text-gray-600 hover:bg-gray-300"
                >
                  ${value}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(String(Math.max(...quickAmounts)))}
                className="px-3 py-1 rounded-lg text-sm bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                Max
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                ₿
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">BTC</div>
                <div className="text-xs text-gray-500">Select your preferred cryptocurrency and network</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cryptocurrency <span className="text-red-500">*</span>
              </label>
              <select
                value={crypto}
                onChange={(e) => setCrypto(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                required
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Network <span className="text-red-500">*</span>
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                required
              >
                <option value="Native">Native</option>
                <option value="ERC20">ERC-20</option>
                <option value="TRC20">TRC-20</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Wallet Address <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <Wallet className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full outline-none text-sm"
                placeholder="Enter wallet address"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
            <AlertTriangle className="w-4 h-4 mt-0.5" />
            Double-check your wallet address. Transactions to incorrect addresses cannot be reversed.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Note (Optional)</label>
            <div className="flex items-start gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <Wallet className="w-4 h-4 text-gray-400 mt-1" />
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full outline-none text-sm resize-none"
                placeholder="Optional payment description or note"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Transfer
            </button>
            <button
              type="button"
              className="flex-1 border border-blue-200 text-blue-500 py-3 rounded-xl font-semibold"
            >
              Save Beneficiary
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </form>
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

      <TransferConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          submitTransfer();
        }}
        methodLabel={`Crypto (${crypto})`}
        amount={Number(amount || 0)}
        balance={balance}
        btcRate={btcRate}
      />
    </div>
  );
}
