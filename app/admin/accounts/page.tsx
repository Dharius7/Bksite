'use client';

import WavePreloader from '@/components/WavePreloader';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import adminApi from '@/lib/adminApi';
import { Wallet, Plus } from 'lucide-react';

type Account = any;
type User = any;

function AdminAccountsContent() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [modalType, setModalType] = useState<
    'create' | 'edit' | 'deposit' | 'transfer' | 'debit' | 'received' | 'message' | null
  >(null);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ssn: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bahamas',
    accountType: 'checking',
    initialDeposit: '',
    password: '',
    currency: 'USD',
    status: 'active',
  });

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountType: 'checking',
    currency: 'USD',
    balance: '',
    bitcoinBalance: '',
    status: 'active',
  });

  const [depositForm, setDepositForm] = useState({
    depositorName: '',
    depositType: 'bank',
    accountNumber: '',
    amount: '',
    description: '',
    date: '',
  });
  const [transferForm, setTransferForm] = useState({
    toAccount: '',
    recipientName: '',
    amount: '',
    description: '',
    method: 'wire',
    date: '',
  });
  const [receiveForm, setReceiveForm] = useState({
    senderAccount: '',
    senderName: '',
    amount: '',
    description: '',
    date: '',
  });
  const [debitForm, setDebitForm] = useState({ amount: '', description: '', date: '' });
  const [messageForm, setMessageForm] = useState({ transferMessage: '' });
  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const [accountsRes, usersRes] = await Promise.all([
        adminApi.get('/admin/accounts'),
        adminApi.get('/admin/users'),
      ]);
      setAccounts(accountsRes.data?.accounts || []);
      setUsers(usersRes.data?.users || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openEdit = useCallback((account: Account) => {
    setSelectedAccount(account);
    setEditForm({
      firstName: account.userId?.firstName || '',
      lastName: account.userId?.lastName || '',
      email: account.userId?.email || '',
      phone: account.userId?.phone || '',
      accountType: account.accountType || 'checking',
      currency: account.currency || 'USD',
      balance: String(account.balance ?? ''),
      bitcoinBalance: String(account.bitcoinBalance ?? ''),
      status: account.status || 'active',
    });
    setModalType('edit');
  }, []);

  const openDeposit = useCallback((account: Account) => {
    setSelectedAccount(account);
    setDepositForm({
      depositorName: '',
      depositType: 'bank',
      accountNumber: '',
      amount: '',
      description: '',
      date: '',
    });
    setModalType('deposit');
  }, []);

  const openTransfer = useCallback((account: Account) => {
    setSelectedAccount(account);
    setTransferForm({ toAccount: '', recipientName: '', amount: '', description: '', method: 'wire', date: '' });
    setModalType('transfer');
  }, []);

  const openDebit = useCallback((account: Account) => {
    setSelectedAccount(account);
    setDebitForm({ amount: '', description: '', date: '' });
    setModalType('debit');
  }, []);

  const openReceived = useCallback((account: Account) => {
    setSelectedAccount(account);
    setReceiveForm({ senderAccount: '', senderName: '', amount: '', description: '', date: '' });
    setModalType('received');
  }, []);

  const openMessage = useCallback((account: Account) => {
    setSelectedAccount(account);
    setMessageForm({ transferMessage: account.transferMessage || '' });
    setModalType('message');
  }, []);

  const closeModal = () => {
    setModalType(null);
    setSelectedAccount(null);
  };

  const createAccount = async () => {
    try {
      await adminApi.post('/admin/accounts/create-user', {
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        email: createForm.email,
        phone: createForm.phone,
        ssn: createForm.ssn,
        dateOfBirth: createForm.dateOfBirth,
        password: createForm.password,
        address: {
          street: createForm.address,
          city: createForm.city,
          state: createForm.state,
          zipCode: createForm.zipCode,
          country: createForm.country,
        },
        accountType: createForm.accountType,
        initialDeposit: Number(createForm.initialDeposit || 0),
        currency: createForm.currency,
        status: createForm.status,
      });
      setMessage('Account created');
      setModalType(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account');
    }
  };

  const updateAccount = async (accountId: string, updates: any) => {
    await adminApi.patch(`/admin/accounts/${accountId}`, updates);
    fetchData();
  };

  const updateUser = async (userId: string, updates: any) => {
    await adminApi.patch(`/admin/users/${userId}`, updates);
    fetchData();
  };

  const saveEdit = async () => {
    if (!selectedAccount) return;
    try {
      await updateUser(selectedAccount.userId?._id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
      });
      await updateAccount(selectedAccount._id, {
        accountType: editForm.accountType,
        currency: editForm.currency,
        balance: Number(editForm.balance || 0),
        bitcoinBalance: Number(editForm.bitcoinBalance || 0),
        status: editForm.status,
      });
      setMessage('Account updated');
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update account');
    }
  };

  const submitDeposit = async () => {
    if (!selectedAccount) return;
    try {
      if (!depositForm.depositorName.trim()) {
        setError('Depositor name is required');
        return;
      }
      if (!depositForm.amount || Number(depositForm.amount) <= 0) {
        setError('Enter a valid amount');
        return;
      }
      if (depositForm.depositType === 'bank' && !depositForm.accountNumber.trim()) {
        setError('Account number is required for bank deposits');
        return;
      }
      await adminApi.post(`/admin/accounts/${selectedAccount._id}/deposit`, {
        depositorName: depositForm.depositorName,
        depositType: depositForm.depositType,
        accountNumber: depositForm.depositType === 'bank' ? depositForm.accountNumber : undefined,
        amount: Number(depositForm.amount || 0),
        description: depositForm.description || 'Admin deposit',
        date: depositForm.date || undefined,
      });
      setMessage('Deposit completed');
      closeModal();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Deposit failed');
    }
  };

  const submitTransfer = async () => {
    if (!selectedAccount) return;
    try {
      await adminApi.post(`/admin/accounts/${selectedAccount._id}/transfer`, {
        toAccount: transferForm.toAccount,
        recipientName: transferForm.recipientName,
        amount: Number(transferForm.amount || 0),
        description: transferForm.description || 'Admin transfer',
        method: transferForm.method,
        date: transferForm.date || undefined,
      });
      setMessage('Transfer completed');
      closeModal();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transfer failed');
    }
  };

  const submitDebit = async () => {
    if (!selectedAccount) return;
    try {
      await adminApi.post(`/admin/accounts/${selectedAccount._id}/debit`, {
        amount: Number(debitForm.amount || 0),
        description: debitForm.description || 'Admin debit',
        date: debitForm.date || undefined,
      });
      setMessage('Debit completed');
      closeModal();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Debit failed');
    }
  };

  const submitReceived = async () => {
    if (!selectedAccount) return;
    try {
      if (!receiveForm.senderName.trim()) {
        setError('Sender name is required');
        return;
      }
      if (!receiveForm.senderAccount.trim()) {
        setError('Sender account is required');
        return;
      }
      if (!receiveForm.amount || Number(receiveForm.amount) <= 0) {
        setError('Enter a valid amount');
        return;
      }
      await adminApi.post(`/admin/accounts/${selectedAccount._id}/receive`, {
        senderName: receiveForm.senderName,
        senderAccount: receiveForm.senderAccount,
        amount: Number(receiveForm.amount || 0),
        description: receiveForm.description || 'Received transfer',
        date: receiveForm.date || undefined,
      });
      setMessage('Received payment added');
      closeModal();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add received payment');
    }
  };

  const saveMessage = async () => {
    if (!selectedAccount) return;
    try {
      await updateAccount(selectedAccount._id, { transferMessage: messageForm.transferMessage });
      setMessage('Message updated');
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update message');
    }
  };

  const deleteAccount = useCallback(async (accountId: string) => {
    const ok = window.confirm('Delete this account? This action cannot be undone.');
    if (!ok) return;
    await adminApi.delete(`/admin/accounts/${accountId}`);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const accountId = searchParams.get('accountId');
    const action = searchParams.get('action');
    if (!accountId || !action || accounts.length === 0) return;
    const account = accounts.find((acct) => acct._id === accountId);
    if (!account) return;

    if (action === 'edit') {
      openEdit(account);
      return;
    }
    if (action === 'deposit') {
      openDeposit(account);
      return;
    }
    if (action === 'transfer') {
      openTransfer(account);
      return;
    }
    if (action === 'debit') {
      openDebit(account);
      return;
    }
    if (action === 'received') {
      openReceived(account);
      return;
    }
    if (action === 'message') {
      openMessage(account);
      return;
    }
    if (action === 'delete') {
      deleteAccount(account._id);
    }
  }, [searchParams, accounts, deleteAccount, openDebit, openDeposit, openEdit, openMessage, openReceived, openTransfer]);

  const statusOptions = ['active', 'dormant', 'hold', 'frozen', 'closed'];


  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl px-4 py-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-800">Accounts</h1>
            <p className="text-sm text-gray-600">Balances, crypto, and status</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-white"
          >
            Back to Overview
          </a>
          <button
            type="button"
            onClick={() => setModalType('create')}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Create New Account
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
          {message}
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg overflow-hidden border border-slate-100 relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
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
              {accounts.map((acct) => (
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
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="text-xs text-blue-600" onClick={() => openEdit(acct)}>Edit</button>
                      <button className="text-xs text-red-600" onClick={() => deleteAccount(acct._id)}>Delete</button>
                      <button className="text-xs text-emerald-600" onClick={() => openDeposit(acct)}>Deposit</button>
                      <button className="text-xs text-indigo-600" onClick={() => openTransfer(acct)}>Transfer</button>
                      <button className="text-xs text-emerald-600" onClick={() => openDebit(acct)}>Debit</button>
                      <button className="text-xs text-sky-600" onClick={() => openReceived(acct)}>Received</button>
                      <button className="text-xs text-amber-600" onClick={() => openMessage(acct)}>Message</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3 p-4">
          {accounts.map((acct) => (
            <div key={acct._id} className="rounded-3xl border border-gray-100 p-4 bg-white/80 shadow-sm">
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
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="text-xs text-blue-600" onClick={() => openEdit(acct)}>Edit</button>
                <button className="text-xs text-red-600" onClick={() => deleteAccount(acct._id)}>Delete</button>
                <button className="text-xs text-emerald-600" onClick={() => openDeposit(acct)}>Deposit</button>
                <button className="text-xs text-indigo-600" onClick={() => openTransfer(acct)}>Transfer</button>
                <button className="text-xs text-emerald-600" onClick={() => openDebit(acct)}>Debit</button>
                <button className="text-xs text-sky-600" onClick={() => openReceived(acct)}>Received</button>
                <button className="text-xs text-amber-600" onClick={() => openMessage(acct)}>Message</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            {modalType === 'create' && (
              <>
                <h2 className="text-lg font-semibold text-emerald-800">Create New Account</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="First Name"
                      value={createForm.firstName}
                      onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    />
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Last Name"
                      value={createForm.lastName}
                      onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    />
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Phone"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="SSN"
                      value={createForm.ssn}
                      onChange={(e) => setCreateForm({ ...createForm, ssn: e.target.value })}
                    />
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={createForm.dateOfBirth}
                      onChange={(e) => setCreateForm({ ...createForm, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Street Address"
                    value={createForm.address}
                    onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="City"
                      value={createForm.city}
                      onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                    />
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="State"
                      value={createForm.state}
                      onChange={(e) => setCreateForm({ ...createForm, state: e.target.value })}
                    />
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Zip Code"
                      value={createForm.zipCode}
                      onChange={(e) => setCreateForm({ ...createForm, zipCode: e.target.value })}
                    />
                  </div>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Country"
                    value={createForm.country}
                    onChange={(e) => setCreateForm({ ...createForm, country: e.target.value })}
                  />
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={createForm.accountType}
                    onChange={(e) => setCreateForm({ ...createForm, accountType: e.target.value })}
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="high-yield">High Yield</option>
                  </select>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Initial Deposit"
                    value={createForm.initialDeposit}
                    onChange={(e) => setCreateForm({ ...createForm, initialDeposit: e.target.value })}
                  />
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  />
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={createForm.currency}
                    onChange={(e) => setCreateForm({ ...createForm, currency: e.target.value })}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={createForm.status}
                    onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80" onClick={closeModal}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={createAccount}>Create</button>
                </div>
              </>
            )}

            {modalType === 'edit' && selectedAccount && (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Edit Account</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} placeholder="First Name" />
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} placeholder="Last Name" />
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email" />
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Phone" />
                  <select className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.accountType} onChange={(e) => setEditForm({ ...editForm, accountType: e.target.value })}>
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="high-yield">High Yield</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.currency} onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.balance} onChange={(e) => setEditForm({ ...editForm, balance: e.target.value })} placeholder="Balance" />
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.bitcoinBalance} onChange={(e) => setEditForm({ ...editForm, bitcoinBalance: e.target.value })} placeholder="Bitcoin Balance" />
                  <select className="border border-gray-300 rounded-lg px-3 py-2" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80" onClick={closeModal}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={saveEdit}>Save</button>
                </div>
              </>
            )}

            {modalType === 'deposit' && (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Deposit to Account</h2>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Depositor's Name"
                  value={depositForm.depositorName}
                  onChange={(e) => setDepositForm({ ...depositForm, depositorName: e.target.value })}
                />
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={depositForm.depositType}
                  onChange={(e) => setDepositForm({ ...depositForm, depositType: e.target.value })}
                >
                  <option value="bank">Bank Deposit</option>
                  <option value="check">Check Deposit</option>
                </select>
                {depositForm.depositType === 'bank' && (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Account Number"
                    value={depositForm.accountNumber}
                    onChange={(e) => setDepositForm({ ...depositForm, accountNumber: e.target.value })}
                  />
                )}
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Amount"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Description"
                  value={depositForm.description}
                  onChange={(e) => setDepositForm({ ...depositForm, description: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  type="datetime-local"
                  value={depositForm.date}
                  onChange={(e) => setDepositForm({ ...depositForm, date: e.target.value })}
                />
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80" onClick={closeModal}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white" onClick={submitDeposit}>Deposit</button>
                </div>
              </>
            )}

            {modalType === 'transfer' && (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Transfer from Account</h2>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Recipient Name" value={transferForm.recipientName} onChange={(e) => setTransferForm({ ...transferForm, recipientName: e.target.value })} />
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Destination Account Number" value={transferForm.toAccount} onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })} />
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Amount" value={transferForm.amount} onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })} />
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Description" value={transferForm.description} onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })} />
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" type="datetime-local" value={transferForm.date} onChange={(e) => setTransferForm({ ...transferForm, date: e.target.value })} />
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2" value={transferForm.method} onChange={(e) => setTransferForm({ ...transferForm, method: e.target.value })}>
                  <option value="wire">Wire</option>
                  <option value="paypal">PayPal</option>
                  <option value="cashapp">Cash App</option>
                  <option value="crypto">Crypto</option>
                  <option value="wise">Wise</option>
                  <option value="zelle">Zelle</option>
                </select>
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80" onClick={closeModal}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white" onClick={submitTransfer}>Transfer</button>
                </div>
              </>
            )}

            {modalType === 'debit' && (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Debit Account</h2>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Amount" value={debitForm.amount} onChange={(e) => setDebitForm({ ...debitForm, amount: e.target.value })} />
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Description" value={debitForm.description} onChange={(e) => setDebitForm({ ...debitForm, description: e.target.value })} />
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2" type="datetime-local" value={debitForm.date} onChange={(e) => setDebitForm({ ...debitForm, date: e.target.value })} />
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80" onClick={closeModal}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white" onClick={submitDebit}>Debit</button>
                </div>
              </>
            )}

            {modalType === 'received' && (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Received Payment</h2>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Sender Account Number"
                  value={receiveForm.senderAccount}
                  onChange={(e) => setReceiveForm({ ...receiveForm, senderAccount: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Sender Name"
                  value={receiveForm.senderName}
                  onChange={(e) => setReceiveForm({ ...receiveForm, senderName: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Amount"
                  value={receiveForm.amount}
                  onChange={(e) => setReceiveForm({ ...receiveForm, amount: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Description"
                  value={receiveForm.description}
                  onChange={(e) => setReceiveForm({ ...receiveForm, description: e.target.value })}
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  type="datetime-local"
                  value={receiveForm.date}
                  onChange={(e) => setReceiveForm({ ...receiveForm, date: e.target.value })}
                />
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80" onClick={closeModal}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-sky-600 text-white" onClick={submitReceived}>Add Received</button>
                </div>
              </>
            )}

            {modalType === 'message' && (
              <>
                <h2 className="text-lg font-semibold text-gray-900">Transfer Message</h2>
                <p className="text-sm text-gray-500">This message will display when a user confirms a transfer.</p>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[120px]"
                  placeholder="Fraud detected so account is on hold..."
                  value={messageForm.transferMessage}
                  onChange={(e) => setMessageForm({ transferMessage: e.target.value })}
                />
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80" onClick={closeModal}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-amber-600 text-white" onClick={saveMessage}>Save</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAccountsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <WavePreloader />
        </div>
      }
    >
      <AdminAccountsContent />
    </Suspense>
  );
}
