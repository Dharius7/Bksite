import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Lightbulb,
  Heart,
  Users,
  Calendar,
  Rocket,
  Sparkles,
  UserPlus,
  Phone,
} from 'lucide-react';

export default function AboutPage() {
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
              About Orine Credit Bank LTD
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-blue-100">
              Trusted banking partner committed to your financial success since our founding.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              At Orine Credit Bank LTD, we are dedicated to empowering individuals, families, and
              businesses to achieve their financial goals through innovative banking solutions,
              personalized service, and unwavering commitment to excellence.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We believe that banking should be simple, secure, and accessible to everyone, which is
              why we continuously invest in technology and training to deliver the best possible
              experience for our customers.
            </p>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-xl h-64 sm:h-80">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
                alt="Customer service"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-6 bg-blue-600 text-white rounded-2xl px-5 py-4 shadow-lg">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-xs uppercase tracking-wide">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Core Values</h2>
          <p className="mt-3 text-gray-600">
            These values guide everything we do and shape our commitment to our customers and
            community.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: 'Trust & Security',
              text: 'Your financial security is our top priority with industry-leading protection.',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              icon: Lightbulb,
              title: 'Innovation',
              text: 'We embrace cutting-edge technology to deliver modern banking solutions.',
              color: 'bg-emerald-50 text-emerald-600',
            },
            {
              icon: Heart,
              title: 'Customer Care',
              text: 'Personalized service and support whenever you need it, however you prefer.',
              color: 'bg-purple-50 text-purple-600',
            },
            {
              icon: Users,
              title: 'Community',
              text: 'Supporting local communities and contributing to economic growth.',
              color: 'bg-orange-50 text-orange-600',
            },
          ].map(({ icon: Icon, title, text, color }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className={`mx-auto h-14 w-14 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Journey</h2>
          <p className="mt-3 text-gray-600">
            From humble beginnings to becoming a trusted financial institution.
          </p>
        </div>
        <div className="mt-10 space-y-8 max-w-3xl mx-auto">
          {[
            { year: '1985', title: 'Founded', icon: Calendar, color: 'bg-blue-50 text-blue-600' },
            { year: '2005', title: 'Digital Era', icon: Sparkles, color: 'bg-emerald-50 text-emerald-600' },
            { year: '2015', title: 'Mobile First', icon: Rocket, color: 'bg-purple-50 text-purple-600' },
            { year: 'Today', title: 'Innovation', icon: Lightbulb, color: 'bg-orange-50 text-orange-600' },
          ].map((item) => (
            <div key={item.year} className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
              <div className={`h-20 w-20 rounded-2xl flex flex-col items-center justify-center ${item.color} font-semibold mx-auto sm:mx-0`}>
                <div className="text-lg">{item.year}</div>
                <div className="text-xs uppercase tracking-wide">{item.title}</div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {item.title === 'Founded' &&
                    'Orine Credit Bank LTD was founded with a simple mission: to provide honest, reliable banking services to our local community.'}
                  {item.title === 'Digital Era' &&
                    'We embraced the digital revolution, launching our first online banking platform to serve customers 24/7.'}
                  {item.title === 'Mobile First' &&
                    'Launched our mobile banking experience, making banking accessible anywhere, anytime.'}
                  {item.title === 'Innovation' &&
                    'Continuing to innovate with AI-powered services, advanced security, and sustainable banking practices.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Numbers */}
      <section className="bg-blue-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold">By the Numbers</h2>
            <p className="mt-3 text-blue-100">Our growth reflects the trust our customers place in us.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '50K+', label: 'Active Customers' },
              { value: '$2.5B', label: 'Assets Under Management' },
              { value: '25', label: 'Branch Locations' },
              { value: '99.9%', label: 'Uptime Guarantee' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Ready to Join Our Family?</h2>
          <p className="mt-3 text-gray-600">
            Experience the difference of banking with a trusted partner who puts your financial
            success first.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/open-account"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
            >
              <UserPlus className="h-5 w-5" />
              Open an Account
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-gray-800 font-semibold hover:bg-gray-200 transition"
            >
              <Phone className="h-5 w-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
