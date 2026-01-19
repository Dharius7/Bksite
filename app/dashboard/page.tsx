'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Send,
  Plus,
  RefreshCw,
  Clock,
  Shield,
  ArrowRight,
  ArrowDownRight,
  Building2,
  HandCoins,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  account: {
    accountNumber: string;
    balance: number;
    bitcoinBalance: number;
    currency: string;
  };
  stats: {
    monthlyDeposits: number;
    monthlyExpenses: number;
    totalVolume: number;
    pendingTransactions: number;
  };
  recentTransactions: any[];
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bitcoinRate, setBitcoinRate] = useState(94655);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, rateRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/currency-swap/rate').catch(() => ({ data: { rate: 94655 } })),
        ]);

        setDashboardData(dashboardRes.data);
        setBitcoinRate(rateRes.data.rate || 94655);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const account = dashboardData?.account;
  const stats = dashboardData?.stats;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.firstName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{user.firstName}</div>
                <div className="text-gray-500">{user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">$0.00</div>
            <div className="text-sm text-gray-600">Referral Bonuses</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${(stats?.monthlyDeposits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-sm text-gray-600">Monthly Deposits</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${(stats?.monthlyExpenses || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-sm text-gray-600">Monthly Expenses</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-xs text-gray-500">All Time</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${(stats?.totalVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="text-sm text-gray-600">Total Volume</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Account Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm opacity-90">Coral Credit Bank LTD</span>
                  </div>
                  <div className="text-sm opacity-90">Primary Account</div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-75 mb-1">ACCOUNT NUMBER</div>
                  <div className="text-lg font-mono">****** {account?.accountNumber?.slice(-4) || '0000'}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm opacity-90 mb-1">Account Holder</div>
                <div className="text-xl font-semibold">{user.firstName} {user.lastName}</div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-sm">Account Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Verified & Secured</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="text-sm opacity-90 mb-2">Available Balance</div>
                <div className="text-4xl font-bold">
                  ${(account?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm opacity-90 mb-1">Fiat Balance</div>
                <div className="text-3xl font-bold">
                  ${(account?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm opacity-75">USD Balance</div>
              </div>

              <div className="mb-6">
                <div className="text-sm opacity-90 mb-1">Bitcoin Balance</div>
                <div className="text-lg font-semibold">
                  {(account?.bitcoinBalance || 0).toFixed(8)} BTC
                </div>
                <div className="text-sm opacity-75">
                  ≈ ${((account?.bitcoinBalance || 0) * bitcoinRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs opacity-60 mt-1">• 1 BTC = ${bitcoinRate.toLocaleString()}</div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/dashboard/transfer"
                  className="flex-1 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Money</span>
                </Link>
                <Link
                  href="/dashboard/deposit"
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition flex items-center justify-center space-x-2 border border-white/30"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Money</span>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/dashboard/transfer" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Transfer Money</div>
                </Link>
                <Link href="/dashboard/investments" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Save & Invest</div>
                </Link>
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition text-center cursor-pointer">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <HandCoins className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Request</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition text-center cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Bank Details</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {dashboardData?.recentTransactions?.slice(0, 3).map((transaction: any) => (
                  <div key={transaction._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' || transaction.amount > 0
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' || transaction.amount > 0 ? (
                          <ArrowDownRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      transaction.type === 'credit' || transaction.amount > 0
                        ? 'text-green-600'
                        : 'text-gray-900'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-4">No recent transactions</div>
                )}
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-600">PENDING TRANSACTIONS</span>
                    </div>
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    ${(stats?.pendingTransactions || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500">Awaiting processing</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-600">TOTAL VOLUME</span>
                    </div>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    ${(stats?.totalVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500">All-time transactions</div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-blue-600 pt-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated in real-time</span>
                </div>
              </div>
            </div>

            {/* Need Assistance */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Need Assistance?</h3>
                  <p className="text-sm text-gray-600">Our expert support team is available</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm text-blue-600 font-semibold">24/7 Live Support</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <Clock className="w-5 h-5 text-gray-600 mb-2" />
                  <div className="text-xs font-semibold text-gray-900">Quick Response</div>
                  <div className="text-xs text-gray-500">&lt; 5 minutes</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <Shield className="w-5 h-5 text-green-600 mb-2" />
                  <div className="text-xs font-semibold text-gray-900">Secure Chat</div>
                  <div className="text-xs text-gray-500">Encrypted</div>
                </div>
              </div>
              <Link
                href="/dashboard/support"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Live Chat</span>
              </Link>
              <p className="text-xs text-gray-500 text-center mt-2">Or call us directly for urgent matters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
