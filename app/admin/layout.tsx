'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  BarChart3,
  Shield,
  Wallet,
  CreditCard,
  FileText,
  LifeBuoy,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/admin', icon: BarChart3 },
  { name: 'Users', path: '/admin#users', icon: Users },
  { name: 'Accounts', path: '/admin/accounts', icon: Wallet },
  { name: 'Transactions', path: '/admin/transactions', icon: FileText },
  { name: 'Cards', path: '/admin#cards', icon: CreditCard },
  { name: 'Loans & Investments', path: '/admin#loans', icon: Shield },
  { name: 'Support', path: '/admin#support', icon: LifeBuoy },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const adminInitials = useMemo(() => {
    if (typeof window === 'undefined') return 'A';
    try {
      const stored = localStorage.getItem('admin');
      if (!stored) return 'A';
      const admin = JSON.parse(stored);
      const name = admin?.name || admin?.email || 'Admin';
      const parts = name.split(' ');
      const first = parts[0]?.[0] || 'A';
      const last = parts[1]?.[0] || '';
      return `${first}${last}`.toUpperCase();
    } catch {
      return 'A';
    }
  }, []);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-slate-200 bg-white">
          <div className="px-6 py-6 border-b border-slate-200">
            <div className="text-xs uppercase text-slate-400 font-semibold">Admin Portal</div>
            <div className="text-lg font-bold text-slate-900">Coral Credit Bank</div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="px-4 py-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  localStorage.removeItem('admin');
                  router.push('/admin/login');
                }}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-slate-50 border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-end">
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm"
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {adminInitials}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg">
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 rounded-t-xl"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('admin_token');
                      localStorage.removeItem('admin');
                      router.push('/admin/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50 rounded-b-xl"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="pt-[68px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
