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
  Menu,
  X,
  UserPlus,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/admin', icon: BarChart3 },
  { name: 'Users', path: '/admin/users', icon: Users },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [createAdminError, setCreateAdminError] = useState('');
  const [createAdminSuccess, setCreateAdminSuccess] = useState('');

  const navColors: Record<string, string> = {
    Overview: 'bg-indigo-100 text-indigo-700',
    Users: 'bg-blue-100 text-blue-700',
    Accounts: 'bg-emerald-100 text-emerald-700',
    Transactions: 'bg-purple-100 text-purple-700',
    Cards: 'bg-violet-100 text-violet-700',
    'Loans & Investments': 'bg-amber-100 text-amber-700',
    Support: 'bg-cyan-100 text-cyan-700',
  };

  useEffect(() => {
    const token =
      localStorage.getItem('admin_token') ||
      sessionStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const [adminInitials, setAdminInitials] = useState('A');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin');
      if (!stored) return;
      const admin = JSON.parse(stored);
      const name = admin?.name || admin?.email || 'Admin';
      const parts = String(name).split(' ');
      const first = parts[0]?.[0] || 'A';
      const last = parts[1]?.[0] || '';
      setAdminInitials(`${first}${last}`.toUpperCase());
    } catch {
      setAdminInitials('A');
    }
  }, []);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex min-w-0 w-full">
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-slate-200 bg-white/80 backdrop-blur">
          <div className="px-6 py-6 border-b border-slate-200 bg-gradient-to-r from-white via-blue-50 to-indigo-50">
            <div className="text-xs uppercase text-slate-400 font-semibold">Admin Portal</div>
            <div className="text-lg font-bold text-slate-900">Orine Credit Bank</div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:shadow-sm"
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
              onClick={() => setCreateAdminOpen(true)}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              <UserPlus className="w-4 h-4" />
              Add Admin
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin');
                  router.push('/admin/login');
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 min-h-screen min-w-0 w-full">
          <div className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-white/70 backdrop-blur border-b border-slate-200 px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4 text-indigo-600" />
              Menu
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-2 py-1 shadow-sm"
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

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="absolute top-0 left-0 h-full w-72 bg-white/95 backdrop-blur border-r border-slate-200 shadow-2xl flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-slate-400 font-semibold">Admin Portal</div>
                <div className="text-lg font-bold text-slate-900">Orine Credit Bank</div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${navColors[item.name] || 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 py-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCreateAdminOpen(true);
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                <UserPlus className="w-4 h-4" />
                Add Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  localStorage.removeItem('admin');
                  router.push('/admin/login');
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {createAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900">Create Admin</div>
                  <div className="text-xs text-gray-500">Name and password only</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateAdminOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createAdminError && (
              <div className="mb-3 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                {createAdminError}
              </div>
            )}
            {createAdminSuccess && (
              <div className="mb-3 rounded-lg bg-green-50 border border-green-200 text-green-700 px-3 py-2 text-sm">
                {createAdminSuccess}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="Admin name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="admin@orinecredit.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="Admin password"
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  setCreateAdminError('');
                  setCreateAdminSuccess('');
                  try {
                    const adminApi = (await import('@/lib/adminApi')).default;
                    const response = await adminApi.post('/admin/create-admin', {
                      name: adminName,
                      email: adminEmail,
                      password: adminPassword,
                    });
                    setCreateAdminSuccess(
                      `Admin created. Login email: ${response.data?.admin?.email || 'created'}`
                    );
                    setAdminName('');
                    setAdminEmail('');
                    setAdminPassword('');
                  } catch (err: any) {
                    setCreateAdminError(err.response?.data?.message || 'Failed to create admin');
                  }
                }}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
