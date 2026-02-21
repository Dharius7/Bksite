'use client';

import WavePreloader from '@/components/WavePreloader';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function GrantsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [applicationType, setApplicationType] = useState('individual');
  const [organizationName, setOrganizationName] = useState('');
  const [ein, setEin] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [documents, setDocuments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const fetchGrants = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/grants');
      setGrants(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load grants');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  if (isLoading || !user) {
    return <WavePreloader fullScreen />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        applicationType,
        organizationName: applicationType === 'company' ? organizationName.trim() : undefined,
        ein: applicationType === 'company' ? ein.trim() : undefined,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        purpose: purpose.trim(),
        amount: Number(amount),
        documents: documents
          .split(',')
          .map((doc) => doc.trim())
          .filter(Boolean),
      };

      const response = await api.post('/grants', payload);
      setMessage(response.data?.message || 'Grant application submitted');
      setOrganizationName('');
      setEin('');
      setFullName('');
      setEmail('');
      setPhone('');
      setPurpose('');
      setAmount('');
      setDocuments('');
      await fetchGrants();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grants</h1>
        <p className="text-gray-600">Apply for a grant or track existing applications</p>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Applications</h2>
          {loading ? (
            <WavePreloader />
          ) : grants.length === 0 ? (
            <div className="text-gray-600">No applications yet.</div>
          ) : (
            <div className="space-y-3">
              {grants.map((grant) => (
                <div key={grant._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900">{grant.fullName}</div>
                    <div className="text-xs text-gray-600">{grant.status}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{grant.applicationType}</div>
                  <div className="text-xs text-gray-500">Requested: ${Number(grant.amount || 0).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply for Grant</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Application Type</label>
              <select
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </select>
            </div>

            {applicationType === 'company' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">EIN</label>
                  <input
                    type="text"
                    value={ein}
                    onChange={(e) => setEin(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </>
            )}

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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Documents (comma separated)</label>
              <input
                type="text"
                value={documents}
                onChange={(e) => setDocuments(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="file1.pdf, file2.jpg"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
