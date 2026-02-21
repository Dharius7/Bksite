'use client';

import WavePreloader from '@/components/WavePreloader';
import { useEffect, useState } from 'react';
import { Settings, Save, User, ArrowLeft } from 'lucide-react';
import adminApi from '@/lib/adminApi';

type AdminProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<AdminProfile>({});
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminApi.get('/admin/me');
        const admin = res.data?.admin || {};
        setProfile({
          firstName: admin.firstName || '',
          lastName: admin.lastName || '',
          email: admin.email || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load admin profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await adminApi.patch('/admin/me', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        ...(password ? { password } : {}),
      });
      const admin = res.data?.admin || {};
      setProfile({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        email: admin.email || '',
      });
      setPassword('');
      setSuccess('Admin profile updated.');

      const stored = localStorage.getItem('admin');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          'admin',
          JSON.stringify({
            ...parsed,
            name: `${admin.firstName || ''} ${admin.lastName || ''}`.trim(),
            email: admin.email || parsed.email,
          })
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update admin profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="rounded-3xl bg-white/90 backdrop-blur shadow-lg border border-slate-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 border-b border-indigo-100">
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50"
              aria-label="Back to overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-indigo-800">Admin Settings</h1>
              <p className="text-xs text-gray-500">Update admin profile details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-5 md:p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          {loading ? (
            <WavePreloader fullScreen={false} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">First Name</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  <input
                    type="text"
                    value={profile.firstName || ''}
                    onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  <input
                    type="text"
                    value={profile.lastName || ''}
                    onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Settings className="w-4 h-4 text-indigo-500" />
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="admin@coralcredit.com"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Change Password</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <Settings className="w-4 h-4 text-indigo-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
