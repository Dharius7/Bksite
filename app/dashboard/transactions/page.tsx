'use client';

import WavePreloader from '@/components/WavePreloader';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Calendar, CheckCircle2, Clock, Download, Filter, Printer, UserRound, X } from 'lucide-react';

export default function TransactionsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/transactions', {
          params: {
            type: typeFilter || undefined,
            status: statusFilter || undefined,
          },
        });
        setTransactions(response.data?.transactions || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, typeFilter, statusFilter]);

  const formatLabel = (value: string) => {
    const normalized = (value || '').toLowerCase();
    if (!normalized) return 'N/A';
    if (normalized === 'transfer') return 'Transfered';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const statusBadge = (status: string) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'completed' || normalized === 'processed') return 'bg-green-100 text-green-700';
    if (normalized === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (normalized === 'failed') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const typeBadge = (type: string) => {
    const normalized = (type || '').toLowerCase();
    if (normalized === 'credit' || normalized === 'deposit') return 'bg-green-100 text-green-700';
    if (normalized === 'received') return 'bg-green-100 text-green-700';
    if (normalized === 'debit' || normalized === 'transfer') return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  const totalCount = useMemo(() => transactions.length, [transactions]);
  const receiptData = useMemo(() => {
    if (!selectedTx) return null;
    const createdAt = selectedTx.createdAt ? new Date(selectedTx.createdAt) : null;
    const methodLabel =
      selectedTx.metadata?.method ||
      selectedTx.paymentMethod ||
      selectedTx.type ||
      'Transfered';
    const normalizedType = String(selectedTx.type || '').toLowerCase();
    const isReceived = normalizedType === 'received';
    return {
      ...selectedTx,
      createdDate: createdAt ? createdAt.toLocaleDateString() : 'N/A',
      createdTime: createdAt ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      methodLabel,
      recipientName: isReceived
        ? (selectedTx.metadata?.senderName || 'N/A')
        : (selectedTx.metadata?.recipientName || selectedTx.recipientName || 'N/A'),
      recipientAccount: isReceived
        ? (selectedTx.metadata?.senderAccount || 'N/A')
        : (selectedTx.toAccount || selectedTx.recipientAccount || 'N/A'),
    };
  }, [selectedTx]);

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All types</option>
            <option value="deposit">Deposit</option>
            <option value="transfer">Transfer</option>
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
            <option value="received">Received</option>
            <option value="currency_swap">Currency Swap</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="processed">Processed</option>
          </select>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {error && (
          <div className="m-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <WavePreloader fullScreen={false} />
        ) : transactions.length === 0 ? (
          <div className="p-6 text-gray-600">No transactions found.</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-gray-600">
                  <tr className="text-left">
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Reference</th>
                    <th className="px-6 py-3 font-semibold">Description</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-t">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          ${Math.abs(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500">{tx.currency || 'USD'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadge(tx.type)}`}>
                          {formatLabel(tx.type || 'N/A')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(tx.status)}`}>
                          {formatLabel(tx.status || 'N/A')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {tx.reference || tx._id?.slice(0, 12) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{tx.description || 'Ok'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(tx.createdAt).toLocaleDateString()} <br />
                        <span className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3 p-4">
              {transactions.map((tx) => (
                <div key={tx._id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">
                      ${Math.abs(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadge(tx.type)}`}>
                      {formatLabel(tx.type || 'N/A')}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">{tx.currency || 'USD'}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                    <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                    <span className={`rounded-full px-2 py-1 font-semibold ${statusBadge(tx.status)}`}>
                      {formatLabel(tx.status || 'N/A')}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Ref: {tx.reference || tx._id?.slice(0, 12) || 'N/A'}
                  </div>
                  <div className="mt-2 text-sm text-gray-700">{tx.description || 'Ok'}</div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTx(tx)}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t bg-slate-50 px-6 py-4 text-sm text-gray-600">
              Showing {totalCount} to {totalCount} of {totalCount} results
            </div>
          </>
        )}
      </div>

      {receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div className="text-sm font-semibold text-gray-900">Transaction Receipt</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="inline-flex items-center justify-center rounded-full bg-gray-100 w-8 h-8 text-gray-500"
                aria-label="Close receipt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 px-4 sm:px-5 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700"
                >
                  Dashboard
                </button>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="text-lg font-semibold text-gray-900">Transaction Details</div>
                <div className="text-sm text-gray-500">
                  Your account has been {receiptData.type === 'debit' ? 'debited' : 'credited'} with $
                  {Math.abs(receiptData.amount || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  .
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 text-xs text-gray-600">
                  <div className="rounded-xl border border-gray-100 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Transaction Date
                    </div>
                    <div className="mt-1 font-semibold text-gray-900">{receiptData.createdDate}</div>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      Transaction Time
                    </div>
                    <div className="mt-1 font-semibold text-gray-900">{receiptData.createdTime}</div>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-3">
                    <div className="text-gray-500">Payment Method</div>
                    <div className="mt-1 font-semibold text-gray-900 capitalize">
                      {String(receiptData.methodLabel).replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-100 p-3">
                    <div className="text-gray-500">Reference ID</div>
                    <div className="mt-1 font-semibold text-gray-900 break-all">
                      {receiptData.reference || receiptData._id?.slice(0, 12) || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <UserRound className="w-4 h-4" />
                    Recipient Details
                  </div>
                  <div className="mt-2 rounded-xl border border-gray-100 p-3 text-sm text-gray-700">
                    <div className="text-xs text-gray-500">Recipient Name</div>
                    <div className="font-semibold text-gray-900">{receiptData.recipientName}</div>
                    <div className="mt-2 text-xs text-gray-500">Recipient Account</div>
                    <div className="font-semibold text-gray-900">{receiptData.recipientAccount}</div>
                    <div className="mt-2 text-xs text-gray-500">Description</div>
                    <div className="text-gray-700">{receiptData.description || 'Ok'}</div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-sm font-semibold text-gray-900">Financial Details</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-gray-100 p-3">
                      <div className="text-xs text-gray-500">Amount Sent</div>
                      <div className="font-semibold text-gray-900">
                        ${Math.abs(receiptData.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-3">
                      <div className="text-xs text-gray-500">Handling & Charges</div>
                      <div className="font-semibold text-gray-900">
                        ${Number(receiptData.fee || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-center text-xs text-gray-400">
                  This receipt serves as confirmation of this transaction. For any issues, please contact support.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
