'use client';

import { PiggyBank, Award, CreditCard, HandCoins, TrendingUp } from 'lucide-react';

export default function Rates() {
  const rates = [
    {
      icon: PiggyBank,
      rate: '3.75%',
      rateType: 'APY*',
      title: 'HIGH YIELD SAVINGS',
      description: 'High Yield Savings Rate',
      buttonText: 'FEATURED',
      buttonColor: 'bg-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      rateColor: 'text-blue-600',
    },
    {
      icon: Award,
      rate: '3.65%',
      rateType: 'APY*',
      title: '18 MONTH CERTIFICATE',
      description: 'Coral Credit Bank LTD Certificate Rates',
      buttonText: 'SAVINGS',
      buttonColor: 'bg-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      rateColor: 'text-green-600',
    },
    {
      icon: CreditCard,
      rate: '4.00%',
      rateType: 'APR*',
      title: 'CREDIT CARDS',
      description: 'Coral Credit Bank LTD Credit Card Rates',
      buttonText: 'CREDIT',
      buttonColor: 'bg-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      rateColor: 'text-purple-600',
    },
    {
      icon: HandCoins,
      rate: '15.49%',
      rateType: 'APR*',
      title: 'LOANS',
      description: 'Coral Credit Bank LTD Standard Loan Rates',
      buttonText: 'MORTGAGE',
      buttonColor: 'bg-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      rateColor: 'text-orange-600',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Coral Credit Bank LTD Rates</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Coral Credit Bank LTD Member Care
          </h2>
          <p className="text-xl text-gray-600">
            Discover competitive rates designed to help your money grow faster
          </p>
        </div>

        {/* Rate Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {rates.map((rate, index) => {
            const Icon = rate.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition">
                <div className="flex flex-col items-start sm:items-start gap-3">
                  <div className={`${rate.iconBg} w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${rate.iconColor}`} />
                  </div>
                  <div>
                    <div className={`text-2xl sm:text-4xl font-bold ${rate.rateColor} mb-1`}>
                      {rate.rate}
                    </div>
                    <div className={`text-xs sm:text-sm ${rate.rateColor}`}>
                      {rate.rateType}
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 text-sm sm:text-lg font-bold text-gray-900">
                  {rate.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-2 mb-4 hidden sm:block">
                  {rate.description}
                </p>
                <button className={`${rate.buttonColor} text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold w-full hover:opacity-90 transition`}>
                  {rate.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="flex justify-center items-center space-x-2 text-sm text-blue-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>*Annual Percentage Yield. Rates subject to change. Terms and conditions apply.</span>
        </div>
      </div>
    </section>
  );
}
