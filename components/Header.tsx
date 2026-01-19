'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Moon, LogIn, Star, ChevronDown } from 'lucide-react';

export default function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div className="ml-2">
                <div className="text-orange-600 font-bold text-lg">CORAL CREDIT</div>
                <div className="text-gray-600 text-xs">PRIVATE BANKING LTD.</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>
            <div 
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition">
                Services <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <Link href="/services/personal-banking" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                    Personal Banking
                  </Link>
                  <Link href="/services/business-banking" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                    Business Banking
                  </Link>
                  <Link href="/services/loans-credit" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                    Loans & Credit
                  </Link>
                  <Link href="/services/cards" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                    Cards
                  </Link>
                </div>
              )}
            </div>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block p-2 text-gray-700 hover:text-blue-600 transition">
              <Moon className="w-5 h-5" />
            </button>
            <Link 
              href="/login"
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link 
              href="/open-account"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Open Account</span>
              <span className="sm:hidden">Open</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <Link href="/" className="block py-2 text-gray-700">Home</Link>
            <Link href="/about" className="block py-2 text-gray-700">About</Link>
            <div className="py-2">
              <div className="text-gray-700 font-semibold mb-2">Services</div>
              <Link href="/services/personal-banking" className="block py-1 pl-4 text-gray-600">Personal Banking</Link>
              <Link href="/services/business-banking" className="block py-1 pl-4 text-gray-600">Business Banking</Link>
              <Link href="/services/loans-credit" className="block py-1 pl-4 text-gray-600">Loans & Credit</Link>
              <Link href="/services/cards" className="block py-1 pl-4 text-gray-600">Cards</Link>
            </div>
            <Link href="/contact" className="block py-2 text-gray-700">Contact</Link>
            <Link href="/login" className="block py-2 text-gray-700">Login</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
