'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { trimRequired } from '@/lib/validation';
import { HelpCircle, Flag, MessageSquare, Send, ChevronDown, CreditCard, ShieldCheck, Plus, Activity } from 'lucide-react';

export default function SupportPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('low');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    if (!trimRequired(title) || !trimRequired(description)) {
      setError('Please complete all required fields.');
      setSubmitting(false);
      return;
    }
    if (title.trim().length < 5) {
      setError('Ticket title must be at least 5 characters.');
      setSubmitting(false);
      return;
    }
    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await api.post('/support', {
        title: title.trim(),
        priority,
        description: description.trim(),
      });
      setMessage(response.data?.message || 'Support ticket submitted');
      setTitle('');
      setPriority('low');
      setDescription('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Support Center</h1>
          <p className="text-sm text-gray-600">Get help with your account and services</p>
        </div>
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

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-sm font-semibold text-gray-900">Submit a Support Ticket</div>
            <div className="text-xs text-gray-500">
              We&apos;re here to help. Tell us about your issue and we&apos;ll find a solution.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-8 h-8" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Title</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full outline-none text-sm"
                placeholder="Briefly describe your issue"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Be specific to help us understand your issue</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <Flag className="w-4 h-4 text-gray-400" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full outline-none text-sm"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">Select based on urgency of your request</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Issue</label>
            <div className="flex items-start gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full outline-none text-sm resize-none"
                placeholder="Please provide all relevant details about your issue so we can help you better"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Include any relevant details that might help us resolve your issue
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            Support Information
            <div className="text-xs text-blue-600 mt-1">
              Our support team typically responds within 24 hours. For urgent matters, please select &quot;High Priority&quot;.
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 inline mr-2" />
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-sm font-semibold text-gray-900">Quick Help</div>
            <div className="text-xs text-gray-500">Find answers to common questions</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {[
            { label: 'How to make a transfer?', icon: Send },
            { label: 'How to apply for a card?', icon: CreditCard },
            { label: 'How to check my balance?', icon: Activity },
            { label: 'How to enable 2FA?', icon: ShieldCheck },
            { label: 'How to deposit funds?', icon: Plus },
            { label: 'How to track transactions?', icon: Activity },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between px-6 py-4 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 px-6 py-6">
          <div className="text-center text-sm text-gray-600">Still need help?</div>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              24/7 Support
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              Live Chat
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              Fast Response
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
