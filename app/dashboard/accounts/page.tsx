'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AccountsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/accounts');
        setAccounts(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
        <p className="text-gray-600">Bank details and account information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-gray-600">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="text-gray-600">No accounts found.</div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{account.accountType || 'Account'}</div>
                    <div className="text-xs text-gray-500">Account #: {account.accountNumber}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${Number(account.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Status: {account.status || 'active'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
