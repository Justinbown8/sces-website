'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import dynamic from 'next/dynamic';
const Logo = dynamic(() => import('@/components/ui/Logo'), { ssr: false });
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
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-2 flex-nowrap">
          {/* Logo and Site Name */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-0.5"
          >
            <Logo size="sm" className="group-hover:scale-110 transition-transform duration-200" />
            <div className="hidden sm:block min-w-0">
              <span className="text-base lg:text-lg font-bold text-gray-900 font-heading truncate block">
                SCES
              </span>
              <p className="text-[10px] lg:text-xs text-gray-600 leading-tight whitespace-nowrap">
                Sunrise School
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden xl:flex items-center gap-1 xl:gap-2 flex-nowrap overflow-x-auto"
            role="navigation"
            aria-label="Main navigation"
            id="main-navigation"
          >
            {siteConfig.navigation.map((link: NavigationLink) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2 xl:px-3 py-2 text-xs lg:text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md whitespace-nowrap ${
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
          <div className="hidden xl:flex flex-shrink-0 ml-2">
            <Button
              variant="primary"
              size="sm"
              className="font-semibold whitespace-nowrap text-sm px-3 py-2 h-auto"
              asChild
            >
              <Link href="/donate">Donate</Link>
            </Button>
          </div>

          {/* Mobile Menu Button & Donate */}
          <div className="xl:hidden flex items-center gap-2 flex-shrink-0">
            <Button
              variant="primary"
              size="sm"
              className="font-semibold text-xs px-2 py-1.5 h-auto whitespace-nowrap"
              asChild
            >
              <Link href="/donate">Donate</Link>
            </Button>
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="true"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out xl:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#ffffff' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span 
                id="mobile-menu-title"
                className="text-base font-bold text-gray-900 font-heading"
              >
                SCES
              </span>
            </div>
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex-shrink-0"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav 
            className="flex-1 px-3 py-4 space-y-1 bg-white overflow-y-auto"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {siteConfig.navigation.map((link: NavigationLink) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
          <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
            <Button
              variant="primary"
              size="md"
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