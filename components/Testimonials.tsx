'use client';

import { Star, User } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "I am impressed with the customer service and speed of payout.",
      name: "Sarah Morris",
      title: "Verified Customer",
    },
    {
      quote: "Excellent service and competitive rates. Highly recommended!",
      name: "John Davis",
      title: "Business Owner",
    },
    {
      quote: "The mobile app is fantastic and customer support is top-notch.",
      name: "Emily Johnson",
      title: "Personal Banking",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
          Hear From Our Customers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
