'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import adminApi from '@/lib/adminApi';
import WavePreloader from '@/components/WavePreloader';
import {
  Users,
  Wallet,
  FileText,
  CreditCard,
  Shield,
  BarChart3,
  LifeBuoy,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

type Overview = {
  users: number;
  accounts: number;
  transactions: number;
  cards: number;
  loans: number;
  investments: number;
  tickets: number;
  otpCount: number;
  transferCount: number;
  depositCount: number;
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
  if (normalized === 'debit' || normalized === 'transfer') return 'bg-red-100 text-red-700';
  return 'bg-blue-100 text-blue-700';
};

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [txFiltersOpen, setTxFiltersOpen] = useState(false);
  const [txTypeFilter, setTxTypeFilter] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('');
  const [userPage, setUserPage] = useState(0);
  const [accountPage, setAccountPage] = useState(0);
  const [cardPage, setCardPage] = useState(0);
  const [loanPage, setLoanPage] = useState(0);
  const [investmentPage, setInvestmentPage] = useState(0);
  const [ticketPage, setTicketPage] = useState(0);
  const [activityPage, setActivityPage] = useState(0);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [
        overviewRes,
        usersRes,
        accountsRes,
        transactionsRes,
        cardsRes,
        loansRes,
        investmentsRes,
        ticketsRes,
        activitiesRes,
      ] = await Promise.all([
        adminApi.get('/admin/overview'),
        adminApi.get('/admin/users'),
        adminApi.get('/admin/accounts'),
        adminApi.get('/admin/transactions', {
          params: {
            type: txTypeFilter || undefined,
            status: txStatusFilter || undefined,
          },
        }),
        adminApi.get('/admin/cards'),
        adminApi.get('/admin/loans'),
        adminApi.get('/admin/investments'),
        adminApi.get('/admin/support-tickets'),
        adminApi.get('/admin/activities', { params: { limit: 20 } }),
      ]);

      setOverview(overviewRes.data);
      setUsers(usersRes.data?.users || []);
      setAccounts(accountsRes.data?.accounts || []);
      setTransactions(transactionsRes.data?.transactions || []);
      setCards(cardsRes.data?.cards || []);
      setLoans(loansRes.data?.loans || []);
      setInvestments(investmentsRes.data?.investments || []);
      setTickets(ticketsRes.data?.tickets || []);
      setActivities(activitiesRes.data?.activities || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [txTypeFilter, txStatusFilter]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setTxPage(0);
  }, [txTypeFilter, txStatusFilter]);

  useEffect(() => {
    setUserPage(0);
  }, [users.length]);

  useEffect(() => {
    setAccountPage(0);
  }, [accounts.length]);

  useEffect(() => {
    setCardPage(0);
  }, [cards.length]);

  useEffect(() => {
    setLoanPage(0);
  }, [loans.length]);

  useEffect(() => {
    setInvestmentPage(0);
  }, [investments.length]);

  useEffect(() => {
    setTicketPage(0);
  }, [tickets.length]);

  useEffect(() => {
    setActivityPage(0);
  }, [activities.length]);

  const updateUser = async (id: string, updates: any) => {
    await adminApi.patch(`/admin/users/${id}`, updates);
    fetchAll();
  };

  const updateAccount = async (id: string, updates: any) => {
    await adminApi.patch(`/admin/accounts/${id}`, updates);
    fetchAll();
  };

  const updateTransaction = async (id: string, status: string) => {
    await adminApi.patch(`/admin/transactions/${id}`, { status });
    fetchAll();
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    await adminApi.delete(`/admin/users/${id}`);
    fetchAll();
  };

  const deleteCard = async (id: string) => {
    if (!confirm('Delete this card? This cannot be undone.')) return;
    await adminApi.delete(`/admin/cards/${id}`);
    fetchAll();
  };

  const deleteLoan = async (id: string) => {
    if (!confirm('Delete this loan record?')) return;
    await adminApi.delete(`/admin/loans/${id}`);
    fetchAll();
  };

  const deleteInvestment = async (id: string) => {
    if (!confirm('Delete this investment record?')) return;
    await adminApi.delete(`/admin/investments/${id}`);
    fetchAll();
  };

  const deleteTicket = async (id: string) => {
    if (!confirm('Delete this support ticket?')) return;
    await adminApi.delete(`/admin/support-tickets/${id}`);
    fetchAll();
  };

  const deleteActivity = async (id: string) => {
    if (!confirm('Delete this activity log?')) return;
    await adminApi.delete(`/admin/activities/${id}`);
    fetchAll();
  };

  const [txPage, setTxPage] = useState(0);

  const txPageSizeDesktop = 5;
  const txPageSizeMobile = 2;
  const pageSize = 5;

  const pagedUsers = useMemo(
    () => users.slice(userPage * pageSize, userPage * pageSize + pageSize),
    [users, userPage]
  );

  const pagedAccounts = useMemo(
    () => accounts.slice(accountPage * pageSize, accountPage * pageSize + pageSize),
    [accounts, accountPage]
  );

  const pagedCards = useMemo(
    () => cards.slice(cardPage * pageSize, cardPage * pageSize + pageSize),
    [cards, cardPage]
  );

  const pagedLoans = useMemo(
    () => loans.slice(loanPage * pageSize, loanPage * pageSize + pageSize),
    [loans, loanPage]
  );

  const pagedInvestments = useMemo(
    () => investments.slice(investmentPage * pageSize, investmentPage * pageSize + pageSize),
    [investments, investmentPage]
  );

  const pagedTickets = useMemo(
    () => tickets.slice(ticketPage * pageSize, ticketPage * pageSize + pageSize),
    [tickets, ticketPage]
  );

  const pagedActivities = useMemo(
    () => activities.slice(activityPage * pageSize, activityPage * pageSize + pageSize),
    [activities, activityPage]
  );

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

  const updateCard = async (id: string, status: string) => {
    await adminApi.patch(`/admin/cards/${id}`, { status });
    fetchAll();
  };

  const updateLoan = async (id: string, status: string) => {
    await adminApi.patch(`/admin/loans/${id}`, { status });
    fetchAll();
  };

  const updateInvestment = async (id: string, status: string) => {
    await adminApi.patch(`/admin/investments/${id}`, { status });
    fetchAll();
  };

  const updateTicket = async (id: string, status: string) => {
    await adminApi.patch(`/admin/support-tickets/${id}`, { status });
    fetchAll();
  };

  const statusClass = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'dormant':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      case 'hold':
        return 'border-orange-200 bg-orange-50 text-orange-700';
      case 'frozen':
        return 'border-sky-200 bg-sky-50 text-sky-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const typeClass = (type?: string) => {
    switch ((type || '').toLowerCase()) {
      case 'business':
        return 'border-indigo-200 bg-indigo-50 text-indigo-700';
      case 'personal':
        return 'border-teal-200 bg-teal-50 text-teal-700';
      case 'inheritance':
        return 'border-purple-200 bg-purple-50 text-purple-700';
      case 'primary':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const kycClass = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'approved':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'pending':
        return 'border-amber-200 bg-amber-50 text-amber-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  const cardsSummary = useMemo(
    () => [
      { label: 'Users', value: overview?.users ?? 0, icon: Users, color: 'bg-blue-100 text-blue-700' },
      { label: 'Accounts', value: overview?.accounts ?? 0, icon: Wallet, color: 'bg-emerald-100 text-emerald-700' },
      { label: 'Transactions', value: overview?.transactions ?? 0, icon: FileText, color: 'bg-indigo-100 text-indigo-700' },
      { label: 'Cards', value: overview?.cards ?? 0, icon: CreditCard, color: 'bg-purple-100 text-purple-700' },
      { label: 'OTP', value: overview?.otpCount ?? 0, icon: Shield, color: 'bg-rose-100 text-rose-700' },
      { label: 'Loans', value: overview?.loans ?? 0, icon: Shield, color: 'bg-amber-100 text-amber-700' },
      { label: 'Investments', value: overview?.investments ?? 0, icon: BarChart3, color: 'bg-pink-100 text-pink-700' },
      { label: 'Tickets', value: overview?.tickets ?? 0, icon: LifeBuoy, color: 'bg-sky-100 text-sky-700' },
    ],
    [overview]
  );

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage users, accounts, and platform activity</p>
        </div>
        <button
          type="button"
          onClick={fetchAll}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700"
        >
          Refresh
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <WavePreloader />
      ) : (
        <>
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {cardsSummary.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-3 md:p-4 border border-slate-100 hover:shadow-xl transition"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-base md:text-xl font-bold text-gray-900">{item.value}</div>
                  <div className="text-[11px] md:text-xs text-gray-500">{item.label}</div>
                </div>
              );
            })}
          </div>

          <section id="users" className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-4 md:p-6 border border-slate-100 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 rounded-2xl px-4 py-3 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-blue-800">Users</h2>
                  <p className="text-xs text-gray-500">Manage roles, KYC, and status</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(users.length / pageSize));
                    setUserPage((prev) => (prev - 1 + total) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Previous users"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(users.length / pageSize));
                    setUserPage((prev) => (prev + 1) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Next users"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">KYC</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                    <th className="py-2">OTP</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((user) => {
                    const account =
                      accounts.find((acct) => acct.userId?._id === user._id && acct.isPrimary) ||
                      accounts.find((acct) => acct.userId?._id === user._id) ||
                      null;
                    return (
                      <tr key={user._id} className="border-t">
                        <td className="py-2">{user.firstName} {user.lastName}</td>
                        <td className="py-2">{user.email}</td>
                        <td className="py-2">{user.role}</td>
                        <td className="py-2">
                          <select
                            className={`rounded-lg px-2 py-1 text-xs font-semibold ${kycClass(user.kycStatus)}`}
                            value={user.kycStatus || 'pending'}
                            onChange={(e) => updateUser(user._id, { kycStatus: e.target.value })}
                          >
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                        <td className="py-2 text-xs text-gray-700">{user.accountStatus || 'active'}</td>
                        <td className="py-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {account?._id ? (
                            <Link
                              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                              href={`/admin/accounts?accountId=${account._id}&action=edit`}
                            >
                              Edit
                            </Link>
                            ) : (
                              <span className="text-xs text-gray-400">No account</span>
                            )}
                            <select
                              className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusClass(user.accountStatus)}`}
                              value={user.accountStatus || 'active'}
                              onChange={async (e) => {
                                const next = e.target.value;
                                await updateUser(user._id, { accountStatus: next });
                                if (account?._id) {
                                  await updateAccount(account._id, { status: next });
                                }
                              }}
                            >
                              <option value="active">Account Active</option>
                              <option value="dormant">Account Dormant</option>
                              <option value="hold">Account Hold</option>
                              <option value="frozen">Account Frozen</option>
                            </select>
                            <select
                              className={`rounded-lg px-2 py-1 text-xs font-semibold ${typeClass(account?.accountType)}`}
                              value={account?.accountType || 'personal'}
                              onChange={(e) => {
                                if (!account?._id) return;
                                updateAccount(account._id, { accountType: e.target.value });
                              }}
                            >
                              <option value="business">Business Account</option>
                              <option value="personal">Personal Account</option>
                              <option value="inheritance">Inheritance Account</option>
                              <option value="primary">Primary Account</option>
                            </select>
                            <button
                              className="text-xs font-semibold text-red-600 hover:text-red-700"
                              onClick={() => deleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                        <td className="py-2 text-xs font-mono text-gray-700">
                          {user.otpCode || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {pagedUsers.map((user) => {
                const account =
                  accounts.find((acct) => acct.userId?._id === user._id && acct.isPrimary) ||
                  accounts.find((acct) => acct.userId?._id === user._id) ||
                  null;
              return (
                <div key={user._id} className="rounded-xl border border-gray-100 p-4 bg-slate-50">
                  <div className="font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  <div className="mt-2 text-xs text-gray-600">Role: {user.role}</div>
                  <div className="mt-3 flex flex-col gap-3">
                      <label className="text-xs text-gray-500">KYC</label>
                      <select
                        className={`rounded-lg px-2 py-2 text-xs font-semibold ${kycClass(user.kycStatus)}`}
                        value={user.kycStatus || 'pending'}
                        onChange={(e) => updateUser(user._id, { kycStatus: e.target.value })}
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                      </select>
                      <div className="text-xs text-gray-600">Status: {user.accountStatus || 'active'}</div>
                      <label className="text-xs text-gray-500">Action</label>
                      <div className="flex flex-col gap-2">
                        {account?._id && (
                          <Link
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                            href={`/admin/accounts?accountId=${account._id}&action=edit`}
                          >
                            Edit
                          </Link>
                        )}
                        <select
                          className={`rounded-lg px-2 py-2 text-xs font-semibold ${statusClass(user.accountStatus)}`}
                          value={user.accountStatus || 'active'}
                          onChange={async (e) => {
                            const next = e.target.value;
                            await updateUser(user._id, { accountStatus: next });
                            if (account?._id) {
                              await updateAccount(account._id, { status: next });
                            }
                          }}
                        >
                          <option value="active">Account Active</option>
                          <option value="dormant">Account Dormant</option>
                          <option value="hold">Account Hold</option>
                          <option value="frozen">Account Frozen</option>
                        </select>
                        <select
                          className={`rounded-lg px-2 py-2 text-xs font-semibold ${typeClass(account?.accountType)}`}
                          value={account?.accountType || 'personal'}
                          onChange={(e) => {
                            if (!account?._id) return;
                            updateAccount(account._id, { accountType: e.target.value });
                          }}
                        >
                          <option value="business">Business Account</option>
                          <option value="personal">Personal Account</option>
                          <option value="inheritance">Inheritance Account</option>
                          <option value="primary">Primary Account</option>
                        </select>
                      <button
                        className="text-xs font-semibold text-red-600"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    OTP: <span className="font-mono">{user.otpCode || '—'}</span>
                  </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section id="accounts" className="bg-white/90 backdrop-blur rounded-3xl shadow-lg overflow-hidden border border-slate-100 relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-emerald-800">Accounts</h2>
                  <p className="text-xs text-gray-500">Balances, crypto, and status</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(accounts.length / pageSize));
                    setAccountPage((prev) => (prev - 1 + total) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Previous accounts"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(accounts.length / pageSize));
                    setAccountPage((prev) => (prev + 1) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Next accounts"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-gray-600">
                  <tr className="text-left">
                    <th className="px-6 py-3 font-semibold">Account</th>
                    <th className="px-6 py-3 font-semibold">Owner</th>
                    <th className="px-6 py-3 font-semibold">Balance</th>
                    <th className="px-6 py-3 font-semibold">BTC</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedAccounts.map((acct) => (
                    <tr key={acct._id} className="border-t">
                      <td className="px-6 py-4 font-mono text-xs text-gray-700">{acct.accountNumber}</td>
                      <td className="px-6 py-4 text-gray-900">{acct.userId?.firstName} {acct.userId?.lastName}</td>
                      <td className="px-6 py-4 text-gray-900">${(acct.balance || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700">{(acct.bitcoinBalance || 0).toFixed(8)}</td>
                      <td className="px-6 py-4">
                        <select
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                          value={acct.status}
                          onChange={(e) => updateAccount(acct._id, { status: e.target.value })}
                        >
                          <option value="active">active</option>
                          <option value="frozen">frozen</option>
                          <option value="closed">closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link className="text-xs text-blue-600" href={`/admin/accounts?accountId=${acct._id}&action=edit`}>Edit</Link>
                          <Link className="text-xs text-emerald-600" href={`/admin/accounts?accountId=${acct._id}&action=deposit`}>Deposit</Link>
                          <Link className="text-xs text-indigo-600" href={`/admin/accounts?accountId=${acct._id}&action=transfer`}>Transfer</Link>
                          <Link className="text-xs text-emerald-700" href={`/admin/accounts?accountId=${acct._id}&action=debit`}>Debit</Link>
                          <Link className="text-xs text-sky-600" href={`/admin/accounts?accountId=${acct._id}&action=received`}>Received</Link>
                          <Link className="text-xs text-amber-600" href={`/admin/accounts?accountId=${acct._id}&action=message`}>Message</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3 p-4">
              {pagedAccounts.map((acct) => (
                <div key={acct._id} className="rounded-2xl border border-gray-100 p-4 bg-slate-50">
                  <div className="font-semibold text-gray-900">{acct.accountNumber}</div>
                  <div className="text-xs text-gray-500">{acct.userId?.firstName} {acct.userId?.lastName}</div>
                  <div className="mt-2 text-sm text-gray-700">Balance: ${(acct.balance || 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-700">BTC: {(acct.bitcoinBalance || 0).toFixed(8)}</div>
                  <div className="mt-2">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-full"
                      value={acct.status}
                      onChange={(e) => updateAccount(acct._id, { status: e.target.value })}
                    >
                      <option value="active">active</option>
                      <option value="frozen">frozen</option>
                      <option value="closed">closed</option>
                    </select>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link className="text-xs text-blue-600" href={`/admin/accounts?accountId=${acct._id}&action=edit`}>Edit</Link>
                    <Link className="text-xs text-emerald-600" href={`/admin/accounts?accountId=${acct._id}&action=deposit`}>Deposit</Link>
                    <Link className="text-xs text-indigo-600" href={`/admin/accounts?accountId=${acct._id}&action=transfer`}>Transfer</Link>
                    <Link className="text-xs text-emerald-700" href={`/admin/accounts?accountId=${acct._id}&action=debit`}>Debit</Link>
                    <Link className="text-xs text-sky-600" href={`/admin/accounts?accountId=${acct._id}&action=received`}>Received</Link>
                    <Link className="text-xs text-amber-600" href={`/admin/accounts?accountId=${acct._id}&action=message`}>Message</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="transactions" className="bg-white/90 backdrop-blur rounded-3xl shadow-lg overflow-hidden border border-slate-100 relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-fuchsia-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-indigo-800">Transactions</h2>
                  <p className="text-xs text-gray-500">Monitor and change statuses</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTxFiltersOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Filter
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
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
                    <ChevronLeft className="w-4 h-4" />
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
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {txFiltersOpen && (
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex flex-col md:flex-row gap-3">
                  <select
                    value={txTypeFilter}
                    onChange={(e) => setTxTypeFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All types</option>
                    <option value="deposit">Deposit</option>
                    <option value="transfer">Transfer</option>
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                    <option value="currency_swap">Currency Swap</option>
                  </select>

                  <select
                    value={txStatusFilter}
                    onChange={(e) => setTxStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">All statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            )}
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
                          onChange={(e) => updateTransaction(tx._id, e.target.value)}
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
                <div key={tx._id} className="rounded-2xl border border-gray-100 p-4 bg-slate-50">
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
                      onChange={(e) => updateTransaction(tx._id, e.target.value)}
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
                <ChevronLeft className="w-4 h-4" />
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
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          <section id="activities" className="bg-white/90 backdrop-blur rounded-3xl shadow-lg overflow-hidden border border-slate-100 relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 via-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-sky-800">Activities</h2>
                  <p className="text-xs text-gray-500">Recent logins and access details</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(activities.length / pageSize));
                    setActivityPage((prev) => (prev - 1 + total) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Previous activities"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(activities.length / pageSize));
                    setActivityPage((prev) => (prev + 1) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Next activities"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-gray-600">
                  <tr className="text-left">
                    <th className="px-6 py-3 font-semibold">Account</th>
                    <th className="px-6 py-3 font-semibold">User</th>
                    <th className="px-6 py-3 font-semibold">IP</th>
                    <th className="px-6 py-3 font-semibold">Location</th>
                    <th className="px-6 py-3 font-semibold">Login Date</th>
                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedActivities.map((activity) => (
                    <tr key={activity._id} className="border-t">
                      <td className="px-6 py-4 font-mono text-xs text-gray-700">
                        {activity.accountId?.accountNumber || activity.userId?.accountId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {activity.userId?.firstName} {activity.userId?.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{activity.ipAddress}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {[activity.location?.city, activity.location?.region, activity.location?.country]
                          .filter(Boolean)
                          .join(', ') || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(activity.createdAt).toLocaleDateString()} <br />
                        <span className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="text-xs text-red-600 inline-flex items-center gap-1"
                          onClick={() => deleteActivity(activity._id)}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3 p-4">
              {pagedActivities.map((activity) => (
                <div key={activity._id} className="rounded-2xl border border-gray-100 p-4 bg-slate-50">
                  <div className="font-semibold text-gray-900">
                    {activity.userId?.firstName} {activity.userId?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{activity.userId?.email}</div>
                  <div className="mt-2 text-xs text-gray-600">Account: {activity.accountId?.accountNumber || activity.userId?.accountId || 'N/A'}</div>
                  <div className="text-xs text-gray-600">IP: {activity.ipAddress}</div>
                  <div className="text-xs text-gray-600">
                    Location: {[activity.location?.city, activity.location?.region, activity.location?.country].filter(Boolean).join(', ') || 'Unknown'}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString()} {new Date(activity.createdAt).toLocaleTimeString()}
                  </div>
                  <button
                    className="mt-3 text-xs text-red-600 inline-flex items-center gap-1"
                    onClick={() => deleteActivity(activity._id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section id="cards" className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-4 md:p-6 border border-slate-100 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 rounded-2xl px-4 py-3 bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-purple-800">Cards</h2>
                  <p className="text-xs text-gray-500">Freeze, block, or activate cards</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(cards.length / pageSize));
                    setCardPage((prev) => (prev - 1 + total) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Previous cards"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(cards.length / pageSize));
                    setCardPage((prev) => (prev + 1) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Next cards"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2">Owner</th>
                    <th className="py-2">Card</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedCards.map((card) => (
                    <tr key={card._id} className="border-t">
                      <td className="py-2">{card.userId?.email || 'N/A'}</td>
                      <td className="py-2">{card.cardNumber?.slice(-4)}</td>
                      <td className="py-2">{card.cardType}</td>
                      <td className="py-2">{card.status}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-3">
                          <select
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                            value={card.status}
                            onChange={(e) => updateCard(card._id, e.target.value)}
                          >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                            <option value="blocked">blocked</option>
                            <option value="expired">expired</option>
                            <option value="pending">pending</option>
                          </select>
                          <button
                            className="text-xs text-red-600 inline-flex items-center gap-1"
                            onClick={() => deleteCard(card._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {pagedCards.map((card) => (
                <div key={card._id} className="rounded-xl border border-gray-100 p-4 bg-slate-50">
                  <div className="font-semibold text-gray-900">**** {card.cardNumber?.slice(-4)}</div>
                  <div className="text-xs text-gray-500">{card.userId?.email || 'N/A'}</div>
                  <div className="mt-2 text-xs text-gray-600">Type: {card.cardType}</div>
                  <div className="text-xs text-gray-600">Status: {card.status}</div>
                  <div className="mt-3 flex flex-wrap gap-3 items-center">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                      value={card.status}
                      onChange={(e) => updateCard(card._id, e.target.value)}
                    >
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                      <option value="blocked">blocked</option>
                      <option value="expired">expired</option>
                      <option value="pending">pending</option>
                    </select>
                    <button
                      className="text-xs text-red-600 inline-flex items-center gap-1"
                      onClick={() => deleteCard(card._id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="loans" className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-4 md:p-6 border border-slate-100 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 rounded-2xl px-4 py-3 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-800">Loans</h2>
                  <p className="text-xs text-gray-500">Approve or reject loan applications</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(loans.length / pageSize));
                    setLoanPage((prev) => (prev - 1 + total) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Previous loans"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(loans.length / pageSize));
                    setLoanPage((prev) => (prev + 1) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Next loans"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2">User</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedLoans.map((loan) => (
                    <tr key={loan._id} className="border-t">
                      <td className="py-2">{loan.userId?.email || 'N/A'}</td>
                      <td className="py-2">{loan.loanType}</td>
                      <td className="py-2">${loan.amount?.toLocaleString()}</td>
                      <td className="py-2">{loan.status}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-3">
                          <select
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                            value={loan.status}
                            onChange={(e) => updateLoan(loan._id, e.target.value)}
                          >
                            <option value="pending">pending</option>
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                            <option value="active">active</option>
                            <option value="paid">paid</option>
                            <option value="defaulted">defaulted</option>
                          </select>
                          <button
                            className="text-xs text-red-600 inline-flex items-center gap-1"
                            onClick={() => deleteLoan(loan._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {pagedLoans.map((loan) => (
                <div key={loan._id} className="rounded-xl border border-gray-100 p-4 bg-slate-50">
                  <div className="font-semibold text-gray-900">${loan.amount?.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{loan.userId?.email || 'N/A'}</div>
                  <div className="mt-2 text-xs text-gray-600">Type: {loan.loanType}</div>
                  <div className="text-xs text-gray-600">Status: {loan.status}</div>
                  <div className="mt-3 flex flex-wrap gap-3 items-center">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                      value={loan.status}
                      onChange={(e) => updateLoan(loan._id, e.target.value)}
                    >
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>
                      <option value="active">active</option>
                      <option value="paid">paid</option>
                      <option value="defaulted">defaulted</option>
                    </select>
                    <button
                      className="text-xs text-red-600 inline-flex items-center gap-1"
                      onClick={() => deleteLoan(loan._id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-8 mb-4 rounded-2xl px-4 py-3 bg-gradient-to-r from-pink-50 via-rose-50 to-fuchsia-50 border border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-pink-800">Investments</h2>
                  <p className="text-xs text-gray-500">Manage investment statuses</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(investments.length / pageSize));
                    setInvestmentPage((prev) => (prev - 1 + total) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Previous investments"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(investments.length / pageSize));
                    setInvestmentPage((prev) => (prev + 1) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Next investments"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2">User</th>
                    <th className="py-2">Plan</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedInvestments.map((inv) => (
                    <tr key={inv._id} className="border-t">
                      <td className="py-2">{inv.userId?.email || 'N/A'}</td>
                      <td className="py-2">{inv.planName}</td>
                      <td className="py-2">${inv.amount?.toLocaleString()}</td>
                      <td className="py-2">{inv.status}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-3">
                          <select
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                            value={inv.status}
                            onChange={(e) => updateInvestment(inv._id, e.target.value)}
                          >
                            <option value="pending">pending</option>
                            <option value="active">active</option>
                            <option value="matured">matured</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                          <button
                            className="text-xs text-red-600 inline-flex items-center gap-1"
                            onClick={() => deleteInvestment(inv._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {pagedInvestments.map((inv) => (
                <div key={inv._id} className="rounded-xl border border-gray-100 p-4 bg-slate-50">
                  <div className="font-semibold text-gray-900">${inv.amount?.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{inv.userId?.email || 'N/A'}</div>
                  <div className="mt-2 text-xs text-gray-600">Plan: {inv.planName}</div>
                  <div className="text-xs text-gray-600">Status: {inv.status}</div>
                  <div className="mt-3 flex flex-wrap gap-3 items-center">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                      value={inv.status}
                      onChange={(e) => updateInvestment(inv._id, e.target.value)}
                    >
                      <option value="pending">pending</option>
                      <option value="active">active</option>
                      <option value="matured">matured</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <button
                      className="text-xs text-red-600 inline-flex items-center gap-1"
                      onClick={() => deleteInvestment(inv._id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="support" className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-4 md:p-6 border border-slate-100 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 rounded-2xl px-4 py-3 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 border border-cyan-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-cyan-800">Support Tickets</h2>
                  <p className="text-xs text-gray-500">Resolve user issues faster</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(tickets.length / pageSize));
                    setTicketPage((prev) => (prev - 1 + total) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Previous tickets"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const total = Math.max(1, Math.ceil(tickets.length / pageSize));
                    setTicketPage((prev) => (prev + 1) % total);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  aria-label="Next tickets"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-2">User</th>
                    <th className="py-2">Title</th>
                    <th className="py-2">Priority</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedTickets.map((ticket) => (
                    <tr key={ticket._id} className="border-t">
                      <td className="py-2">{ticket.userId?.email || 'N/A'}</td>
                      <td className="py-2">{ticket.title}</td>
                      <td className="py-2">{ticket.priority}</td>
                      <td className="py-2">{ticket.status}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-3">
                          <select
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                            value={ticket.status}
                            onChange={(e) => updateTicket(ticket._id, e.target.value)}
                          >
                            <option value="open">open</option>
                            <option value="in_progress">in_progress</option>
                            <option value="resolved">resolved</option>
                          </select>
                          <button
                            className="text-xs text-red-600 inline-flex items-center gap-1"
                            onClick={() => deleteTicket(ticket._id)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {pagedTickets.map((ticket) => (
                <div key={ticket._id} className="rounded-xl border border-gray-100 p-4 bg-slate-50">
                  <div className="font-semibold text-gray-900">{ticket.title}</div>
                  <div className="text-xs text-gray-500">{ticket.userId?.email || 'N/A'}</div>
                  <div className="mt-2 text-xs text-gray-600">Priority: {ticket.priority}</div>
                  <div className="text-xs text-gray-600">Status: {ticket.status}</div>
                  <div className="mt-3 flex flex-wrap gap-3 items-center">
                    <select
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                      value={ticket.status}
                      onChange={(e) => updateTicket(ticket._id, e.target.value)}
                    >
                      <option value="open">open</option>
                      <option value="in_progress">in_progress</option>
                      <option value="resolved">resolved</option>
                    </select>
                    <button
                      className="text-xs text-red-600 inline-flex items-center gap-1"
                      onClick={() => deleteTicket(ticket._id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
