'use client';

import Link from 'next/link';
import { DollarSign, Check, ArrowRight, Users } from 'lucide-react';

export default function Promotional() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 via-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-200 via-green-200 to-blue-300 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 text-blue-600 opacity-50 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <p className="text-blue-600 font-semibold">Happy Banking</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
              <Users className="w-4 h-4" />
              <span className="text-sm font-semibold">Member-Focused Banking</span>
            </div>
          </div>

          {/* Right Section - Content */}
          <div>
            {/* Banner */}
            <div className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full mb-6">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-semibold">Get $200* With a Checking Account Built for You</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Start Building Your Financial Strength
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              For a limited time, get a $200 when you open any new account, and what helps you reach your financial goals. You can open a new account online or in person at any of our locations.
            </p>

            {/* Feature List */}
            <ul className="space-y-3 mb-8">
              {[
                'No minimum balance required',
                'Free online and mobile banking',
                '24/7 customer support',
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href="/open-account"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
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
