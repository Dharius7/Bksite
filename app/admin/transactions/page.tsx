'use client';

import { useEffect, useMemo, useState } from 'react';
import adminApi from '@/lib/adminApi';
import { Download, Filter } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.get('/admin/transactions', {
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

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, statusFilter]);

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
    if (normalized === 'debit' || normalized === 'transfer') return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  const totalCount = useMemo(() => transactions.length, [transactions]);
  const [txPage, setTxPage] = useState(0);
  const txPageSizeDesktop = 10;
  const txPageSizeMobile = 2;

  const pagedTransactionsDesktop = useMemo(
    () =>
      transactions.slice(
        txPage * txPageSizeDesktop,
        txPage * txPageSizeDesktop + txPageSizeDesktop
      ),
    [transactions, txPage]
  );

  const pagedTransactionsMobile = useMemo(
    () =>
      transactions.slice(
        txPage * txPageSizeMobile,
        txPage * txPageSizeMobile + txPageSizeMobile
      ),
    [transactions, txPage]
  );

  const updateStatus = async (id: string, status: string) => {
    await adminApi.patch(`/admin/transactions/${id}`, { status });
    fetchTransactions();
  };

  useEffect(() => {
    setTxPage(0);
  }, [typeFilter, statusFilter]);

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
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setTxPage((prev) => {
                  const total = Math.max(1, Math.ceil(transactions.length / txPageSizeDesktop));
                  return (prev - 1 + total) % total;
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              aria-label="Previous transactions"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() =>
                setTxPage((prev) => {
                  const total = Math.max(1, Math.ceil(transactions.length / txPageSizeDesktop));
                  return (prev + 1) % total;
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              aria-label="Next transactions"
            >
              →
            </button>
          </div>
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
            <option value="cancelled">Cancelled</option>
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
          <div className="p-6 text-gray-600">Loading transactions...</div>
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
                  {pagedTransactionsDesktop.map((tx) => (
                    <tr key={tx._id} className="border-t">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          ${Math.abs(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-gray-500">{tx.currency || 'USD'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadge(tx.type)}`}>
                          {tx.type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(tx.status)}`}>
                          {tx.status || 'N/A'}
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
                        <select
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                          value={tx.status}
                          onChange={(e) => updateStatus(tx._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3 p-4">
              {pagedTransactionsMobile.map((tx) => (
                <div key={tx._id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">
                      ${Math.abs(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadge(tx.type)}`}>
                      {tx.type || 'N/A'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">{tx.currency || 'USD'}</div>
                  <div className="mt-3 text-xs text-gray-600">
                    Ref: {tx.reference || tx._id?.slice(0, 12) || 'N/A'}
                  </div>
                  <div className="mt-2 text-sm text-gray-700">{tx.description || 'Ok'}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                    <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                    <span className={`rounded-full px-2 py-1 font-semibold ${statusBadge(tx.status)}`}>{tx.status || 'N/A'}</span>
                  </div>
                  <div className="mt-3">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-full"
                      value={tx.status}
                      onChange={(e) => updateStatus(tx._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:hidden px-4 pb-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setTxPage((prev) => {
                    const total = Math.max(1, Math.ceil(transactions.length / txPageSizeMobile));
                    return (prev - 1 + total) % total;
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                aria-label="Previous transactions"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() =>
                  setTxPage((prev) => {
                    const total = Math.max(1, Math.ceil(transactions.length / txPageSizeMobile));
                    return (prev + 1) % total;
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                aria-label="Next transactions"
              >
                →
              </button>
            </div>

            <div className="border-t bg-slate-50 px-6 py-4 text-sm text-gray-600">
              Showing {totalCount} to {totalCount} of {totalCount} results
            </div>
          </>
        )}
      </div>
    </div>
  );
}
