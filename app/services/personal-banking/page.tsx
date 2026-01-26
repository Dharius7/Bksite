import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Building2,
  PiggyBank,
  LineChart,
  BadgeDollarSign,
  Umbrella,
  Baby,
  Check,
  Smartphone,
  Monitor,
  Bell,
  Wallet,
  UserPlus,
  Phone,
} from 'lucide-react';

const accountCards = [
  {
    title: 'Checking Account',
    description: 'Everyday banking made easy with no monthly fees and unlimited transactions.',
    icon: Building2,
    accent: 'text-blue-600',
    badge: 'bg-blue-100',
    bullets: [
      'No monthly maintenance fee',
      'Free online and mobile banking',
      'Free debit card',
      'Overdraft protection available',
    ],
    linkColor: 'text-blue-600',
  },
  {
    title: 'High-Yield Savings',
    description: 'Grow your money with competitive interest rates and flexible access.',
    icon: PiggyBank,
    accent: 'text-emerald-600',
    badge: 'bg-emerald-100',
    bullets: [
      '2.50% APY interest rate',
      'No minimum balance',
      'FDIC insured up to $250K',
      'Mobile banking access',
    ],
    linkColor: 'text-emerald-600',
  },
  {
    title: 'Money Market',
    description: 'Higher interest rates with check-writing privileges and debit access.',
    icon: LineChart,
    accent: 'text-purple-600',
    badge: 'bg-purple-100',
    bullets: [
      '3.25% APY interest rate',
      '$2,500 minimum balance',
      'Limited check writing',
      'Debit card included',
    ],
    linkColor: 'text-purple-600',
  },
  {
    title: 'Certificate of Deposit',
    description: 'Lock in guaranteed returns with our competitive CD rates and terms.',
    icon: BadgeDollarSign,
    accent: 'text-orange-600',
    badge: 'bg-orange-100',
    bullets: [
      'Up to 4.50% APY',
      'Terms from 3 months to 5 years',
      '$1,000 minimum deposit',
      'Guaranteed rate of return',
    ],
    linkColor: 'text-orange-600',
  },
  {
    title: 'IRA Accounts',
    description: 'Plan for retirement with traditional and Roth IRA options.',
    icon: Umbrella,
    accent: 'text-teal-600',
    badge: 'bg-teal-100',
    bullets: [
      'Traditional and Roth options',
      'Tax advantages',
      'Investment options available',
      'Retirement planning tools',
    ],
    linkColor: 'text-teal-600',
  },
  {
    title: 'Youth Savings',
    description: 'Help young savers build good financial habits with youth accounts.',
    icon: Baby,
    accent: 'text-pink-600',
    badge: 'bg-pink-100',
    bullets: [
      'Ages 13-17 eligible',
      'No monthly fees',
      'Financial education resources',
      'Parent/guardian oversight',
    ],
    linkColor: 'text-pink-600',
  },
];

const digitalFeatures = [
  {
    title: 'Mobile Banking',
    description: 'Full-featured mobile app for iOS and Android devices.',
    icon: Smartphone,
  },
  {
    title: 'Online Banking',
    description: 'Secure web portal for all your banking needs.',
    icon: Monitor,
  },
  {
    title: 'Account Alerts',
    description: 'Real-time notifications for account activity.',
    icon: Bell,
  },
  {
    title: 'Bill Pay',
    description: 'Schedule and manage all your bill payments online.',
    icon: Wallet,
  },
];

export default function PersonalBankingPage() {
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
              Personal Banking
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100">
              Comprehensive banking solutions tailored to your personal financial needs.
            </p>
          </div>
        </div>
      </section>

      {/* Accounts */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Personal Accounts</h2>
          <p className="mt-3 text-gray-600">
            Choose from our range of personal banking accounts designed for your lifestyle.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accountCards.map((card) => {
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
                <Link
                  href="/open-account"
                  className={`mt-4 inline-flex items-center gap-2 font-semibold ${card.linkColor}`}
                >
                  Open Account
                  <span aria-hidden>?</span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Digital Features */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Digital Banking Features</h2>
          <p className="mt-3 text-gray-600">
            Bank anywhere, anytime with our comprehensive digital banking platform.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {digitalFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to Start Your Banking Journey?</h2>
            <p className="mt-3 text-blue-100">
              Open your personal account today and experience modern banking at its best.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/open-account"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-blue-700 font-semibold"
              >
                <UserPlus className="h-5 w-5" />
                Open Account
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
