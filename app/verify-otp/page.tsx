'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    const otpToken = localStorage.getItem('user_otp_token');
    const storedEmail = localStorage.getItem('user_otp_email') || '';
    if (!otpToken) {
      router.push('/login');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const otpToken = localStorage.getItem('user_otp_token');
      if (!otpToken) {
        setError('OTP session expired. Please log in again.');
        router.push('/login');
        return;
      }
      const response = await api.post('/auth/verify-otp', { otp, otpToken });
      localStorage.setItem('token', response.data?.token || '');
      localStorage.setItem('user', JSON.stringify(response.data?.user || {}));
      localStorage.removeItem('user_otp_token');
      localStorage.removeItem('user_otp_email');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
      setOtp('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const otpToken = localStorage.getItem('user_otp_token');
      if (!otpToken) {
        setError('OTP session expired. Please log in again.');
        return;
      }
      const response = await api.post('/auth/resend-otp', { otpToken });
      if (response.data?.otpRequired) {
        localStorage.setItem('user_otp_token', response.data?.otpToken || '');
        setResendTimer(30);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-5 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="inline-flex items-center justify-center rounded-full w-9 h-9 bg-gray-100 text-gray-600"
            aria-label="Back to login"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center flex-1 pr-9">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">OTP Verification</h1>
            <p className="text-gray-600 text-sm">
              Enter the code for {email || 'your account'}
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">OTP Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-3 text-center text-lg sm:text-xl font-semibold tracking-[0.3em] sm:tracking-[0.35em] focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="text-center text-xs text-gray-500">
            {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'You can resend a code now'}
          </div>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resendTimer > 0}
            className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            {resending ? 'Resending...' : 'Resend Code'}
          </button>
        </form>
      </div>
    </main>
  );
}
