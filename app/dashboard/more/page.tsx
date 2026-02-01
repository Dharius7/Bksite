'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function MorePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="text-sm text-gray-700">{user?.email}</div>
        </div>

        <div className="text-xs font-semibold text-gray-400 tracking-wide">MAIN</div>
        <div className="mt-2 space-y-2">
          <Link href="/dashboard" className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Dashboard</div>
              <div className="text-xs text-blue-600">Overview & balance</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/dashboard/transactions" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Transactions</div>
              <div className="text-xs text-gray-500">View transaction history</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/dashboard/cards" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Cards</div>
              <div className="text-xs text-gray-500">Manage your cards</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        </div>

        <div className="mt-5 text-xs font-semibold text-gray-400 tracking-wide">TRANSFERS</div>
        <div className="mt-2 space-y-2">
          <Link href="/dashboard/transfer/local" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Local Transfer</div>
              <div className="text-xs text-gray-500">Send to local accounts</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/dashboard/transfer" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">International</div>
              <div className="text-xs text-gray-500">Global transfers</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/dashboard/deposit" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Deposit</div>
              <div className="text-xs text-gray-500">Add funds to account</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/dashboard/currency-swap" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Currency Swap</div>
              <div className="text-xs text-gray-500">Exchange currencies</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        </div>

        <div className="mt-5 text-xs font-semibold text-gray-400 tracking-wide">SERVICES</div>
        <div className="mt-2 space-y-2">
          <Link href="/dashboard/loans" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Loans</div>
              <div className="text-xs text-gray-500">Apply for loans</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
        </div>

        <div className="mt-5 text-xs font-semibold text-gray-400 tracking-wide">ACCOUNT</div>
        <div className="mt-2 space-y-2">
          <Link href="/dashboard/settings" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Settings</div>
              <div className="text-xs text-gray-500">Manage your account</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/dashboard/support" className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
            <div>
              <div className="font-semibold text-gray-900">Support</div>
              <div className="text-xs text-gray-500">Get assistance</div>
            </div>
            <span className="text-gray-400">›</span>
          </Link>
          <Link href="/logout" className="flex items-center justify-between rounded-2xl border border-red-100 px-4 py-3 text-red-600">
            <div>
              <div className="font-semibold">Sign Out</div>
              <div className="text-xs text-red-400">Logout from account</div>
            </div>
            <span className="text-red-400">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
