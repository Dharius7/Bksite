'use client';

import { Clock, Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  const contactInfo = [
    {
      icon: Clock,
      title: 'Banking Hours',
      details: [
        'Mon-Fri: 9AM-5PM',
        'Sat: 9AM-1PM',
        'Sun: Closed',
      ],
    },
    {
      icon: Phone,
      title: 'Phone Banking',
      details: [
        'Available 24/7',
        'Call: 1-800-BANKING',
        'International: +1 (888) 995-2290',
      ],
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: [
        'Response within 24hrs',
        'customerservice@orinecbl.com',
      ],
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: [
        'Bank Lane & Bay Street Suite 102',
        'Floor 1 Saffrey Square',
        'Nassau, the Bahamas.',
      ],
    },
  ];

  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
