'use client';

import { TrendingUp, Users, Heart } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Competitive Rates',
      description: 'Better rates on savings, loans, and credit cards designed to maximize your financial growth.',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Member-Focused',
      description: "We're owned by our members, not shareholders. Your success is our priority.",
      color: 'green',
    },
    {
      icon: Heart,
      title: 'Community Committed',
      description: 'Supporting local communities and causes that matter to our members.',
      color: 'purple',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text Content */}
          <div>
            {/* Header Tag */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="text-sm font-semibold">Member-Focused Banking</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Building Strength Together
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Coral Credit Bank LTD is a full-service credit union built on the foundation of providing our members with every step of their financial journey. We're committed to helping our members achieve their financial goals through personalized service and competitive rates.
            </p>

            {/* Feature Cards */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-600',
                  green: 'bg-green-100 text-green-600',
                  purple: 'bg-purple-100 text-purple-600',
                };
                return (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex items-start space-x-4">
                      <div className={`${colorClasses[feature.color as keyof typeof colorClasses]} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Section - Image Collage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-square bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                <svg className="w-24 h-24 text-blue-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg mt-8">
              <div className="aspect-square bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                <svg className="w-24 h-24 text-green-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg -mt-8">
              <div className="aspect-square bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                <svg className="w-24 h-24 text-purple-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-square bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                <svg className="w-24 h-24 text-orange-600 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
