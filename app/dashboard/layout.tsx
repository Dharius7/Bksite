'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Dashboard/Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Send, Activity, CreditCard, Grid } from 'lucide-react';
import { useEffect, useState } from 'react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const isFormElement = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
    };

    const onFocusIn = (event: FocusEvent) => {
      if (isFormElement(event.target)) setKeyboardOpen(true);
    };

    const onFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement) || !isFormElement(active)) {
          setKeyboardOpen(false);
        }
      }, 80);
    };

    const viewport = window.visualViewport;
    const onViewportResize = () => {
      if (!viewport) return;
      const heightGap = window.innerHeight - viewport.height;
      setKeyboardOpen(heightGap > 140);
    };

    window.addEventListener('focusin', onFocusIn);
    window.addEventListener('focusout', onFocusOut);
    viewport?.addEventListener('resize', onViewportResize);

    return () => {
      window.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('focusout', onFocusOut);
      viewport?.removeEventListener('resize', onViewportResize);
    };
  }, []);

  useEffect(() => {
    const handleOpen = () => setMoreOpen(true);
    window.addEventListener('open-more-sheet', handleOpen);
    return () => window.removeEventListener('open-more-sheet', handleOpen);
  }, []);
  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden pb-20 md:pb-0" data-dashboard-scroll>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className={`mobile-bottom-nav fixed bottom-3 sm:bottom-4 left-1/2 z-50 w-[94%] sm:w-[92%] -translate-x-1/2 rounded-2xl bg-white shadow-lg border border-gray-100 px-3 sm:px-4 py-2 sm:py-2.5 md:hidden ${
          keyboardOpen ? 'hidden' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-1">
          <Link
            href="/dashboard/transfer/local"
            className={`flex flex-col items-center text-[12px] sm:text-sm font-medium min-w-[52px] sm:min-w-[60px] ${
              isActive('/dashboard/transfer/local')
                ? 'text-blue-600 border-2 border-blue-500 rounded-xl px-2 py-1'
                : 'text-black'
            }`}
          >
            <Send
              className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive('/dashboard/transfer/local') ? 'text-blue-600' : 'text-emerald-600'}`}
            />
            <span className="mt-1">Transfer</span>
          </Link>
          <Link
            href="/dashboard/transactions"
            className={`flex flex-col items-center text-[12px] sm:text-sm font-medium min-w-[52px] sm:min-w-[60px] ${
              isActive('/dashboard/transactions')
                ? 'text-blue-600 border-2 border-blue-500 rounded-xl px-2 py-1'
                : 'text-black'
            }`}
          >
            <Activity
              className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive('/dashboard/transactions') ? 'text-blue-600' : 'text-purple-600'}`}
            />
            <span className="mt-1">Activity</span>
          </Link>
          <Link
            href="/dashboard"
            className={`flex flex-col items-center text-[12px] sm:text-sm font-medium min-w-[52px] sm:min-w-[60px] ${
              isActive('/dashboard')
                ? 'text-blue-600 border-2 border-blue-500 rounded-xl px-2 py-1'
                : 'text-black'
            }`}
          >
            <Home
              className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive('/dashboard') ? 'text-blue-600' : 'text-indigo-600'}`}
            />
            <span className="mt-1">Home</span>
          </Link>
          <Link
            href="/dashboard/cards"
            className={`flex flex-col items-center text-[12px] sm:text-sm font-medium min-w-[52px] sm:min-w-[60px] ${
              isActive('/dashboard/cards')
                ? 'text-blue-600 border-2 border-blue-500 rounded-xl px-2 py-1'
                : 'text-black'
            }`}
          >
            <CreditCard
              className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive('/dashboard/cards') ? 'text-blue-600' : 'text-pink-600'}`}
            />
            <span className="mt-1">Cards</span>
          </Link>
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center text-[12px] sm:text-sm font-medium min-w-[52px] sm:min-w-[60px] text-black"
          >
            <Grid className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
            <span className="mt-1">More</span>
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[60vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="text-sm text-gray-700">{user?.email}</div>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="text-xs font-semibold text-gray-400 tracking-wide">MAIN</div>
            <div className="mt-2 space-y-2">
              <Link href="/dashboard" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">🏠</div>
                  <div>
                    <div className="font-semibold text-gray-900">Dashboard</div>
                    <div className="text-xs text-blue-600">Overview & balance</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/dashboard/transactions" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">📈</div>
                  <div>
                    <div className="font-semibold text-gray-900">Transactions</div>
                    <div className="text-xs text-gray-500">View transaction history</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/dashboard/cards" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">💳</div>
                  <div>
                    <div className="font-semibold text-gray-900">Cards</div>
                    <div className="text-xs text-gray-500">Manage your cards</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
            </div>

            <div className="mt-5 text-xs font-semibold text-gray-400 tracking-wide">TRANSFERS</div>
            <div className="mt-2 space-y-2">
              <Link href="/dashboard/transfer/local" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center">✈️</div>
                  <div>
                    <div className="font-semibold text-gray-900">Local Transfer</div>
                    <div className="text-xs text-gray-500">Send to local accounts</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/dashboard/transfer" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">🌐</div>
                  <div>
                    <div className="font-semibold text-gray-900">International</div>
                    <div className="text-xs text-gray-500">Global transfers</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/dashboard/deposit" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">➕</div>
                  <div>
                    <div className="font-semibold text-gray-900">Deposit</div>
                    <div className="text-xs text-gray-500">Add funds to account</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/dashboard/currency-swap" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center">💱</div>
                  <div>
                    <div className="font-semibold text-gray-900">Currency Swap</div>
                    <div className="text-xs text-gray-500">Exchange currencies</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
            </div>

            <div className="mt-5 text-xs font-semibold text-gray-400 tracking-wide">SERVICES</div>
            <div className="mt-2 space-y-2">
              <Link href="/dashboard/loans" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">🏛️</div>
                  <div>
                    <div className="font-semibold text-gray-900">Loans</div>
                    <div className="text-xs text-gray-500">Apply for loans</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
            </div>

            <div className="mt-5 text-xs font-semibold text-gray-400 tracking-wide">ACCOUNT</div>
            <div className="mt-2 space-y-2">
              <Link href="/dashboard/settings" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center">⚙️</div>
                  <div>
                    <div className="font-semibold text-gray-900">Settings</div>
                    <div className="text-xs text-gray-500">Manage your account</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/dashboard/support" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">🎧</div>
                  <div>
                    <div className="font-semibold text-gray-900">Support</div>
                    <div className="text-xs text-gray-500">Get assistance</div>
                  </div>
                </div>
                <span className="text-gray-400">›</span>
              </Link>
              <Link href="/logout" onClick={() => setMoreOpen(false)} className="flex items-center justify-between rounded-2xl border border-red-100 px-4 py-3 text-red-600">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">⎋</div>
                  <div>
                    <div className="font-semibold">Sign Out</div>
                    <div className="text-xs text-red-400">Logout from account</div>
                  </div>
                </div>
                <span className="text-red-400">›</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  );
}
