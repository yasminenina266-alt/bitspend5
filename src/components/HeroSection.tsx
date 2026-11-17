import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { SculptedDebitCard } from './BitspendCardVisual';
import { ApplePayMark, GooglePayMark, WalletLogo } from './WalletLogo';
import { StripeMeshCanvas } from './StripeMeshCanvas';

interface HeroSectionProps {
  onGetStarted: () => void;
  onSelectWallet: (walletId: string) => void;
}

const HERO_WALLETS = [
  { id: 'ledger', name: 'Ledger' },
  { id: 'trezor', name: 'Trezor' },
  { id: 'phantom', name: 'Phantom' },
  { id: 'trust', name: 'Trust Wallet' },
  { id: 'metamask', name: 'MetaMask' },
  { id: 'coinbase', name: 'Coinbase Wallet' },
  { id: 'rainbow', name: 'Rainbow' },
  { id: 'exodus', name: 'Exodus' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onSelectWallet,
}) => {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-white -mt-16 pt-24 pb-12 sm:pt-24 sm:pb-14 lg:pt-28 lg:pb-16 border-b border-[#E3E8EE]"
    >
      {/* Seamless Stripe-style animated mesh sweep extending right behind the transparent header */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-full lg:w-[68%] h-[420px] sm:h-[500px] lg:h-[580px] overflow-hidden"
        style={{
          clipPath: 'polygon(26% 0%, 100% 0%, 100% 72%, 4% 100%)',
        }}
      >
        <StripeMeshCanvas />
        {/* Soft left fade so hero text sits cleanly on crisp white */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(95deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.86) 24%, rgba(255,255,255,0) 54%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Crisp, High-Impact Stripe Typography */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-5 text-center lg:text-left"
          >
            <div className="hidden sm:block text-sm font-medium text-[#425466]">
              OOSAB crypto card · Zero upfront deposit · No KYC on sign-up
            </div>

            <h1
              className="font-extrabold tracking-tight leading-[1.08] text-balance"
              style={{ fontSize: 'clamp(2.15rem, 4.3vw, 3.65rem)' }}
            >
              <span className="text-[#0A2540]">Spend your bitcoin. </span>
              <span className="text-[#3C4B64]">
                Straight from your wallet, anywhere cards work.
              </span>
            </h1>

            <p className="text-base sm:text-[17px] text-[#425466] leading-relaxed max-w-lg mx-auto lg:mx-0">
              Get your <span className="font-semibold text-[#0A2540]">OOSAB</span> card in
              seconds, connect instantly to Apple Pay or Google Pay, and pay directly from Ledger,
              Trezor, Phantom, Trust Wallet, and more without depositing funds first.
            </p>

            {/* Primary CTA + Supported Wallets Anchor */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5249F5] rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Get started</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="#wallets"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#0A2540] bg-white hover:bg-[#F6F9FC] border border-[#E3E8EE] rounded-md shadow-2xs transition-colors whitespace-nowrap shrink-0"
              >
                <span>Supported wallets</span>
              </a>
            </div>

            {/* Authentic Apple Pay & Google Pay marks */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-xs font-medium text-[#425466]">Instant setup on</span>
              <div className="flex items-center gap-2">
                <ApplePayMark className="h-7 w-auto" />
                <GooglePayMark className="h-7 w-auto" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Non-Interactive Sculpted Debit Cards Side-by-Side */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center max-w-[360px] sm:max-w-none mx-auto">
              <SculptedDebitCard
                variant="obsidian"
                holderName="ALEX MERCER"
                lastFour="8841"
              />
              <SculptedDebitCard
                variant="aurora"
                holderName="ALEX MERCER"
                lastFour="3092"
              />
            </div>
          </motion.div>
        </div>

        {/* Clean Supported Wallets Row with Real Official Brand Icons — Symmetrical Grid on Mobile */}
        <div className="mt-10 sm:mt-12 lg:mt-16 pt-7 border-t border-[#E3E8EE]">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap lg:items-center lg:justify-between gap-x-5 gap-y-4">
            {HERO_WALLETS.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                onClick={() => onSelectWallet(wallet.id)}
                className="group flex items-center justify-center sm:justify-start gap-2.5 text-[#425466] hover:text-[#0A2540] transition-colors py-1.5 cursor-pointer"
              >
                <WalletLogo
                  walletId={wallet.id}
                  variant="branded"
                  className="w-6 h-6 transition-transform duration-200 group-hover:scale-105 shrink-0"
                />
                <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                  {wallet.name}
                </span>
              </button>
            ))}
            <a
              href="#wallets"
              className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-center lg:justify-end gap-1 text-xs font-semibold text-[#635BFF] hover:text-[#5249F5] whitespace-nowrap pt-1 lg:pt-0"
            >
              <span>+ Many others</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
