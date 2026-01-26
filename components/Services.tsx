'use client';

import { Building2, CreditCard, Home, Briefcase, PieChart, Info } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Building2,
      title: 'Deposit Accounts',
      description: 'Secure your money with our high-yield savings and checking accounts designed for growth.',
    },
    {
      icon: CreditCard,
      title: 'Credit Cards',
      description: 'Find the perfect credit card for your lifestyle and spending habits with competitive rates.',
    },
    {
      icon: Home,
      title: 'Loans',
      description: 'Get competitive rates on personal, auto, and home loans tailored to your financial goals.',
    },
    {
      icon: Briefcase,
      title: 'Business Banking',
      description: 'Comprehensive banking solutions designed to help your business thrive and grow.',
    },
    {
      icon: PieChart,
      title: 'Wealth & Retire',
      description: 'Plan for your future with our expert investment and retirement planning services.',
    },
    {
      icon: Info,
      title: 'About Coral Credit Bank LTD',
      description: 'Learn more about our commitment to exceptional banking services and community support.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm font-semibold">Our Services</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Can We Help You Today?
          </h2>
          <p className="text-xl text-white/90">
            Comprehensive banking solutions tailored to your needs
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="glass rounded-xl p-4 sm:p-6 hover:bg-white/20 transition cursor-pointer backdrop-blur-md"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 backdrop-blur-sm">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-sm sm:text-xl font-bold text-white mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-white/90 leading-relaxed text-xs sm:text-base hidden sm:block">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
