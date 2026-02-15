'use client';

import Image from 'next/image';
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
      description: "We&apos;re owned by our members, not shareholders. Your success is our priority.",
      color: 'green',
    },
    {
      icon: Heart,
      title: 'Community Committed',
      description: 'Supporting local communities and causes that matter to our members.',
      color: 'purple',
    },
  ];
  const collageImages = [
    {
      src: '/images/Baksitepicnew.jpg',
      alt: 'Customers using mobile banking together',
      extraClass: '',
    },
    {
      src: '/images/Bnksitepicnew.jpg',
      alt: 'Smiling couple reviewing banking on a phone',
      extraClass: 'mt-8',
    },
    {
      src: '/images/Bankstepicnew.jpg',
      alt: 'Customer using a tablet with a bank card',
      extraClass: '-mt-8',
    },
    {
      src: '/images/Banksitepinew.jpg',
      alt: 'Customer checking account details on a laptop',
      extraClass: '',
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
              Orine Credit Bank LTD is a full-service credit union built on the foundation of providing our members with every step of their financial journey. We&apos;re committed to helping our members achieve their financial goals through personalized service and competitive rates.
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {collageImages.map((image) => (
              <div
                key={image.src}
                className={`relative rounded-xl overflow-hidden shadow-lg ${image.extraClass} sm:rounded-2xl aspect-[4/5] sm:aspect-square lg:aspect-[4/5]`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
