import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accessibility, Mail, Phone, Clock, MapPin, Send } from 'lucide-react';

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 1px, transparent 0)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="relative container mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto break-words">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs sm:text-sm">
              <Accessibility className="h-4 w-4" />
              Accessibility
            </div>
            <h1 className="mt-4 text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">Get In Touch</h1>
            <p className="mt-4 text-blue-100 max-w-3xl text-sm sm:text-base leading-relaxed">
              Contact Us. We&apos;re here to help with all your banking needs. Reach out to us anytime.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
          <article className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm break-words">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Send us a Message</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800"
                  placeholder="Your full name"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800"
                  placeholder="Your email address"
                  readOnly
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800"
                  placeholder="Subject"
                  readOnly
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 min-h-36"
                  placeholder="Your message"
                  readOnly
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </article>

          <aside className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm break-words">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Get in Touch</h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Have questions about our services? Need help with your account? Our team is ready to assist you.
            </p>

            <div className="mt-6 space-y-5">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Phone className="h-4 w-4 text-blue-700" />
                  Phone Lines
                </div>
                <p className="mt-2 text-sm text-slate-700">Toll-Free: +1 (888) 995-2290</p>
                <p className="mt-1 text-sm text-slate-700">Fax: +1 (888) 995-22901</p>
                <p className="mt-1 text-sm text-slate-700">24 hour banking system: +1 (888) 995-2290</p>
                <p className="mt-2 text-xs text-blue-700 font-medium">Available 24/7</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Mail className="h-4 w-4 text-blue-700" />
                  Banking Verification & Inquiries
                </div>
                <p className="mt-2 text-sm text-slate-700 break-all">Email: customerservice@orinecbl.com</p>
                <p className="mt-2 text-xs text-blue-700 font-medium">Response within 48 hours</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Mail className="h-4 w-4 text-blue-700" />
                  Transactions & Payment of Funds
                </div>
                <p className="mt-2 text-sm text-slate-700">Contact: Mr. VISOVSKY Cyril</p>
                <p className="mt-1 text-sm text-slate-700 break-all">Email: OrineCredit247@gmail.com</p>
                <p className="mt-2 text-xs text-blue-700 font-medium">Response within 3 hours</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <MapPin className="h-4 w-4 text-blue-700" />
                  Visit Us
                </div>
                <p className="mt-2 text-sm text-slate-700">Bank Lane &amp; Bay Street Suite 102</p>
                <p className="text-sm text-slate-700">Floor 1 Saffrey Square</p>
                <p className="text-sm text-slate-700">Nassau, the Bahamas.</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Clock className="h-4 w-4 text-blue-700" />
                  Banking Hours
                </div>
                <p className="mt-2 text-sm text-slate-700">Mon-Fri: 9AM-5PM</p>
                <p className="text-sm text-slate-700">Sat: 9AM-1PM</p>
                <p className="text-sm text-slate-700">Sun: Closed</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
