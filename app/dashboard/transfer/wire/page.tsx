'use client';

import WavePreloader from '@/components/WavePreloader';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { isPositiveAmount, trimRequired } from '@/lib/validation';
import TransferConfirmModal from '@/components/TransferConfirmModal';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe,
  Landmark,
  MapPin,
  ShieldCheck,
  User,
} from 'lucide-react';

const quickAmounts = [100, 500, 1000];

export default function WireTransferPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [btcRate, setBtcRate] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [amount, setAmount] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [accountType, setAccountType] = useState('Online Banking');
  const [country, setCountry] = useState('Afghanistan');
  const [routingNumber, setRoutingNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
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

  const minAmount = 100;
  const maxAmount = 5000000;
  const amountNumber = Number(amount || 0);
  const amountWarning = amountNumber > 0 && amountNumber < minAmount;

  const transferSummary = useMemo(() => {
    const parts = [
      `Beneficiary: ${beneficiaryName || 'N/A'}`,
      `Account: ${beneficiaryAccount || 'N/A'}`,
      `Bank: ${bankName || 'N/A'}`,
      `Bank Address: ${bankAddress || 'N/A'}`,
      `Beneficiary Address: ${beneficiaryAddress || 'N/A'}`,
      `Account Type: ${accountType || 'N/A'}`,
      `Country: ${country || 'N/A'}`,
      `Routing/Bank Code: ${routingNumber || 'N/A'}`,
      `SWIFT: ${swiftCode || 'N/A'}`,
      note ? `Note: ${note}` : null,
    ].filter(Boolean);
    return parts.join(' | ');
  }, [
    accountType,
    bankAddress,
    bankName,
    beneficiaryAccount,
    beneficiaryAddress,
    beneficiaryName,
    country,
    note,
    routingNumber,
    swiftCode,
  ]);

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
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
        toAccount: beneficiaryAccount.trim(),
        amount: Number(amount),
        description: transferSummary,
        method: 'wire',
      };
      const response = await api.post('/transfers', payload);
      setMessage(response.data?.message || 'Wire transfer submitted successfully');
      await fetchBalance();
      setAmount('');
      setBeneficiaryName('');
      setBeneficiaryAccount('');
      setBeneficiaryAddress('');
      setBankName('');
      setBankAddress('');
      setAccountType('Online Banking');
      setCountry('Afghanistan');
      setRoutingNumber('');
      setSwiftCode('');
      setNote('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPositiveAmount(amount)) {
      setError('Enter a valid amount.');
      return;
    }
    if (amountNumber < minAmount) {
      setError(`Minimum of $${minAmount.toLocaleString()}.`);
      return;
    }
    if (!trimRequired(beneficiaryName) || !trimRequired(beneficiaryAccount) || !trimRequired(beneficiaryAddress)) {
      setError('Please complete all required beneficiary fields.');
      return;
    }
    if (!trimRequired(bankName) || !trimRequired(bankAddress)) {
      setError('Please complete all required bank fields.');
      return;
    }
    if (!trimRequired(accountType) || !trimRequired(country)) {
      setError('Please select account type and country.');
      return;
    }

    setConfirmOpen(true);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 flex items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          <Globe className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">International Transfer</h1>
          <p className="text-gray-600">Send money worldwide with multiple payment methods</p>
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
                <Landmark className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">International Wire Transfer</h2>
              <p className="text-sm text-white/80">
                Funds will reflect in the Beneficiary Account within 72 hours.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
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
            <div className="border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Account Balance</div>
                  <div className="text-xl font-semibold text-gray-900">
                    {balance === null
                      ? 'Loading...'
                      : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </div>
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
                onClick={() => setAmount(String(maxAmount))}
                className="px-3 py-1 rounded-lg text-sm bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                Max
              </button>
            </div>
            {amountWarning && (
              <div className="text-sm text-red-600 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                Minimum of ${minAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Beneficiary Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <User className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Enter beneficiary's full name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Beneficiary IBAN OR Account Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <Landmark className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={beneficiaryAccount}
                  onChange={(e) => setBeneficiaryAccount(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="IBAN OR Account Number"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Beneficiary Address <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <textarea
                rows={3}
                value={beneficiaryAddress}
                onChange={(e) => setBeneficiaryAddress(e.target.value)}
                className="w-full outline-none text-sm resize-none"
                placeholder="Enter beneficiary's full address (Street, City, State, ZIP/Postal Code, Country)"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Full residential or business address of the beneficiary</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Enter bank name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bank Address <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={bankAddress}
                  onChange={(e) => setBankAddress(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Enter bank address"
                  required
                />
              </div>
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                required
              >
                <option>Online Banking</option>
                <option>Checking</option>
                <option>Savings</option>
                <option>Business</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country wire to be sent
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option>Afghanistan</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Germany</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bank code OR routing number</label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Bank code OR routing number"
              />
              <p className="text-xs text-gray-400 mt-1">International Bank Account Number</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SWIFT Code</label>
              <input
                type="text"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Enter SWIFT/BIC code"
              />
              <p className="text-xs text-gray-400 mt-1">8-11 character bank identifier code</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Note (Optional)</label>
            <div className="flex items-start gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
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
              onClick={() => router.push('/dashboard')}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-start sm:items-center gap-3">
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
          submitTransfer();
        }}
        methodLabel="Wire Transfer"
        amount={Number(amount || 0)}
        balance={balance}
        btcRate={btcRate}
        statusMessage={message}
        statusError={error}
      />
    </div>
  );
}
