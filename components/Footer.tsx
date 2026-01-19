'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/grants-aid', label: 'Grants & Aid' },
    { href: '/contact', label: 'Contact' },
  ];

  const services = [
    { href: '/services/personal-banking', label: 'Personal Banking' },
    { href: '/services/business-banking', label: 'Business Banking' },
    { href: '/services/loans-credit', label: 'Loans & Credit' },
    { href: '/services/cards', label: 'Cards' },
  ];

  const memberServices = [
    { href: '/online-banking', label: 'Online Banking' },
    { href: '/mobile-app', label: 'Mobile App' },
    { href: '/atm-locations', label: 'ATM Locations' },
    { href: '/security-center', label: 'Security Center' },
  ];

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section - Branding */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <div>
                <div className="text-orange-400 font-bold text-xl">CORAL CREDIT</div>
                <div className="text-blue-300 text-sm">PRIVATE BANKING LTD.</div>
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
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200 text-sm">
          <p>&copy; {new Date().getFullYear()} Coral Credit Bank LTD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
