import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { AppView, OosabUser } from '../types';
import { OosabLogo } from './OosabLogo';

interface HeaderProps {
  currentView: AppView;
  user: OosabUser | null;
  onNavigate: (view: AppView, sectionId?: string) => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  user,
  onNavigate,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (view: AppView, sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(view, sectionId);
  };

  const isLandingTop = currentView === 'landing' && !scrolled && !mobileMenuOpen;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isLandingTop
          ? 'bg-transparent border-b border-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-[#E3E8EE]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('landing', 'top');
          }}
          className="whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF] rounded-sm"
        >
          <OosabLogo tone="light" size={30} />
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-[#0A2540]"
        >
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('landing', 'features');
            }}
            className="hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
          >
            Features
          </a>
          <a
            href="#wallets"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('landing', 'wallets');
            }}
            className="hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
          >
            Wallets
          </a>
          <a
            href="#cards"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('landing', 'cards');
            }}
            className="hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
          >
            Cards
          </a>
          {user ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSignOut();
              }}
              className="hover:opacity-70 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleLinkClick('login')}
              className={`hover:opacity-70 transition-opacity whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'login' ? 'text-[#635BFF]' : ''
              }`}
            >
              Sign in
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={() => handleLinkClick('dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5249F5] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <span>Card portal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleLinkClick('register')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5249F5] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <span>Get started</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-[#0A2540] hover:bg-black/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E3E8EE] bg-white px-6 py-4 space-y-3">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('landing', 'features');
            }}
            className="block py-2 text-sm font-semibold text-[#0A2540]"
          >
            Features
          </a>
          <a
            href="#wallets"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('landing', 'wallets');
            }}
            className="block py-2 text-sm font-semibold text-[#0A2540]"
          >
            Wallets
          </a>
          <a
            href="#cards"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('landing', 'cards');
            }}
            className="block py-2 text-sm font-semibold text-[#0A2540]"
          >
            Cards
          </a>
          <div className="pt-2 border-t border-[#E3E8EE] flex flex-col gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => handleLinkClick('dashboard')}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#635BFF] rounded-md text-center"
                >
                  Card portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-[#0A2540] border border-[#E3E8EE] rounded-md text-center"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleLinkClick('login')}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-[#0A2540] border border-[#E3E8EE] rounded-md text-center"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('register')}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#635BFF] rounded-md text-center"
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
