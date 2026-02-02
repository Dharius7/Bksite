'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

export default function AccountSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Account Application Submitted!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for choosing Coral Credit Bank LTD. We&apos;ve received your application and will review it shortly.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What&apos;s Next?</h2>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>You&apos;ll receive an email confirmation within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Our team will verify your information and contact you if needed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Once approved, you&apos;ll receive your account details via email</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>You&apos;ll be eligible for the $200 bonus once your account is activated</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Home className="w-5 h-5" />
                <span>Return to Home</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center space-x-2 bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition"
              >
                <span>Login to Banking</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
