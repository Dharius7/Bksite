'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/services/personal-banking', label: 'Services' },
    { href: '/login', label: 'Grants & Aid' },
    { href: '/contact', label: 'Contact' },
  ];

  const services = [
    { href: '/services/personal-banking', label: 'Personal Banking' },
    { href: '/services/business-banking', label: 'Business Banking' },
    { href: '/services/loans-credit', label: 'Loans & Credit' },
    { href: '/login', label: 'Cards' },
    { href: '/login', label: 'Grants & Aid' },
  ];

  const memberServices = [
    { href: '/login', label: 'Online Banking' },
    { href: '/login', label: 'Security Center' },
  ];

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section - Branding */}
          <div>
            <div className="flex items-center space-x-2 mb-4 min-w-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden ring-1 ring-white/25 shadow-lg shrink-0">
                <Image
                  src="/images/Logo.png"
                  alt="Orine Credit Bank logo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 40px, 48px"
                />
              </div>
              <div className="min-w-0">
                <div className="text-orange-400 font-bold text-base sm:text-xl leading-tight">ORINE CREDIT</div>
                <div className="text-blue-300 text-[11px] sm:text-sm leading-tight">PRIVATE BANKING LTD.</div>
              </div>
            </div>
            <p className="text-blue-200 leading-relaxed max-w-md">
              Building financial strength together with personalized banking solutions for every member. Your trusted partner in financial growth.
            </p>
          </div>

          {/* Right Section - Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-purple-400 mr-3"></div>
                <h3 className="font-bold text-lg">Quick Links</h3>
              </div>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-blue-200 hover:text-white transition flex items-center">
                      <ChevronRight className="w-4 h-4 mr-1" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-purple-400 mr-3"></div>
                <h3 className="font-bold text-lg">Services</h3>
              </div>
              <ul className="space-y-2">
                {services.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-blue-200 hover:text-white transition flex items-center">
                      <ChevronRight className="w-4 h-4 mr-1" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Member Services */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-purple-400 mr-3"></div>
                <h3 className="font-bold text-lg">Member Services</h3>
              </div>
              <ul className="space-y-2">
                {memberServices.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-blue-200 hover:text-white transition flex items-center">
                      <ChevronRight className="w-4 h-4 mr-1" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col gap-3 text-blue-200 text-sm md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Orine Credit Bank LTD. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end">
            <Link href="/privacy-policy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-white transition">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
