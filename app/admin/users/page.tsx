'use client';

import { useEffect, useMemo, useState } from 'react';
import adminApi from '@/lib/adminApi';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

type User = any;
type Account = any;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 5;

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, accountsRes] = await Promise.all([
        adminApi.get('/admin/users'),
        adminApi.get('/admin/accounts'),
      ]);
      setUsers(usersRes.data?.users || []);
      setAccounts(accountsRes.data?.accounts || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [users.length]);

  const pagedUsers = useMemo(
    () => users.slice(page * pageSize, page * pageSize + pageSize),
    [users, page]
  );

  const findAccount = (userId: string) => {
    const primary = accounts.find((acct) => acct.userId?._id === userId && acct.isPrimary);
    return primary || accounts.find((acct) => acct.userId?._id === userId) || null;
  };

  const updateUser = async (userId: string, updates: any) => {
    await adminApi.patch(`/admin/users/${userId}`, updates);
    fetchData();
  };

  const updateAccount = async (accountId: string, updates: any) => {
    await adminApi.patch(`/admin/accounts/${accountId}`, updates);
    fetchData();
  };

  const deleteUser = async (userId: string) => {
    const ok = window.confirm('Delete this user? This action cannot be undone.');
    if (!ok) return;
    await adminApi.delete(`/admin/users/${userId}`);
    fetchData();
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

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl px-4 py-3 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">Users</h1>
          <p className="text-gray-600 text-sm">Manage roles, KYC, and status</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const total = Math.max(1, Math.ceil(users.length / pageSize));
              setPage((prev) => (prev - 1 + total) % total);
            }}
            className="inline-flex items-center gap-1 rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-white"
            aria-label="Previous users"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const total = Math.max(1, Math.ceil(users.length / pageSize));
              setPage((prev) => (prev + 1) % total);
            }}
            className="inline-flex items-center gap-1 rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-white"
            aria-label="Next users"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading users...</div>
      ) : (
        <section className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-4 md:p-6 border border-slate-100 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500" />
          <div className="flex items-center gap-3 mb-4 rounded-2xl px-4 py-3 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-800">Users</h2>
              <p className="text-xs text-gray-500">Manage roles, KYC, and status</p>
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
                  const account = findAccount(user._id);
                  return (
                    <tr key={user._id} className="border-t">
                      <td className="py-2">{user.firstName} {user.lastName}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{user.role}</td>
                      <td className="py-2">
                        <select
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
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
                          <select
                            className={`rounded-lg px-2 py-1 text-xs font-semibold ${kycClass(user.kycStatus)}`}
                            value={user.kycStatus || 'pending'}
                            onChange={(e) => updateUser(user._id, { kycStatus: e.target.value })}
                          >
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => deleteUser(user._id)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700"
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
              const account = findAccount(user._id);
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
                        type="button"
                        onClick={() => deleteUser(user._id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
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
      )}
    </div>
  );
}
