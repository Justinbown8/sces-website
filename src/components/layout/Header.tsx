'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { NavigationLink } from '@/types';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll behavior for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/90 backdrop-blur-sm'
      } ${className}`}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-4 xl:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Site Name */}
          <Link
            href="/"
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
          >
            <Logo size="md" className="group-hover:scale-110 transition-transform duration-200" />
            <div className="hidden sm:block">
              <span className="text-lg lg:text-xl font-bold text-gray-900 font-heading">
                SCES
              </span>
              <p className="text-xs text-gray-600 leading-tight">
                Sunrise Children Educational Society
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center space-x-4 xl:space-x-8"
            role="navigation"
            aria-label="Main navigation"
            id="main-navigation"
          >
            {siteConfig.navigation.map((link: NavigationLink) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 xl:px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md ${
                  isActiveLink(link.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.label}
                {/* Active indicator */}
                {isActiveLink(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                )}
                {/* Hover indicator */}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <Button
              variant="primary"
              size="md"
              className="font-semibold"
              asChild
            >
              <Link href="/donate">Donate Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="true"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#ffffff' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <Logo size="sm" />
              <span 
                id="mobile-menu-title"
                className="text-lg font-bold text-gray-900 font-heading"
              >
                SCES
              </span>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav 
            className="flex-1 px-4 py-6 space-y-2 bg-white"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {siteConfig.navigation.map((link: NavigationLink) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActiveLink(link.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile CTA Button */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <Button
              variant="primary"
              size="lg"
              className="w-full font-semibold"
              asChild
            >
              <Link href="/donate" onClick={toggleMenu}>
                Donate Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;