'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
const Logo = dynamic(() => import('@/components/ui/Logo'), { ssr: false });
import { Button } from '@/components/ui/Button';
import { siteConfig, navigationGroups } from '@/config/site';
import { NavigationLink } from '@/types';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [participateDropdownOpen, setParticipateDropdownOpen] = useState(false);
  const pathname = usePathname();
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const participateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setAboutDropdownOpen(false);
    setParticipateDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(e.target as Node)) {
        setAboutDropdownOpen(false);
      }
      if (participateDropdownRef.current && !participateDropdownRef.current.contains(e.target as Node)) {
        setParticipateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isGroupActive = (links: NavigationLink[]) => 
    links.some(link => isActiveLink(link.href));

  const navLinkClass = (active: boolean) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md whitespace-nowrap ${
      active ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`;

  const dropdownButtonClass = (active: boolean) =>
    `flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      active ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`;

  const dropdownItemClass = (active: boolean) =>
    `block px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
      active ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      } ${className}`}
      role="banner"
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-2 flex-nowrap">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-0.5"
          >
            <Logo size="sm" className="group-hover:scale-110 transition-transform duration-200" />
            <div className="hidden sm:block min-w-0">
              <span className="text-base lg:text-lg font-bold text-gray-900 font-heading truncate block">SCES</span>
              <p className="text-[10px] lg:text-xs text-gray-600 leading-tight whitespace-nowrap">Sunrise School</p>
            </div>
</Link>

          {/* Desktop Navigation */}
          <nav
             className="hidden lg:flex items-center gap-1 flex-nowrap"
             role="navigation"
             aria-label="Main navigation"
             id="main-navigation"
           >
             {/* Main Links */}
             {navigationGroups.main.map((link: NavigationLink) => (
               <Link key={link.href} href={link.href} className={navLinkClass(isActiveLink(link.href))}>
                 {link.label}
                 {isActiveLink(link.href) && (
                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                 )}
               </Link>
             ))}

             {/* About Dropdown */}
             {navigationGroups.about.length > 0 && (
               <div className="relative" ref={aboutDropdownRef}>
                 <button
                   onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                   className={dropdownButtonClass(isGroupActive(navigationGroups.about))}
                   aria-haspopup="true"
                   aria-expanded={aboutDropdownOpen}
                 >
                   About
                   <ChevronDown
                     className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`}
                   />
                   {isGroupActive(navigationGroups.about) && (
                     <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                   )}
                 </button>

                 {/* About Dropdown Panel */}
                 {aboutDropdownOpen && (
                   <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                     {navigationGroups.about.map((link: NavigationLink) => (
                       <Link
                         key={link.href}
                         href={link.href}
                         onClick={() => setAboutDropdownOpen(false)}
                         className={dropdownItemClass(isActiveLink(link.href))}
                       >
                         {link.label}
                       </Link>
                     ))}
                   </div>
                 )}
               </div>
             )}

             {/* Participate Dropdown */}
             {navigationGroups.participate.length > 0 && (
               <div className="relative" ref={participateDropdownRef}>
                 <button
                   onClick={() => setParticipateDropdownOpen(!participateDropdownOpen)}
                   className={dropdownButtonClass(isGroupActive(navigationGroups.participate))}
                   aria-haspopup="true"
                   aria-expanded={participateDropdownOpen}
                 >
                   Participate
                   <ChevronDown
                     className={`w-4 h-4 transition-transform duration-200 ${participateDropdownOpen ? 'rotate-180' : ''}`}
                   />
                   {isGroupActive(navigationGroups.participate) && (
                     <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                   )}
                 </button>

                 {/* Participate Dropdown Panel */}
                 {participateDropdownOpen && (
                   <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                     {navigationGroups.participate.map((link: NavigationLink) => (
                       <Link
                         key={link.href}
                         href={link.href}
                         onClick={() => setParticipateDropdownOpen(false)}
                         className={dropdownItemClass(isActiveLink(link.href))}
                       >
                         {link.label}
                       </Link>
                     ))}
                   </div>
                 )}
               </div>
             )}

             {/* Other Links (Blog, Contact) */}
             {navigationGroups.other.map((link: NavigationLink) => (
               <Link key={link.href} href={link.href} className={navLinkClass(isActiveLink(link.href))}>
                 {link.label}
                 {isActiveLink(link.href) && (
                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                 )}
               </Link>
             ))}
           </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex flex-shrink-0 ml-2">
            <Button variant="primary" size="sm" className="font-semibold whitespace-nowrap text-sm px-4 py-2 h-auto" asChild>
              <Link href="/donate">Donate</Link>
            </Button>
          </div>

          {/* Mobile: Donate + Hamburger */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <Button variant="primary" size="sm" className="font-semibold text-xs px-2 py-1.5 h-auto whitespace-nowrap" asChild>
              <Link href="/donate">Donate</Link>
            </Button>
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span id="mobile-menu-title" className="text-base font-bold text-gray-900 font-heading">SCES</span>
            </div>
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
</div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Mobile navigation">
            {[...navigationGroups.main, ...navigationGroups.about, ...navigationGroups.participate, ...navigationGroups.other].map((link: NavigationLink) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActiveLink(link.href) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={toggleMenu}
              >
{link.label}
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <Button variant="primary" size="md" className="w-full font-semibold" asChild>
              <Link href="/donate" onClick={toggleMenu}>Donate Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;