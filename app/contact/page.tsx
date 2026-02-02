'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { isEmail, trimRequired } from '@/lib/validation';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!trimRequired(fullName) || !trimRequired(subject) || !trimRequired(message)) {
      setError('Please complete all required fields.');
      return;
    }
    if (!isEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSuccess('Message sent successfully. Our team will reply shortly.');
    setFullName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative container mx-auto px-4 py-16 sm:py-20 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Contact Us</h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100">
              We're here to help with all your banking needs. Reach out to us anytime.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-10">
          {/* Form */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="Subject"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Message</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                  placeholder="Tell us how we can help"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-3 text-gray-600">
              Have questions about our services? Need help with your account? Our team is ready to assist you.
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-gray-100 p-4 flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Phone Lines</div>
                  <p className="text-sm text-gray-600">Toll-Free: +1 (888) 995-2290</p>
                  <p className="text-sm text-gray-600">Fax +1 (888) 995-22901</p>
                  <p className="text-sm text-gray-600">24 hour banking system +1 (888) 995-2290</p>
                  <p className="text-xs text-gray-500 mt-2">Available 24/7</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">For Banking verification and inquiries</div>
                  <p className="text-sm text-gray-600">Email: customerservice@coralcb.com</p>
                  <p className="text-xs text-gray-500 mt-2">Response within 48 hours</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">For Transactions and Payment of Funds</div>
                  <p className="text-sm text-gray-600">Contact Mr. VISOVSKY Cyril.</p>
                  <p className="text-sm text-gray-600">Email: CoralCredit247@gmail.com</p>
                  <p className="text-xs text-gray-500 mt-2">Response within 3 hours</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Visit Us</div>
                  <p className="text-sm text-gray-600">Bank Lane & Bay Street Suite 102</p>
                  <p className="text-sm text-gray-600">Floor 1 Saffrey Square</p>
                  <p className="text-sm text-gray-600">Nassau, the Bahamas.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-4 flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Banking Hours</div>
                  <p className="text-sm text-gray-600">Mon-Fri: 9AM-5PM</p>
                  <p className="text-sm text-gray-600">Sat: 9AM-1PM</p>
                  <p className="text-sm text-gray-600">Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
