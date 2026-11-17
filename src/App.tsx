/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { AppView, OosabUser } from './types';
import { DEMO_TEAM_USER } from './data/wallets';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesShowcase } from './components/FeaturesShowcase';
import { WalletsSection } from './components/WalletsSection';
import { CardDesignBand } from './components/CardDesignBand';
import { ConversionFooter } from './components/ConversionFooter';
import { AuthFlow } from './components/AuthFlow';
import { Dashboard } from './components/Dashboard';

const USERS_STORAGE_KEY = 'oosab_team_users_v1';
const SESSION_STORAGE_KEY = 'oosab_team_session_v1';

function loadInitialUsers(): OosabUser[] {
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as OosabUser[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to default seed user
  }
  return [DEMO_TEAM_USER];
}

function loadActiveUser(users: OosabUser[]): OosabUser | null {
  try {
    const activeId = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (activeId) {
      return users.find((u) => u.id === activeId) || null;
    }
  } catch {
    // Ignore storage error
  }
  return null;
}

export default function App() {
  const [users, setUsers] = useState<OosabUser[]>(() => loadInitialUsers());
  const [activeUser, setActiveUser] = useState<OosabUser | null>(() =>
    loadActiveUser(loadInitialUsers())
  );
  const [view, setView] = useState<AppView>('landing');
  const [preselectedWalletId, setPreselectedWalletId] = useState<string | undefined>(undefined);
  const [isOpeningRegister, setIsOpeningRegister] = useState(false);
  const registerTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // Ignore quota errors
    }
  }, [users]);

  useEffect(() => {
    try {
      if (activeUser) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, activeUser.id);
      } else {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [activeUser]);

  useEffect(() => {
    return () => {
      if (registerTimerRef.current) {
        window.clearTimeout(registerTimerRef.current);
      }
    };
  }, []);

  const openRegisterWithLoader = (walletId?: string) => {
    if (registerTimerRef.current) {
      window.clearTimeout(registerTimerRef.current);
    }
    if (walletId) {
      setPreselectedWalletId(walletId);
    }
    setIsOpeningRegister(true);
    setView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    registerTimerRef.current = window.setTimeout(() => {
      setIsOpeningRegister(false);
    }, 650);
  };

  const handleNavigate = (nextView: AppView, sectionId?: string) => {
    if (nextView === 'register') {
      openRegisterWithLoader();
      return;
    }
    if (registerTimerRef.current) {
      window.clearTimeout(registerTimerRef.current);
    }
    setIsOpeningRegister(false);
    setView(nextView);
    if (nextView === 'landing' && sectionId) {
      window.requestAnimationFrame(() => {
        if (sectionId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartWithWallet = (walletId: string) => {
    if (activeUser) {
      handleUpdateUser({ ...activeUser, connectedWalletId: walletId });
      setView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    openRegisterWithLoader(walletId);
  };

  const handleCompleteAuth = (user: OosabUser, isNewUser: boolean) => {
    if (isNewUser) {
      setUsers((prev) => [user, ...prev]);
    } else {
      setUsers((prev) =>
        prev.some((u) => u.id === user.id) ? prev : [user, ...prev]
      );
    }
    setActiveUser(user);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUser = (updated: OosabUser) => {
    setActiveUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleSignOut = () => {
    setActiveUser(null);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A2540]">
      <Header
        currentView={view}
        user={activeUser}
        onNavigate={handleNavigate}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {view === 'landing' && (
          <>
            <HeroSection
              onGetStarted={() => handleNavigate(activeUser ? 'dashboard' : 'register')}
              onSelectWallet={handleStartWithWallet}
            />
            <FeaturesShowcase
              onGetStarted={() => handleNavigate(activeUser ? 'dashboard' : 'register')}
            />
            <WalletsSection onConnectWallet={handleStartWithWallet} />
            <CardDesignBand
              onGetStarted={() => handleNavigate(activeUser ? 'dashboard' : 'register')}
            />
            <ConversionFooter
              onGetStarted={() => handleNavigate(activeUser ? 'dashboard' : 'register')}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {(view === 'login' || view === 'register') && (
          isOpeningRegister && view === 'register' ? (
            <div className="min-h-[calc(100vh-4rem)] bg-[#F5F5F7] flex items-center justify-center px-6 py-16">
              <div className="w-full max-w-md bg-white border border-[#E5E5EA] rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center space-y-5">
                <div className="mx-auto w-11 h-11 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-lg font-semibold tracking-tight text-[#1D1D1F]">
                    Opening OOSAB Registration
                  </h2>
                  <p className="text-sm text-[#6E6E73]">
                    Preparing your account and card setup...
                  </p>
                </div>
                <div className="w-full h-1 bg-[#E5E5EA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1D1D1F] rounded-full animate-pulse w-2/3" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#86868B]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1D1D1F]" />
                  <span>Zero upfront deposit · Encrypted onboarding</span>
                </div>
              </div>
            </div>
          ) : (
            <AuthFlow
              mode={view}
              preselectedWalletId={preselectedWalletId}
              existingUsers={users}
              onSwitchMode={(nextMode) => {
                if (nextMode === 'register') {
                  openRegisterWithLoader();
                } else {
                  setView(nextMode);
                }
              }}
              onCompleteAuth={handleCompleteAuth}
              onBackToSite={() => handleNavigate('landing', 'top')}
            />
          )
        )}

        {view === 'dashboard' && activeUser && (
          <Dashboard
            user={activeUser}
            onUpdateUser={handleUpdateUser}
            onBackToWebsite={() => handleNavigate('landing', 'top')}
          />
        )}
      </main>
    </div>
  );
}
