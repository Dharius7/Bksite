'use client';

import Link from 'next/link';
import { User, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Coral Credit Bank LTD
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            We do banking differently. We believe that people come first, and that everyone deserves a great experience every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/open-account"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              <User className="w-5 h-5" />
              <span>+ Open Account Today</span>
            </Link>
            <Link 
              href="/login"
              className="flex items-center justify-center space-x-2 bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition text-lg font-semibold"
            >
              <span>→ Login to Banking</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Info Panels */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-600 text-white p-6 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">ROUTING #</div>
                <div className="text-2xl font-bold">251480576</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.555a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <div className="bg-teal-500 text-white p-6 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">BRANCH HOURS</div>
                <div className="text-lg font-semibold">Mon-Fri: 9AM-5PM</div>
                <div className="text-lg font-semibold">Sat: 9AM-1PM</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="bg-purple-600 text-white p-6 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90 mb-1">24/7 SUPPORT</div>
                <div className="text-xl font-bold">1-800-BANKING</div>
                <div className="text-sm opacity-90">Always here to help</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
