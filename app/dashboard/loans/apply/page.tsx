'use client';

import WavePreloader from '@/components/WavePreloader';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  Mail,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react';

const fallbackLoanTypes: Record<string, { rate: number; fee: number; maxTerm: number }> = {
  personal_home: { rate: 8.5, fee: 1.5, maxTerm: 240 },
  automobile: { rate: 7.5, fee: 1.0, maxTerm: 72 },
  business: { rate: 12.0, fee: 2.0, maxTerm: 60 },
  salary: { rate: 15.0, fee: 0.5, maxTerm: 12 },
  secured_overdraft: { rate: 10.0, fee: 0.8, maxTerm: 36 },
  health: { rate: 6.0, fee: 0.5, maxTerm: 24 },
};

const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'NGN'];
const incomeOptions = [
  '$2,000 - $5,000',
  '$5,001 - $10,000',
  '$10,001 - $25,000',
  '$25,001 - $50,000',
  '$50,001+',
];

export default function LoanApplyPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loanTypes, setLoanTypes] = useState(fallbackLoanTypes);
  const [loanType, setLoanType] = useState('personal_home');
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [monthlyIncome, setMonthlyIncome] = useState(incomeOptions[0]);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchLoanTypes = async () => {
      if (!user) return;
      try {
        const response = await api.get('/loans/types/list');
        if (response.data) {
          setLoanTypes(response.data);
        }
      } catch {
        setLoanTypes(fallbackLoanTypes);
      }
    };

    fetchLoanTypes();
  }, [user]);

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!agree) {
      setError('Please accept the terms and conditions to continue.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/loans', {
        loanType,
        amount: Number(amount),
        term: Number(term),
        purpose: `${purpose.trim() || 'Loan request'} | Currency: ${currency} | Monthly income: ${monthlyIncome}`,
      });
      setMessage(response.data?.message || 'Loan application submitted');
      setAmount('');
      setTerm('12');
      setPurpose('');
      setCurrency('USD');
      setMonthlyIncome(incomeOptions[0]);
      setAgree(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Loan application failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="text-2xl font-semibold text-gray-900">Loan Services</div>

      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <button
            type="button"
            onClick={() => router.push('/dashboard/loans')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Information
          </button>
          <div className="text-red-500">* Required fields</div>
        </div>

        <div className="flex items-center gap-3 text-gray-900 font-semibold">
          <BadgeCheck className="w-5 h-5 text-blue-600" />
          Loan Details
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Choose Loan Plans <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <Wallet className="w-4 h-4 text-gray-400" />
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm"
                  required
                >
                  {Object.entries(loanTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {key.replace(/_/g, ' ')} - {value.rate}% APR
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loan Amount ({currency}) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Enter loan amount"
                  required
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-xs text-gray-500"
                >
                  {currencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Repayment Plan Duration <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full outline-none text-sm"
                  required
                />
                <span className="text-xs text-gray-500">Months</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Purpose of Loan <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <FileText className="w-4 h-4 text-gray-400 mt-1" />
              <textarea
                rows={4}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full outline-none text-sm resize-none"
                placeholder="Please describe the purpose of this loan..."
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-900 font-semibold">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Financial Information
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Net Income <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <select
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full outline-none text-sm"
                required
              >
                {incomeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 p-4 flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />
            <div>
              <div className="font-semibold text-gray-900">I agree to the terms and conditions</div>
              <div>
                By submitting this application, I confirm that all information provided is accurate and complete.
                I authorize Coral Credit Bank LTD to verify my information and credit history.
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Review & Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/loans')}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
