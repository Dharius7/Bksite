'use client';

import WavePreloader from '@/components/WavePreloader';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Clock,
  FileCheck,
  HeartPulse,
  Home,
  ShieldCheck,
  Timer,
} from 'lucide-react';

const fallbackLoanTypes: Record<string, { rate: number; fee: number; maxTerm: number }> = {
  personal_home: { rate: 8.5, fee: 1.5, maxTerm: 240 },
  automobile: { rate: 7.5, fee: 1.0, maxTerm: 72 },
  business: { rate: 12.0, fee: 2.0, maxTerm: 60 },
  salary: { rate: 15.0, fee: 0.5, maxTerm: 12 },
  secured_overdraft: { rate: 10.0, fee: 0.8, maxTerm: 36 },
  health: { rate: 6.0, fee: 0.5, maxTerm: 24 },
};

export default function LoansPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loanTypes, setLoanTypes] = useState(fallbackLoanTypes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const fetchLoans = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      await api.get('/loans');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load loans');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchLoanTypes = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get('/loans/types/list');
      if (response.data) {
        setLoanTypes(response.data);
      }
    } catch {
      setLoanTypes(fallbackLoanTypes);
    }
  }, [user]);

  useEffect(() => {
    fetchLoans();
    fetchLoanTypes();
  }, [fetchLoans, fetchLoanTypes]);

  const loanCards = [
    {
      key: 'personal_home',
      title: 'Personal Home Loans',
      description: 'Finance your dream home with competitive rates up to 20 years',
      icon: Home,
    },
    {
      key: 'automobile',
      title: 'Automobile Loans',
      description: 'Get on the road with flexible auto financing up to 6 years',
      icon: Briefcase,
    },
    {
      key: 'business',
      title: 'Business Loans',
      description: 'Grow your business with tailored financing up to 5 years',
      icon: Building2,
    },
    {
      key: 'salary',
      title: 'Salary Loans',
      description: 'Quick short-term loans for salaried individuals',
      icon: Timer,
    },
    {
      key: 'secured_overdraft',
      title: 'Secured Overdraft',
      description: 'Flexible credit facility with collateral backing',
      icon: ShieldCheck,
    },
    {
      key: 'health',
      title: 'Health Finance',
      description: 'Medical financing with compassionate terms',
      icon: HeartPulse,
    },
  ];

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Loan Services</h1>
        <button
          type="button"
          onClick={() => router.push('/dashboard/loans/apply')}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
        >
          + Apply for Loan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Why Choose Our Loan Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <Clock className="w-4 h-4 text-blue-600" />
              Quick Approval
            </div>
            <p className="text-sm text-gray-500">Get a decision within hours and funds within days</p>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <BadgeCheck className="w-4 h-4 text-blue-600" />
              Competitive Rates
            </div>
            <p className="text-sm text-gray-500">Low interest rates tailored to your credit profile</p>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Simple Process
            </div>
            <p className="text-sm text-gray-500">Straightforward application with minimal paperwork</p>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-gray-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Secure & Confidential
            </div>
            <p className="text-sm text-gray-500">Your information is protected with bank-level security</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <BadgeCheck className="w-5 h-5 text-blue-600" />
          Available Loan Types
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loanCards.map((card) => {
            const type = loanTypes[card.key];
            return (
              <div key={card.key} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <card.icon className="w-5 h-5 text-blue-600" />
                  {card.title}
                </div>
                <p className="text-sm text-gray-500 mt-2">{card.description}</p>
                <div className="text-xs text-gray-500 mt-2">
                  Rate: {type?.rate ?? 0}% | Fee: {type?.fee ?? 0}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <BadgeCheck className="w-5 h-5 text-blue-600" />
          How It Works
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <div className="font-semibold text-gray-900">Apply Online</div>
              <div>Complete our simple online application form with your details and loan requirements</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <div className="font-semibold text-gray-900">Quick Review</div>
              <div>Our team reviews your application and may contact you for additional information</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <div className="font-semibold text-gray-900">Approval & Disbursement</div>
              <div>Once approved, the loan amount will be transferred to your account</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-gray-900">Ready to get started?</div>
          <div className="text-sm text-gray-600">Apply now and get a decision on your loan application quickly</div>
        </div>
        <button
          type="button"
          onClick={() => router.push('/dashboard/loans/apply')}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700"
        >
          Apply for a Loan
        </button>
      </div>
    </div>
  );
}
