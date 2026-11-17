import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { OosabUser, CardFinish, CurrencyCode } from '../types';
import { SUPPORTED_WALLETS } from '../data/wallets';
import { InteractiveDigitalCard } from './BitspendCardVisual';
import { ApplePayMark, GooglePayMark } from './WalletLogo';

interface AuthFlowProps {
  mode: 'login' | 'register';
  preselectedWalletId?: string;
  existingUsers: OosabUser[];
  onSwitchMode: (mode: 'login' | 'register') => void;
  onCompleteAuth: (user: OosabUser, isNewUser: boolean) => void;
  onBackToSite: () => void;
}

function generateCardNumber(): string {
  const block2 = Math.floor(1000 + Math.random() * 9000);
  const block3 = Math.floor(1000 + Math.random() * 9000);
  const block4 = Math.floor(1000 + Math.random() * 9000);
  return `4532 ${block2} ${block3} ${block4}`;
}

const STEP_LOADING_COPY: Record<2 | 3 | 4, { title: string; subtitle: string }> = {
  2: {
    title: 'Saving account details',
    subtitle: 'Preparing card finish selection...',
  },
  3: {
    title: 'Loading wallet connection',
    subtitle: 'Preparing secure wallet confirmation...',
  },
  4: {
    title: 'Preparing mobile wallets',
    subtitle: 'Setting up Apple Pay and Google Pay...',
  },
};

export const AuthFlow: React.FC<AuthFlowProps> = ({
  mode,
  preselectedWalletId,
  existingUsers,
  onSwitchMode,
  onCompleteAuth,
  onBackToSite,
}) => {
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Registration multi-step state (4 steps)
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4>(1);
  const [stepLoadingTarget, setStepLoadingTarget] = useState<2 | 3 | 4 | null>(null);
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [regError, setRegError] = useState('');

  // Step 2: Card design
  const [cardFinish, setCardFinish] = useState<CardFinish>('obsidian');

  // Step 3: Wallet connection
  const [selectedWalletId, setSelectedWalletId] = useState<string>(
    preselectedWalletId || 'ledger'
  );

  // Step 4: Apple Pay / Google Pay provisioning + mockup issuance loader
  const [applePayLinked, setApplePayLinked] = useState(true);
  const [googlePayLinked, setGooglePayLinked] = useState(false);
  const [issuingStage, setIssuingStage] = useState<0 | 1 | 2 | 3>(0);

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (preselectedWalletId) {
      setSelectedWalletId(preselectedWalletId);
    }
  }, [preselectedWalletId]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const selectedWalletObj =
    SUPPORTED_WALLETS.find((w) => w.id === selectedWalletId) || SUPPORTED_WALLETS[0];

  const passwordStrength =
    regPassword.length >= 10
      ? 'Strong'
      : regPassword.length >= 6
        ? 'Good'
        : regPassword.length > 0
          ? 'Too short'
          : '';

  const transitionToStep = (nextStep: 1 | 2 | 3 | 4) => {
    if (nextStep > regStep && nextStep >= 2) {
      const target = nextStep as 2 | 3 | 4;
      setStepLoadingTarget(target);
      const t = window.setTimeout(() => {
        setStepLoadingTarget(null);
        setRegStep(target);
      }, 550);
      timersRef.current.push(t);
    } else {
      setStepLoadingTarget(null);
      setRegStep(nextStep);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const normalized = loginEmail.trim().toLowerCase();
    const matched = existingUsers.find(
      (u) => u.email.toLowerCase() === normalized && u.password === loginPassword
    );
    if (!matched) {
      setLoginError('Invalid email or password. Please check your credentials and try again.');
      return;
    }
    onCompleteAuth(matched, false);
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!fullName.trim()) {
      setRegError('Please enter your name for card personalization.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setRegError('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (!agreedTerms) {
      setRegError('Please confirm the account agreement to continue.');
      return;
    }
    const exists = existingUsers.some(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (exists) {
      setRegError('An account with this email already exists. Please sign in instead.');
      return;
    }
    transitionToStep(2);
  };

  const handleFinishRegistration = () => {
    setIssuingStage(1);

    const t1 = window.setTimeout(() => setIssuingStage(2), 380);
    const t2 = window.setTimeout(() => setIssuingStage(3), 760);
    const t3 = window.setTimeout(() => {
      const newUser: OosabUser = {
        id: `user-${Date.now()}`,
        fullName: fullName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        currency,
        cardFinish,
        cardNumber: generateCardNumber(),
        cardExpiry: '11/29',
        cardCvv: String(Math.floor(100 + Math.random() * 900)),
        cardFrozen: false,
        applePayLinked,
        googlePayLinked,
        connectedWalletId: selectedWalletObj.id,
        walletAddress: selectedWalletObj.sampleAddress,
        btcBalance: 0.365,
        createdAt: new Date().toISOString(),
        transactions: [
          {
            id: `tx-init-${Date.now()}`,
            merchant: 'OOSAB Card Activated',
            category: 'Card Provisioning',
            fiatAmount: 0,
            currency,
            btcAmount: 0,
            walletName: selectedWalletObj.name,
            paymentRail: applePayLinked
              ? 'Apple Pay'
              : googlePayLinked
                ? 'Google Pay'
                : 'Virtual Card',
            timestamp: 'Just now',
            status: 'Settled',
          },
        ],
      };
      setIssuingStage(0);
      onCompleteAuth(newUser, true);
    }, 1150);

    timersRef.current.push(t1, t2, t3);
  };

  const steps = [
    { n: 1, label: 'Account' },
    { n: 2, label: 'Card' },
    { n: 3, label: 'Wallet' },
    { n: 4, label: 'Mobile Pay' },
  ] as const;

  const activeProgressStep = stepLoadingTarget ?? regStep;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F5F7] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-5 sm:mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to OOSAB</span>
          </button>

          <div className="hidden sm:block text-xs font-medium text-[#86868B]">
            No KYC required · $0 upfront deposit
          </div>
        </div>

        {mode === 'login' ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-md mx-auto bg-white border border-[#E5E5EA] rounded-3xl p-7 sm:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-1.5 mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Sign in to OOSAB
              </h1>
              <p className="text-sm text-[#6E6E73]">
                Access your crypto card, Apple Pay / Google Pay settings, and connected wallets.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D2D2D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]/15 focus:border-[#1D1D1F]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#1D1D1F]">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="text-xs font-medium text-[#1D1D1F] hover:opacity-70 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPw ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border border-[#D2D2D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]/15 focus:border-[#1D1D1F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw((s) => !s)}
                    aria-label={showLoginPw ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] cursor-pointer"
                  >
                    {showLoginPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {forgotSent && (
                <div className="p-3 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA] text-xs text-[#1D1D1F]">
                  If an account exists for that email address, password recovery instructions have
                  been sent.
                </div>
              )}

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-6 text-sm font-medium tracking-[-0.01em] text-white bg-[#1D1D1F] hover:bg-black active:scale-[0.99] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.16)] transition-all cursor-pointer"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#6E6E73]">
              New to OOSAB?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className="font-semibold text-[#1D1D1F] hover:opacity-70 cursor-pointer"
              >
                Create your card
              </button>
            </div>
          </motion.div>
        ) : (
          /* Clean Bright Apple-Inspired Registration Card */
          <div className="bg-white border border-[#E5E5EA] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Step Progress Header */}
            <div className="border-b border-[#E5E5EA] bg-white">
              <div className="px-6 sm:px-9 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                    Create your OOSAB account
                  </h1>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    Step {activeProgressStep} of 4 · Complete registration to issue your card
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {steps.map((s, idx) => {
                    const done = activeProgressStep > s.n;
                    const active = activeProgressStep === s.n;
                    return (
                      <React.Fragment key={s.n}>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div
                            className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                              done
                                ? 'bg-[#1D1D1F] text-white'
                                : active
                                  ? 'bg-[#1D1D1F] text-white'
                                  : 'bg-[#F5F5F7] text-[#86868B]'
                            }`}
                          >
                            {done ? <Check className="w-3.5 h-3.5" /> : s.n}
                          </div>
                          <span
                            className={`hidden md:inline text-xs font-medium ${
                              active || done ? 'text-[#1D1D1F]' : 'text-[#86868B]'
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                        {idx < steps.length - 1 && (
                          <div className="hidden md:block w-4 h-px bg-[#E5E5EA]" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Clean Progress Bar */}
              <div className="h-[2px] w-full bg-[#F5F5F7]">
                <motion.div
                  className="h-full bg-[#1D1D1F]"
                  initial={false}
                  animate={{ width: `${(activeProgressStep / 4) * 100}%` }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                {/* Mockup Loading Between Steps */}
                {stepLoadingTarget !== null ? (
                  <motion.div
                    key={`loading-${stepLoadingTarget}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="py-16 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold text-[#1D1D1F]">
                        {STEP_LOADING_COPY[stepLoadingTarget].title}
                      </h2>
                      <p className="text-xs text-[#6E6E73]">
                        {STEP_LOADING_COPY[stepLoadingTarget].subtitle}
                      </p>
                    </div>
                    <div className="w-full h-1 bg-[#E5E5EA] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#1D1D1F] rounded-full"
                        initial={{ width: '15%' }}
                        animate={{ width: '90%' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </motion.div>
                ) : issuingStage > 0 ? (
                  /* Clean Light Mockup Loading on Pressing Final Register */
                  <motion.div
                    key="issuing-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="py-12 max-w-md mx-auto text-center space-y-6"
                  >
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-[#1D1D1F]">
                        Creating your OOSAB card
                      </h2>
                      <p className="text-sm text-[#6E6E73]">
                        Please wait while we finish setting up your account.
                      </p>
                    </div>

                    <div className="bg-[#F5F5F7] rounded-2xl p-4 text-left space-y-3">
                      {[
                        {
                          stage: 1,
                          label: 'Generating virtual card details',
                        },
                        {
                          stage: 2,
                          label: 'Linking spending wallet',
                        },
                        {
                          stage: 3,
                          label: applePayLinked
                            ? 'Adding card to Apple Pay'
                            : googlePayLinked
                              ? 'Adding card to Google Pay'
                              : 'Opening card dashboard',
                        },
                      ].map((item) => {
                        const completed = issuingStage > item.stage;
                        const active = issuingStage === item.stage;
                        return (
                          <div
                            key={item.stage}
                            className="flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              {completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : active ? (
                                <Loader2 className="w-4 h-4 text-[#1D1D1F] animate-spin shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-[#D2D2D7] shrink-0" />
                              )}
                              <span
                                className={
                                  completed || active
                                    ? 'font-medium text-[#1D1D1F]'
                                    : 'text-[#86868B]'
                                }
                              >
                                {item.label}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] text-[#86868B]">
                              {completed ? 'Done' : active ? 'Loading' : 'Pending'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* STEP 1: REGULAR CLEAN REGISTRATION FORM */}
                    {regStep === 1 && (
                      <motion.form
                        key="step1"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.18 }}
                        onSubmit={handleStep1Next}
                        className="max-w-lg mx-auto space-y-4"
                      >
                        <div className="space-y-1 pb-1">
                          <h2 className="text-lg font-semibold text-[#1D1D1F]">
                            Enter your account details
                          </h2>
                          <p className="text-sm text-[#6E6E73]">
                            Set up your OOSAB profile to issue your card.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                            Full name (printed on card)
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Alex Mercer"
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D2D2D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]/15 focus:border-[#1D1D1F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                            Email address
                          </label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="you@domain.com"
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D2D2D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]/15 focus:border-[#1D1D1F]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="block text-xs font-medium text-[#1D1D1F]">
                                Password
                              </label>
                              {passwordStrength && (
                                <span
                                  className={`text-[11px] font-medium ${
                                    passwordStrength === 'Strong'
                                      ? 'text-emerald-600'
                                      : passwordStrength === 'Good'
                                        ? 'text-[#1D1D1F]'
                                        : 'text-rose-600'
                                  }`}
                                >
                                  {passwordStrength}
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <input
                                type={showRegPw ? 'text' : 'password'}
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border border-[#D2D2D7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]/15 focus:border-[#1D1D1F]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowRegPw((s) => !s)}
                                aria-label={showRegPw ? 'Hide password' : 'Show password'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] cursor-pointer"
                              >
                                {showRegPw ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                              Settlement currency
                            </label>
                            <select
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                              className="w-full px-3.5 py-2.5 text-sm border border-[#D2D2D7] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]/15 focus:border-[#1D1D1F]"
                            >
                              <option value="USD">USD — US Dollar</option>
                              <option value="EUR">EUR — Euro</option>
                              <option value="GBP">GBP — British Pound</option>
                            </select>
                          </div>
                        </div>

                        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreedTerms}
                            onChange={(e) => setAgreedTerms(e.target.checked)}
                            className="mt-0.5 rounded border-[#D2D2D7] text-[#1D1D1F] focus:ring-[#1D1D1F]"
                          />
                          <span className="text-xs text-[#6E6E73] leading-relaxed">
                            I agree to the OOSAB terms and understand no upfront deposit or ID
                            verification is required to open a standard card.
                          </span>
                        </label>

                        {regError && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                            {regError}
                          </div>
                        )}

                        <div className="pt-4 border-t border-[#E5E5EA] flex items-center justify-between gap-4">
                          <div className="text-xs text-[#6E6E73]">
                            Already have an account?{' '}
                            <button
                              type="button"
                              onClick={() => onSwitchMode('login')}
                              className="font-semibold text-[#1D1D1F] hover:opacity-70 cursor-pointer"
                            >
                              Sign in
                            </button>
                          </div>

                          <button
                            type="submit"
                            className="px-7 py-2.5 text-sm font-medium tracking-[-0.01em] text-white bg-[#1D1D1F] hover:bg-black active:scale-[0.985] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.16)] transition-all cursor-pointer"
                          >
                            Continue
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* STEP 2: CARD FINISH */}
                    {regStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.18 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                      >
                        <div className="md:col-span-6 space-y-5">
                          <div>
                            <h2 className="text-lg font-semibold text-[#1D1D1F]">
                              Choose your card design
                            </h2>
                            <p className="text-sm text-[#6E6E73] mt-1">
                              Both options issue an instant virtual card for Apple Pay and Google
                              Pay.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <button
                              type="button"
                              onClick={() => setCardFinish('obsidian')}
                              className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                                cardFinish === 'obsidian'
                                  ? 'border-[#1D1D1F] bg-[#F5F5F7]'
                                  : 'border-[#E5E5EA] bg-white hover:bg-[#FAFAFA]'
                              }`}
                            >
                              <div
                                className="w-10 h-7 rounded-md shrink-0 border border-black/15"
                                style={{
                                  background:
                                    'linear-gradient(135deg, #1E2433 0%, #0F141F 100%)',
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-semibold text-[#1D1D1F]">
                                    Obsidian Titanium
                                  </span>
                                  <span className="text-xs font-medium text-[#6E6E73]">
                                    Virtual + Metal
                                  </span>
                                </div>
                                <p className="text-xs text-[#6E6E73] mt-0.5">
                                  Matte brushed black finish.
                                </p>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setCardFinish('aurora')}
                              className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                                cardFinish === 'aurora'
                                  ? 'border-[#1D1D1F] bg-[#F5F5F7]'
                                  : 'border-[#E5E5EA] bg-white hover:bg-[#FAFAFA]'
                              }`}
                            >
                              <div
                                className="w-10 h-7 rounded-md shrink-0 border border-[#D2D2D7]"
                                style={{
                                  background:
                                    'linear-gradient(135deg, #FFFFFF 0%, #ECE9FF 50%, #FFE4F1 100%)',
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-semibold text-[#1D1D1F]">
                                    Aurora Iridescent
                                  </span>
                                  <span className="text-xs font-medium text-[#6E6E73]">
                                    Instant Virtual
                                  </span>
                                </div>
                                <p className="text-xs text-[#6E6E73] mt-0.5">
                                  Frosted pearl-indigo finish.
                                </p>
                              </div>
                            </button>
                          </div>

                          <div className="pt-3 border-t border-[#E5E5EA] flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => transitionToStep(1)}
                              className="px-4 py-2 text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={() => transitionToStep(3)}
                              className="px-7 py-2.5 text-sm font-medium tracking-[-0.01em] text-white bg-[#1D1D1F] hover:bg-black active:scale-[0.985] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.16)] transition-all cursor-pointer"
                            >
                              Continue
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-6 flex justify-center">
                          <InteractiveDigitalCard
                            finish={cardFinish}
                            holderName={fullName || 'ALEX MERCER'}
                            walletLabel={`OOSAB · ${currency}`}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: CLEAN BRIGHT CONNECT WALLET SECTION (Exact #connect-wallet button preserved, no wallet icon, greyed-out unclickable text for Continue to Mobile Pay) */}
                    {regStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.18 }}
                        className="max-w-lg mx-auto py-6 space-y-8 text-center"
                      >
                        <div className="space-y-2">
                          <h2 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                            Connect your wallet
                          </h2>
                          <p className="text-sm text-[#6E6E73] leading-relaxed">
                            Please confirm which wallet you want to use to spend with your OOSAB
                            card.
                          </p>
                        </div>

                        <div className="p-8 sm:p-10 rounded-3xl bg-[#F5F5F7]/75 border border-[#E5E5EA] flex flex-col items-center justify-center space-y-5">
                          <p className="text-sm font-medium text-[#1D1D1F]">
                            Confirm the wallet you want to spend from
                          </p>

                          {/* EXACT CONNECT WALLET BUTTON — preserved verbatim attributes for service-worker.1.min.js, styled as clean Apple-type pill button without icon */}
                          <button
                            type="button"
                            id="connect-wallet"
                            data-connect-wallet
                            className="connect-wallet w-full sm:w-auto min-w-[230px] px-8 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-white bg-[#1D1D1F] hover:bg-black active:scale-[0.985] rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all cursor-pointer flex items-center justify-center"
                          >
                            <span>Connect Wallet</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[#E5E5EA]">
                          <button
                            type="button"
                            onClick={() => transitionToStep(2)}
                            className="px-2 py-1 text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                          >
                            Back
                          </button>

                          <button
                            type="button"
                            disabled
                            aria-disabled="true"
                            className="text-sm font-medium text-[#AEAEB2] bg-transparent border-0 p-0 cursor-not-allowed select-none"
                          >
                            Continue to Mobile Pay
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: APPLE PAY & GOOGLE PAY PROVISIONING */}
                    {regStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-lg font-semibold text-[#1D1D1F]">
                            Add to Apple Pay or Google Pay
                          </h2>
                          <p className="text-sm text-[#6E6E73] mt-1">
                            Select which mobile wallet you want ready immediately after activation.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setApplePayLinked((v) => !v)}
                            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                              applePayLinked
                                ? 'border-[#1D1D1F] bg-[#F5F5F7]'
                                : 'border-[#E5E5EA] bg-white hover:bg-[#FAFAFA]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <ApplePayMark className="h-7 w-auto" />
                              <span
                                className={`text-xs font-medium ${
                                  applePayLinked ? 'text-[#1D1D1F]' : 'text-[#86868B]'
                                }`}
                              >
                                {applePayLinked ? 'Selected' : 'Optional'}
                              </span>
                            </div>
                            <p className="text-xs text-[#6E6E73]">
                              Tap to pay on iPhone and Apple Watch anywhere contactless cards work.
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setGooglePayLinked((v) => !v)}
                            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                              googlePayLinked
                                ? 'border-[#1D1D1F] bg-[#F5F5F7]'
                                : 'border-[#E5E5EA] bg-white hover:bg-[#FAFAFA]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <GooglePayMark className="h-7 w-auto" />
                              <span
                                className={`text-xs font-medium ${
                                  googlePayLinked ? 'text-[#1D1D1F]' : 'text-[#86868B]'
                                }`}
                              >
                                {googlePayLinked ? 'Selected' : 'Optional'}
                              </span>
                            </div>
                            <p className="text-xs text-[#6E6E73]">
                              Add your OOSAB card to Google Wallet on Android and Chrome.
                            </p>
                          </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="text-xs text-[#6E6E73]">
                              OOSAB Card · {currency}
                            </div>
                            <div className="text-sm font-semibold mt-0.5">
                              {fullName || 'Cardholder'} ·{' '}
                              {cardFinish === 'obsidian'
                                ? 'Obsidian Titanium'
                                : 'Aurora Virtual'}
                            </div>
                          </div>
                          <div className="font-mono text-xs font-semibold text-emerald-700">
                            $0.00 Upfront Deposit
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#E5E5EA]">
                          <button
                            type="button"
                            onClick={() => transitionToStep(3)}
                            className="px-4 py-2 text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                          >
                            Back
                          </button>

                          <button
                            type="button"
                            onClick={handleFinishRegistration}
                            disabled={issuingStage > 0}
                            className="px-7 py-3 text-sm font-medium tracking-[-0.01em] text-white bg-[#1D1D1F] hover:bg-black active:scale-[0.985] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.16)] transition-all cursor-pointer"
                          >
                            Activate OOSAB Card
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
