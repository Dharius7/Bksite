'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  TrendingUp,
  Send,
  Plus,
  CreditCard,
  RefreshCw,
  Building2,
  PiggyBank,
  FileText,
  HandCoins,
  Settings,
  MessageCircle,
  User,
  LogOut,
  Activity,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => pathname === path;

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Transactions', path: '/dashboard/transactions', icon: Activity },
  ];

  const servicesNav = [
    { name: 'Transfer', path: '/dashboard/transfer', icon: Send },
    { name: 'Deposit', path: '/dashboard/deposit', icon: Plus },
    { name: 'Cards', path: '/dashboard/cards', icon: CreditCard },
    { name: 'Currency Swap', path: '/dashboard/currency-swap', icon: RefreshCw },
    { name: 'Loans', path: '/dashboard/loans', icon: Building2 },
    { name: 'Save & Invest', path: '/dashboard/investments', icon: PiggyBank },
  ];

  const accountNav = [
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Support', path: '/dashboard/support', icon: MessageCircle },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <>
<<<<<<< HEAD
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white text-gray-800 rounded-lg shadow-sm border border-gray-200"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

=======
>>>>>>> b2ccfa7 (First Update commit)
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <div className="text-orange-600 font-bold text-sm">CORAL CREDIT</div>
                <div className="text-gray-600 text-xs">PRIVATE BANKING LTD.</div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user ? getInitials(user.firstName, user.lastName) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.accountId || 'N/A'}
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              user?.kycStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user?.kycStatus === 'approved' ? '✓ KYC Approved' : '⏳ KYC Pending / On Hold'}
            </div>
            <div className="flex gap-2 mt-3">
              <Link
                href="/dashboard/profile"
                className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-center"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* MAIN */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">MAIN</div>
              <nav className="space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {isActive(item.path) && (
                        <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* SERVICES */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">SERVICES</div>
              <nav className="space-y-1">
                {servicesNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {isActive(item.path) && (
                        <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* ACCOUNT */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">ACCOUNT</div>
              <nav className="space-y-1">
                {accountNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {isActive(item.path) && (
                        <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </aside>
    </>
  );
}
