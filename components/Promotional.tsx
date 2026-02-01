'use client';

import Link from 'next/link';
import { DollarSign, Check, ArrowRight, Users } from 'lucide-react';

export default function Promotional() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-50 via-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Section - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="aspect-[5/4] sm:aspect-[4/3] lg:aspect-[5/4]">
                <img
                  src="/images/BanksitessNew.jpg"
                  alt="Happy Banking"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-3 right-4 sm:-bottom-4 sm:-right-4 bg-green-100 text-green-700 px-3 py-2 sm:px-4 rounded-full flex items-center space-x-2 shadow-lg">
              <Users className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-semibold">Member-Focused Banking</span>
            </div>
          </div>

          {/* Right Section - Content */}
          <div>
            {/* Banner */}
            <div className="inline-flex items-center space-x-2 bg-green-600 text-white px-3 py-2 sm:px-4 rounded-full mb-5 sm:mb-6">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-semibold">Get $200* With a Checking Account Built for You</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-5 sm:mb-6">
              Start Building Your Financial Strength
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              For a limited time, get a $200 when you open any new account, and what helps you reach your financial goals. You can open a new account online or in person at any of our locations.
            </p>

            {/* Feature List */}
            <ul className="space-y-3 mb-6 sm:mb-8">
              {[
                'No minimum balance required',
                'Free online and mobile banking',
                '24/7 customer support',
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href="/open-account"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition text-base sm:text-lg font-semibold"
            >
              <span>Open Account Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
