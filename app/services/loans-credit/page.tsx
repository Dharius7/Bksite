import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Home,
  Car,
  User,
  Briefcase,
  GraduationCap,
  HousePlus,
  Calculator,
  Check,
  ClipboardList,
  Phone,
} from 'lucide-react';

const loanOptions = [
  {
    title: 'Home Loans',
    description: 'Competitive mortgage rates for first-time buyers and refinancing.',
    icon: Home,
    accent: 'text-blue-600',
    badge: 'bg-blue-100',
    details: [
      { label: 'Interest Rate', value: 'From 3.25% APR' },
      { label: 'Loan Amount', value: 'Up to $1M' },
      { label: 'Term', value: '15-30 years' },
    ],
  },
  {
    title: 'Auto Loans',
    description: 'Finance your dream car with our competitive auto loan rates.',
    icon: Car,
    accent: 'text-emerald-600',
    badge: 'bg-emerald-100',
    details: [
      { label: 'Interest Rate', value: 'From 2.99% APR' },
      { label: 'Loan Amount', value: 'Up to $100K' },
      { label: 'Term', value: '3-7 years' },
    ],
  },
  {
    title: 'Personal Loans',
    description: 'Flexible personal loans for any purpose with quick approval.',
    icon: User,
    accent: 'text-purple-600',
    badge: 'bg-purple-100',
    details: [
      { label: 'Interest Rate', value: 'From 5.99% APR' },
      { label: 'Loan Amount', value: 'Up to $50K' },
      { label: 'Term', value: '2-7 years' },
    ],
  },
  {
    title: 'Business Loans',
    description: 'Grow your business with our flexible commercial lending solutions.',
    icon: Briefcase,
    accent: 'text-orange-600',
    badge: 'bg-orange-100',
    details: [
      { label: 'Interest Rate', value: 'From 4.25% APR' },
      { label: 'Loan Amount', value: 'Up to $5M' },
      { label: 'Term', value: '1-25 years' },
    ],
  },
  {
    title: 'Student Loans',
    description: 'Invest in your education with competitive student loan rates.',
    icon: GraduationCap,
    accent: 'text-teal-600',
    badge: 'bg-teal-100',
    details: [
      { label: 'Interest Rate', value: 'From 3.75% APR' },
      { label: 'Loan Amount', value: 'Up to $200K' },
      { label: 'Term', value: '5-20 years' },
    ],
  },
  {
    title: 'Home Equity',
    description: "Tap into your home's equity for major expenses or investments.",
    icon: HousePlus,
    accent: 'text-red-600',
    badge: 'bg-red-100',
    details: [
      { label: 'Interest Rate', value: 'From 4.50% APR' },
      { label: 'Loan Amount', value: 'Up to $500K' },
      { label: 'Term', value: '5-30 years' },
    ],
  },
];

const steps = [
  {
    title: 'Apply Online',
    description: 'Complete our secure online application in minutes.',
  },
  {
    title: 'Quick Review',
    description: 'Our team reviews your application within 24 hours.',
  },
  {
    title: 'Get Approved',
    description: 'Receive your approval decision and loan terms.',
  },
  {
    title: 'Receive Funds',
    description: 'Funds deposited directly into your account.',
  },
];

export default function LoansCreditPage() {
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
              Loans & Financing
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100">
              Competitive rates and flexible terms to help you achieve your financial goals.
            </p>
          </div>
        </div>
      </section>

      {/* Loan Options */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Loan Options</h2>
          <p className="mt-3 text-gray-600">
            Find the perfect loan solution for your personal or business needs.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loanOptions.map((card) => {
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
                <div className="mt-4 space-y-2 text-sm">
                  {card.details.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-gray-500">{item.label}:</span>
                      <span className={`${card.accent} font-semibold`}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/login"
                  className={`mt-4 inline-flex items-center gap-2 font-semibold ${card.accent}`}
                >
                  Apply Now
                  <span aria-hidden>→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Calculator */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Loan Calculator</h2>
          <p className="mt-3 text-gray-600">Estimate your monthly payments with our loan calculator.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                <input
                  type="text"
                  defaultValue="$25,000"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Interest Rate (%)</label>
                <input
                  type="text"
                  defaultValue="5.99"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Loan Term (years)</label>
                <input
                  type="text"
                  defaultValue="5"
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </div>
              <button className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold">
                Calculate Payment
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <Calculator className="h-5 w-5" />
              Payment Breakdown
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-blue-600">$0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-semibold text-blue-600">$0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Payment:</span>
                <span className="font-semibold text-blue-600">$0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Easy Application Process</h2>
          <p className="mt-3 text-gray-600">Get approved in minutes with our streamlined application process.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to Apply for a Loan?</h2>
            <p className="mt-3 text-blue-100">
              Get started with your loan application today and receive a decision within 24 hours.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-blue-700 font-semibold"
              >
                <ClipboardList className="h-5 w-5" />
                Apply Now
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
