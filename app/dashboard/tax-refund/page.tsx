'use client';

import WavePreloader from '@/components/WavePreloader';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function TaxRefundPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [ssn, setSsn] = useState('');
  const [idmeEmail, setIdmeEmail] = useState('');
  const [idmePassword, setIdmePassword] = useState('');
  const [country, setCountry] = useState('US');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const fetchRefunds = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/tax-refund');
      setRefunds(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tax refunds');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/tax-refund', {
        fullName: fullName.trim(),
        ssn: ssn.trim(),
        idmeEmail: idmeEmail.trim(),
        idmePassword: idmePassword,
        country,
      });
      setMessage(response.data?.message || 'Request submitted');
      setFullName('');
      setSsn('');
      setIdmeEmail('');
      setIdmePassword('');
      setCountry('US');
      await fetchRefunds();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tax Refund</h1>
        <p className="text-gray-600">Submit and track your tax refund requests</p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Requests</h2>
          {loading ? (
            <WavePreloader />
          ) : refunds.length === 0 ? (
            <div className="text-gray-600">No requests yet.</div>
          ) : (
            <div className="space-y-3">
              {refunds.map((refund) => (
                <div key={refund._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900">{refund.fullName}</div>
                    <div className="text-xs text-gray-600">{refund.status}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{refund.country}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SSN</label>
              <input
                type="text"
                value={ssn}
                onChange={(e) => setSsn(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID.me Email</label>
              <input
                type="email"
                value={idmeEmail}
                onChange={(e) => setIdmeEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID.me Password</label>
              <input
                type="password"
                value={idmePassword}
                onChange={(e) => setIdmePassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
