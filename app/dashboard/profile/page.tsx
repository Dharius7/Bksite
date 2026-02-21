'use client';

import WavePreloader from '@/components/WavePreloader';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Bell,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Calendar,
  MapPin,
  IdCard,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/user/profile');
        setFirstName(response.data?.firstName || '');
        setLastName(response.data?.lastName || '');
        setPhone(response.data?.phone || '');
        setDob(response.data?.dob || '');
        setEmail(response.data?.email || '');
        setAccountNumber(response.data?.accountId || response.data?.accountNumber || '');
        const addr = response.data?.address;
        if (addr) {
          const formatted = [addr.street, addr.city, addr.state, addr.zipCode, addr.country]
            .filter(Boolean)
            .join(', ');
          setAddress(formatted);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const safeFirstName = firstName || user?.firstName || 'U';
  const safeLastName = lastName || user?.lastName || '';
  const initials = `${safeFirstName[0] || 'U'}${safeLastName[0] || ''}`.toUpperCase();

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 text-sm">Manage your profile and security settings</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-center text-white">
              <div className="w-20 h-20 rounded-2xl bg-white/20 mx-auto flex items-center justify-center text-2xl font-semibold">
                {initials}
              </div>
              <div className="mt-3 text-lg font-semibold">
                {firstName || user.firstName} {lastName || user.lastName}
              </div>
              <div className="text-sm text-white/80">Account #{accountNumber || 'N/A'}</div>
            </div>
            <div className="p-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2 font-semibold text-blue-600">
                <User className="w-4 h-4" />
                Profile Information
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Reset Password
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                Two-Factor Authentication
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <div className="mt-3 font-semibold text-gray-900">Need Assistance?</div>
            <div className="text-sm text-gray-500">Our expert support team is available</div>
            <div className="mt-2 text-xs text-green-600 font-semibold">24/7 Live Support</div>
            <button className="mt-4 w-full rounded-xl bg-blue-600 text-white py-2 font-semibold">
              Start Live Chat
            </button>
            <div className="text-xs text-gray-400 mt-2">Or call us directly for urgent matters</div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Profile Information</div>
              <div className="text-xs text-gray-500">Your personal information and account details</div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <WavePreloader fullScreen={false} />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <input type="text" value={firstName} readOnly className="w-full outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <input type="text" value={lastName} readOnly className="w-full outline-none text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <IdCard className="w-4 h-4 text-gray-400" />
                    <input type="text" value={accountNumber} readOnly className="w-full outline-none text-sm text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Your unique account identifier</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <input type="email" value={email} readOnly className="w-full outline-none text-sm text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input type="text" value={dob} readOnly className="w-full outline-none text-sm" placeholder="mm/dd/yyyy" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <input type="text" value={phone} readOnly className="w-full outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <input type="text" value={address} readOnly className="w-full outline-none text-sm" placeholder="Enter address" />
                  </div>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                  Account Information
                  <div className="text-xs text-blue-600 mt-1">
                    To update your personal information, please contact our customer support team.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
