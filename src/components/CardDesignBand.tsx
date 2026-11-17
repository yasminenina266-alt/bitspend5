import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, RotateCw } from 'lucide-react';
import { SculptedDebitCard } from './BitspendCardVisual';
import { ApplePayMark, GooglePayMark } from './WalletLogo';

interface CardDesignBandProps {
  onGetStarted: () => void;
}

export const CardDesignBand: React.FC<CardDesignBandProps> = ({ onGetStarted }) => {
  const [activeVariant, setActiveVariant] = useState<'obsidian' | 'aurora'>('obsidian');
  const [showBack, setShowBack] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 12, y: px * 14 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const isObsidian = activeVariant === 'obsidian';

  return (
    <section
      id="cards"
      className="bg-[#F6F9FC] text-[#0A2540] py-14 sm:py-20 lg:py-24 border-b border-[#E3E8EE]"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 space-y-12 sm:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Clean Editorial Copy + Comparison */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4 text-center lg:text-left">
              <div className="text-sm font-semibold text-[#635BFF]">OOSAB cards</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.12] text-balance">
                Virtual cards issued instantly. Brushed titanium delivered on demand.
              </h2>
              <p className="text-base text-[#425466] leading-relaxed max-w-lg mx-auto lg:mx-0">
                Your <span className="font-semibold text-[#0A2540]">Aurora Virtual</span> card goes
                live the second you finish registration—ready for Apple Pay, Google Pay, and online
                checkouts. Whenever you want physical weight, order the laser-etched{' '}
                <span className="font-semibold text-[#0A2540]">Obsidian Metal</span> edition.
              </p>
            </div>

            {/* Unboxed hairline specs */}
            <div className="pt-2 space-y-4">
              <div className="pt-4 border-t border-[#E3E8EE] flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[#0A2540]">Aurora Virtual</div>
                  <div className="text-xs text-[#425466] mt-0.5">
                    Issued immediately · Instant Apple Pay &amp; Google Pay sync
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-[#635BFF] shrink-0">
                  Instant
                </span>
              </div>

              <div className="pt-4 border-t border-[#E3E8EE] flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[#0A2540]">Obsidian Titanium</div>
                  <div className="text-xs text-[#425466] mt-0.5">
                    18g anodized metal · Contactless NFC · Zero deposit required
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-[#0A2540] shrink-0">
                  On demand
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5249F5] rounded-md shadow-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Issue your OOSAB card</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <ApplePayMark className="h-7 w-auto" />
                <GooglePayMark className="h-7 w-auto" />
              </div>
            </div>
          </div>

          {/* Right: Unified Interactive Sculpted Card Stage */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl bg-white border border-[#E3E8EE] p-5 sm:p-10 shadow-[0_24px_60px_-18px_rgba(10,37,64,0.12)] overflow-hidden">
              {/* Soft subtle ambient glow matching active card finish */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30 transition-colors duration-500"
                style={{
                  background: isObsidian
                    ? 'radial-gradient(circle, #635BFF 0%, #0A2540 65%, transparent 100%)'
                    : 'radial-gradient(circle, #FF5E7E 0%, #635BFF 65%, transparent 100%)',
                }}
              />

              {/* Top Controls */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 mb-7 sm:mb-8">
                <div className="flex items-center gap-1 p-1 bg-[#F6F9FC] border border-[#E3E8EE] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveVariant('obsidian')}
                    className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeVariant === 'obsidian'
                        ? 'bg-white text-[#0A2540] shadow-xs'
                        : 'text-[#425466] hover:text-[#0A2540]'
                    }`}
                  >
                    Obsidian Metal
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVariant('aurora')}
                    className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeVariant === 'aurora'
                        ? 'bg-white text-[#0A2540] shadow-xs'
                        : 'text-[#425466] hover:text-[#0A2540]'
                    }`}
                  >
                    Aurora Virtual
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBack((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#425466] hover:text-[#0A2540] bg-[#F6F9FC] border border-[#E3E8EE] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{showBack ? 'View front' : 'Flip card'}</span>
                </button>
              </div>

              {/* 3D Tilt & Flip Card Stage */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={resetTilt}
                className="relative z-10 flex justify-center py-2"
                style={{ perspective: '1100px' }}
              >
                <motion.div
                  animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y + (showBack ? 180 : 0),
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative w-full max-w-[340px] sm:max-w-[400px]"
                >
                  {/* Card Front */}
                  <div style={{ backfaceVisibility: 'hidden' }}>
                    <SculptedDebitCard
                      variant={activeVariant}
                      holderName="ALEX MERCER"
                      lastFour={isObsidian ? '8841' : '3092'}
                    />
                  </div>

                  {/* Card Back */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: isObsidian
                        ? 'linear-gradient(135deg, #171D2B 0%, #0D111B 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #ECE9FF 55%, #FFE4F1 100%)',
                    }}
                    className={`absolute inset-0 aspect-[1.586/1] w-full rounded-[18px] py-5 select-none overflow-hidden flex flex-col justify-between ${
                      isObsidian
                        ? 'text-white border border-white/15 shadow-2xl'
                        : 'text-[#0A2540] border border-[#CBD5E1] shadow-2xl'
                    }`}
                  >
                    {/* Magnetic Stripe */}
                    <div
                      className={`w-full h-10 ${
                        isObsidian ? 'bg-[#05070B]' : 'bg-[#1E293B]'
                      }`}
                    />

                    {/* Signature Strip + CVV */}
                    <div className="px-6 flex items-center gap-3">
                      <div
                        className={`flex-1 h-8 rounded-[4px] flex items-center justify-end px-3 font-mono text-xs ${
                          isObsidian
                            ? 'bg-white/90 text-[#0A2540]'
                            : 'bg-white border border-[#CBD5E1] text-[#0A2540]'
                        }`}
                      >
                        <span className="opacity-60 mr-2">CVV</span>
                        <span className="font-bold">418</span>
                      </div>
                      <span
                        className={`text-xs font-extrabold ${
                          isObsidian ? 'text-[#F7931A]' : 'text-[#635BFF]'
                        }`}
                      >
                        ₿
                      </span>
                    </div>

                    {/* Engraving Details */}
                    <div className="px-6 flex items-center justify-between text-[10px] opacity-70">
                      <span>Direct Self-Custody · Zero Pre-Deposit</span>
                      <span className="font-semibold tracking-[0.12em]">OOSAB</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="relative z-10 mt-6 text-center text-xs text-[#64748B]">
                Move cursor to tilt · Click &ldquo;Flip card&rdquo; to inspect front and back
              </div>
            </div>
          </div>
        </div>

        {/* Unboxed Tabular Metrics Row */}
        <div className="pt-8 border-t border-[#E3E8EE] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
          <div>
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-[#0A2540]">
              130M+
            </div>
            <div className="text-xs sm:text-sm text-[#425466] mt-1">
              Global contactless merchants
            </div>
          </div>
          <div>
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-[#0A2540]">
              &lt;400ms
            </div>
            <div className="text-xs sm:text-sm text-[#425466] mt-1">
              Real-time wallet authorization
            </div>
          </div>
          <div>
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-[#0A2540]">
              $0
            </div>
            <div className="text-xs sm:text-sm text-[#425466] mt-1">
              Upfront deposit required
            </div>
          </div>
          <div>
            <div className="font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-[#635BFF]">
              0 IDs
            </div>
            <div className="text-xs sm:text-sm text-[#425466] mt-1">
              No KYC required to register
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
