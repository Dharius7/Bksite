import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Building2,
  PiggyBank,
  HandCoins,
  CreditCard,
  WalletCards,
  LineChart,
  Users,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Check,
  BriefcaseBusiness,
  Phone,
} from 'lucide-react';

const serviceCards = [
  {
    title: 'Business Checking',
    description: 'Flexible checking accounts with low fees and high transaction limits.',
    icon: Building2,
    accent: 'text-blue-600',
    badge: 'bg-blue-100',
    bullets: ['No monthly maintenance fees', 'Unlimited transactions', 'Online banking included'],
  },
  {
    title: 'Business Savings',
    description: 'Competitive interest rates to help your business funds grow.',
    icon: PiggyBank,
    accent: 'text-emerald-600',
    badge: 'bg-emerald-100',
    bullets: ['High-yield interest rates', 'No minimum balance', 'FDIC insured'],
  },
  {
    title: 'Business Loans',
    description: 'Flexible financing solutions for expansion, equipment, and working capital.',
    icon: HandCoins,
    accent: 'text-purple-600',
    badge: 'bg-purple-100',
    bullets: ['Competitive rates', 'Quick approval process', 'Flexible terms'],
  },
  {
    title: 'Merchant Services',
    description: 'Accept payments anywhere with our secure payment processing solutions.',
    icon: WalletCards,
    accent: 'text-orange-600',
    badge: 'bg-orange-100',
    bullets: ['Multiple payment methods', 'Secure transactions', 'Real-time reporting'],
  },
  {
    title: 'Cash Management',
    description: 'Keep cash flowing with advanced treasury management tools.',
    icon: LineChart,
    accent: 'text-teal-600',
    badge: 'bg-teal-100',
    bullets: ['Automated clearing', 'Wire transfers', 'Account reconciliation'],
  },
  {
    title: 'Business Credit Cards',
    description: 'Build business credit while earning rewards on everyday purchases.',
    icon: CreditCard,
    accent: 'text-red-600',
    badge: 'bg-red-100',
    bullets: ['Cashback rewards', 'Expense tracking', 'Employee cards'],
  },
];

const reasons = [
  {
    title: 'Dedicated Support',
    description: 'Personal relationship managers for your business.',
    icon: Users,
  },
  {
    title: 'Digital Banking',
    description: 'Advanced online and mobile banking platforms.',
    icon: Smartphone,
  },
  {
    title: 'Financial Insights',
    description: 'Detailed reporting and analytics tools.',
    icon: BarChart3,
  },
  {
    title: 'Security First',
    description: 'Enterprise-grade security for all transactions.',
    icon: ShieldCheck,
  },
];

export default function BusinessBankingPage() {
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Business Banking Solutions
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100">
              Comprehensive financial services designed to help your business grow and thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Banking Services</h2>
          <p className="mt-3 text-gray-600">
            Everything your business needs to manage finances efficiently and scale successfully.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${card.badge}`}>
                  <Icon className={`h-6 w-6 ${card.accent}`} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-gray-600">{card.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {card.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reasons */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Businesses Choose Us</h2>
          <p className="mt-3 text-gray-600">
            We understand the unique challenges businesses face and provide tailored solutions.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{reason.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to Bank with Us?</h2>
            <p className="mt-3 text-blue-100">
              Let's discuss how we can support your business growth and financial success.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/open-account"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-blue-700 font-semibold"
              >
                <BriefcaseBusiness className="h-5 w-5" />
                Open Business Account
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800/60 px-6 py-3 text-white font-semibold"
              >
                <Phone className="h-5 w-5" />
                Speak with Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
