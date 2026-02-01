'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isAccountNumber, isPositiveAmount, isRoutingNumber, trimRequired } from '@/lib/validation';
import TransferConfirmModal from '@/components/TransferConfirmModal';
import { Building2, User, Hash, FileText, ArrowLeft, Landmark, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LocalTransferPage() {
  const router = useRouter();
  const [accountBalance, setAccountBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [transferMessage, setTransferMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, messageRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/accounts/transfer-message').catch(() => ({ data: { message: '' } })),
        ]);
        setAccountBalance(dashboardRes.data?.account?.balance || 0);
        setTransferMessage(messageRes.data?.message || '');
      } catch (err) {
        console.error('Failed to load transfer data', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isPositiveAmount(amount)) {
      setError('Enter a valid amount.');
      return;
    }
    if (Number(amount) > accountBalance) {
      setError('Transfer amount exceeds your available balance.');
      return;
    }

    if (!trimRequired(recipientName) || !trimRequired(bankName) || !trimRequired(bankAddress) || !trimRequired(accountType)) {
      setError('Please complete all required fields.');
      return;
    }
    if (!isRoutingNumber(routingNumber)) {
      setError('Routing number must be 9 digits.');
      return;
    }
    if (!isAccountNumber(accountNumber)) {
      setError('Account number must be 4-17 digits.');
      return;
    }

    setShowConfirm(true);
  };

  const confirmTransfer = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (transferMessage) {
        setError(transferMessage);
        return;
      }
      const response = await api.post('/transfers', {
        amount: Number(amount),
        toAccount: accountNumber,
        description: `Local transfer to ${recipientName}`,
        method: 'local',
        details: {
          recipientName,
          bankName,
          routingNumber,
          accountType,
          note,
        },
      });
      setMessage(response.data?.message || 'Local transfer submitted successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center relative">
              <Link
                href="/dashboard/transfer"
                className="absolute left-4 top-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <Landmark className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-lg md:text-2xl font-bold">Local Transfer</h1>
              <p className="text-xs md:text-sm text-blue-100">Funds arrive in U.S. accounts within 1-2 business days.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Available Balance</div>
                <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Account Balance</div>
                      <div className="text-lg font-semibold text-gray-900">
                        ${accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">?</div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Amount to Transfer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2 text-xs">
                  {['100', '500', '1000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                    >
                      ${preset}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount(String(accountBalance))}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Bank name"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Routing Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      maxLength={9}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="9-digit routing number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      maxLength={17}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Account number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bank Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={bankAddress}
                    onChange={(e) => setBankAddress(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Note (Optional)</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Payment note"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Continue to Transfer
                </button>
                <Link
                  href="/dashboard"
                  className="w-full text-center border border-gray-200 rounded-xl py-3 text-gray-700 font-semibold"
                >
                  Back to Dashboard
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Secure Transaction</div>
              <div className="text-xs text-gray-500">All transfers are encrypted and processed securely.</div>
            </div>
          </div>
        </div>
      </div>

      <TransferConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmTransfer}
        methodLabel="Local Transfer"
        amount={Number(amount || 0)}
        balance={accountBalance}
        sourceLabel="Account Balance"
        fee={0}
        statusMessage={message}
        statusError={error}
      />
    </div>
  );
}
