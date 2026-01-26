'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Moon,
  LogIn,
  Star,
  ChevronDown,
  Home,
  Info,
  Layers,
  Mail,
  User,
  Briefcase,
  HandCoins,
  CreditCard,
  UserCircle2,
  BriefcaseBusiness,
  Handshake,
} from 'lucide-react';

export default function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    if (typeof document === 'undefined') return;
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur fixed top-0 inset-x-0 z-50 shadow-sm">
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
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                  <Link href="/services/personal-banking" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg mx-2">
                    <UserCircle2 className="w-4 h-4 text-blue-600" />
                    Personal Banking
                  </Link>
                  <Link href="/services/business-banking" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg mx-2">
                    <BriefcaseBusiness className="w-4 h-4 text-blue-600" />
                    Business Banking
                  </Link>
                  <Link href="/services/loans-credit" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg mx-2">
                    <Handshake className="w-4 h-4 text-green-600" />
                    Loans & Credit
                  </Link>
                  <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg mx-2">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    Cards
                  </Link>
                  <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg mx-2">
                    <HandCoins className="w-4 h-4 text-orange-600" />
                    Grants & Aid
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
            <button
              className="hidden md:block p-2 text-gray-700 hover:text-blue-600 transition"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
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
              className="hidden sm:flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Star className="w-4 h-4" />
              <span>Open Account</span>
            </Link>
            <Link 
              href="/login"
              className="flex sm:hidden items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Star className="w-4 h-4" />
              <span>Login</span>
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
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-3 py-2 text-gray-800">
                <Home className="w-5 h-5 text-blue-600" />
                Home
              </Link>
              <Link href="/about" className="flex items-center gap-3 py-2 text-gray-800">
                <Info className="w-5 h-5 text-teal-600" />
                About
              </Link>
              <button
                type="button"
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between py-2 text-gray-800"
                aria-expanded={mobileServicesOpen}
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-purple-600" />
                  Services
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileServicesOpen && (
                <div className="ml-8 space-y-2">
                  <Link href="/services/personal-banking" className="flex items-center gap-3 py-1 text-gray-700">
                    <User className="w-4 h-4 text-blue-500" />
                    Personal Banking
                  </Link>
                  <Link href="/services/business-banking" className="flex items-center gap-3 py-1 text-gray-700">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    Business Banking
                  </Link>
                  <Link href="/services/loans-credit" className="flex items-center gap-3 py-1 text-gray-700">
                    <HandCoins className="w-4 h-4 text-green-500" />
                    Loans & Credit
                  </Link>
                  <Link href="/login" className="flex items-center gap-3 py-1 text-gray-700">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    Cards
                  </Link>
                </div>
              )}
              <Link href="/contact" className="flex items-center gap-3 py-2 text-gray-800">
                <Mail className="w-5 h-5 text-orange-500" />
                Contact
              </Link>
            </div>

            <div className="mt-4 border-t pt-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-3 text-gray-800"
              >
                <span className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </span>
                {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </div>
          </div>
        )}
        </nav>
      </header>
      <div className="h-20 md:h-[72px]" />
    </>
  );
}
