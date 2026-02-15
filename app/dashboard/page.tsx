'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Send,
  Plus,
  ArrowDown,
  Grid,
  RefreshCw,
  Clock,
  Shield,
  ArrowRight,
  ArrowDownRight,
  Building2,
  MessageCircle,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardData {
  account: {
    accountNumber: string;
    balance: number;
    bitcoinBalance: number;
    currency: string;
    accountType?: string;
    status?: string;
  };
  userStatus?: string;
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobileHeaderHidden, setIsMobileHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

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

  useEffect(() => {
    const scrollContainer =
      (document.querySelector('[data-dashboard-scroll]') as HTMLElement | null) ||
      document.documentElement;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentY = scrollContainer.scrollTop || 0;
        const isMobile = window.innerWidth < 768;
        const delta = currentY - lastScrollYRef.current;
        const shouldHide = isMobile && currentY > 80 && delta > 6;
        const shouldShow = delta < -6 || currentY <= 80;

        if (shouldHide) {
          setIsMobileHeaderHidden(true);
        } else if (shouldShow) {
          setIsMobileHeaderHidden(false);
        }

        lastScrollYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    lastScrollYRef.current = scrollContainer.scrollTop || 0;
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

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
  const effectiveStatus = account?.status || dashboardData?.userStatus;
  const stats = dashboardData?.stats;
  const recentTransactions = dashboardData?.recentTransactions || [];

  const accountTypeLabel = (type?: string) => {
    switch ((type || '').toLowerCase()) {
      case 'business':
        return 'Business Account';
      case 'personal':
        return 'Personal Account';
      case 'inheritance':
        return 'Inheritance Account';
      case 'primary':
        return 'Primary Account';
      case 'checking':
        return 'Checking Account';
      case 'savings':
        return 'Savings Account';
      case 'high-yield':
        return 'High-Yield Account';
      default:
        return 'Account';
    }
  };

  const statusLabel = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'Account Active';
      case 'dormant':
        return 'Account Dormant';
      case 'hold':
        return 'Account Hold';
      case 'frozen':
        return 'Account Frozen';
      case 'closed':
        return 'Account Closed';
      default:
        return 'Account Active';
    }
  };

  const statusDot = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'bg-green-400';
      case 'dormant':
        return 'bg-yellow-400';
      case 'hold':
        return 'bg-orange-400';
      case 'frozen':
        return 'bg-sky-400';
      case 'closed':
        return 'bg-gray-400';
      default:
        return 'bg-green-400';
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div
        className={`bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-4 fixed top-0 right-0 left-0 lg:left-64 z-30 transition-transform duration-300 md:translate-y-0 ${
          isMobileHeaderHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="sm:hidden min-w-0">
              <div className="flex items-start gap-2 min-w-0">
                <span className="relative h-8 w-8 rounded-lg overflow-hidden ring-1 ring-slate-200 shrink-0">
                  <Image
                    src="/images/Logo.png"
                    alt="Orine Credit logo"
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </span>
                <div className="min-w-0">
                  <h1 className="text-sm font-bold text-gray-900 truncate">Orine Credit</h1>
                  <p className="text-[10px] text-gray-600 truncate mt-0 leading-tight">Welcome back, {user.firstName}</p>
                </div>
              </div>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-base sm:text-2xl font-bold text-gray-900 truncate">Dashboard</h1>
              <p className="text-xs sm:text-base text-gray-600 truncate">Welcome back, {user.firstName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="hidden md:block text-sm text-left">
                  <div className="font-semibold text-gray-900">{user.firstName}</div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-20">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </Link>
                  <Link
                    href="/dashboard/support"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <HelpCircle className="w-4 h-4 text-gray-500" />
                    Support
                  </Link>
                  <Link
                    href="/logout"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-xl"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[68px] sm:h-[88px]" />
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Account Card */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <div className="bg-[#2E4077] rounded-2xl p-2 md:p-6 text-white shadow-xl">
              <div className="flex items-start justify-between gap-3 mb-1 md:mb-4">
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 mb-0.5">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm opacity-90 truncate">Orine Credit Bank LTD</span>
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">{accountTypeLabel(account?.accountType)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] sm:text-xs opacity-75 mb-0.5">ACCOUNT NUMBER</div>
                  <div className="text-sm sm:text-base font-mono">****** {account?.accountNumber?.slice(-4) || '0000'}</div>
                </div>
              </div>

              <div className="mb-1 md:mb-4">
                <div className="text-xs sm:text-sm opacity-90">
                  Account Holder:{' '}
                  <span className="text-base sm:text-lg font-semibold">{user.firstName} {user.lastName}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-0.5 md:mb-3">
                <div className="flex items-center space-x-2 text-[11px] sm:text-sm">
                  <span className={`w-2 h-2 rounded-full ${statusDot(effectiveStatus)}`}></span>
                  <span>{statusLabel(effectiveStatus)}</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] sm:text-sm">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Verified & Secured</span>
                </div>
              </div>

              <div className="mb-2 md:mb-5">
                <div className="flex gap-2 md:gap-4 overflow-x-auto snap-x snap-mandatory pb-0.5 md:pb-2 md:overflow-visible md:block hide-scrollbar">
                  <div className="w-full min-w-[100%] md:min-w-0 snap-start bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4">
                    <div className="text-xs sm:text-sm opacity-90 mb-0.5">Available Balance</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold">
                      ${(account?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="w-full min-w-[100%] md:min-w-0 snap-start rounded-lg p-2 md:p-0">
                    <div className="text-xs sm:text-sm opacity-90 mb-0.5">Fiat Balance</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                      ${(account?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs opacity-75">USD Balance</div>
                  </div>

                  <div className="w-full min-w-[100%] md:min-w-0 snap-start rounded-lg p-2 md:p-0">
                    <div className="text-xs sm:text-sm opacity-90 mb-0.5">Bitcoin Balance</div>
                    <div className="text-sm sm:text-base md:text-lg font-semibold">
                      {(account?.bitcoinBalance || 0).toFixed(8)} BTC
                    </div>
                    <div className="text-xs opacity-75">
                      ~ ${((account?.bitcoinBalance || 0) * bitcoinRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs opacity-60 mt-1">- 1 BTC = ${bitcoinRate.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-0.5 text-[11px] opacity-70 md:hidden">Swipe to view balances</div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
                <Link
                  href="/dashboard/deposit"
                  className="w-full bg-white/20 backdrop-blur-sm text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-white/30 transition flex items-center justify-center space-x-2 border border-white/30 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add Money</span>
                </Link>
                <Link
                  href="/dashboard/transfer"
                  className="w-full bg-white text-blue-600 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Money</span>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              {/* Mobile quick actions row */}
              <div className="md:hidden grid grid-cols-5 gap-3">
                <Link href="/dashboard/deposit" className="text-center">
                  <div className="w-11 h-11 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center mx-auto shadow-sm">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-900">Top Up</div>
                </Link>
                <Link href="/dashboard/transfer" className="text-center">
                  <div className="w-11 h-11 rounded-full bg-gray-700 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-900">Send</div>
                </Link>
                <Link href="/dashboard/investments" className="text-center">
                  <div className="w-11 h-11 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto shadow-sm">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-900">Invest</div>
                </Link>
                <Link href="/dashboard/transactions" className="text-center">
                  <div className="w-11 h-11 rounded-full bg-gray-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-900">Receive</div>
                </Link>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('open-more-sheet'))}
                  className="text-center"
                >
                  <div className="w-11 h-11 rounded-full bg-gray-700 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-900">More</div>
                </button>
              </div>

              {/* Mobile financial services row */}
              <div className="md:hidden mt-4">
                <div className="text-[clamp(1rem,3vw,1.125rem)] font-semibold text-gray-900 mb-3">
                  Financial Services
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Building2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[clamp(0.95rem,2.5vw,1rem)] font-semibold text-gray-900">Loans</div>
                        <div className="text-[clamp(0.75rem,2.2vw,0.875rem)] text-gray-500">Quick approval</div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/loans"
                      className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-2 py-1.5 text-[clamp(0.8rem,2.4vw,0.95rem)] font-semibold text-white"
                    >
                      Apply Now
                    </Link>
                  </div>
                  <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <TrendingUp className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[clamp(0.95rem,2.5vw,1rem)] font-semibold text-gray-900">Save & Invest</div>
                        <div className="text-[clamp(0.75rem,2.2vw,0.875rem)] text-gray-500">Grow your funds</div>
                      </div>
                    </div>
                    <Link
                      href="/dashboard/investments"
                      className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-2 py-1.5 text-[clamp(0.8rem,2.4vw,0.95rem)] font-semibold text-white"
                    >
                      Invest Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Desktop quick actions grid */}
              <div className="hidden md:grid md:grid-cols-4 gap-4">
                <Link href="/dashboard/transfer" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Transfer Money</div>
                </Link>
                <Link href="/dashboard/investments" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Save & Invest</div>
                </Link>
                <Link href="/dashboard/loans" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Loans</div>
                </Link>
                <Link href="/dashboard/accounts" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">Bank Details</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-500">This Month</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">$0.00</div>
                <div className="text-xs sm:text-sm text-gray-600">Referral Bonuses</div>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-500">This Month</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">${(stats?.monthlyDeposits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs sm:text-sm text-gray-600">Monthly Deposits</div>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-500">This Month</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">${(stats?.monthlyExpenses || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs sm:text-sm text-gray-600">Monthly Expenses</div>
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-500">All Time</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">${(stats?.totalVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Volume</div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="order-3 lg:order-3 space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              {recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No recent transactions</div>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-[640px] lg:min-w-[720px] text-sm lg:text-base">
                      <thead className="bg-slate-50 text-gray-600">
                        <tr className="text-left">
                          <th className="px-4 lg:px-6 py-3 font-semibold whitespace-nowrap">Amount</th>
                          <th className="px-4 lg:px-6 py-3 font-semibold whitespace-nowrap">Type</th>
                          <th className="px-4 lg:px-6 py-3 font-semibold whitespace-nowrap">Status</th>
                          <th className="px-4 lg:px-6 py-3 font-semibold whitespace-nowrap">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.slice(0, 5).map((tx: any) => (
                          <tr key={tx._id} className="border-t">
                            <td className="px-4 lg:px-6 py-3">
                              <div className="font-semibold text-gray-900">
                                ${Math.abs(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className="text-xs text-gray-500">{tx.currency || 'USD'}</div>
                            </td>
                            <td className="px-4 lg:px-6 py-3">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadge(tx.type)}`}>
                                {tx.type || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(tx.status)}`}>
                                {tx.status || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 lg:px-6 py-3 text-gray-600">
                              {new Date(tx.createdAt).toLocaleDateString()} <br />
                              <span className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleTimeString()}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-3 p-4">
                    {recentTransactions.slice(0, 5).map((tx: any) => (
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
                          <Link
                            href="/dashboard/transactions"
                            className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
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
