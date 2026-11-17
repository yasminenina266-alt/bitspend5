import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wifi } from 'lucide-react';
import { CardFinish } from '../types';
import { OosabLogo } from './OosabLogo';
import obsidianImg from '/src/assets/images/oosab_obsidian_card_1794873795769.jpg';
import auroraImg from '/src/assets/images/oosab_aurora_card_1794873797514.jpg';

interface BitspendCardPhotoProps {
  finish: CardFinish;
  className?: string;
}

export const BitspendCardPhoto: React.FC<BitspendCardPhotoProps> = ({
  finish,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const src = finish === 'obsidian' ? obsidianImg : auroraImg;
  const alt =
    finish === 'obsidian'
      ? 'OOSAB Obsidian Titanium crypto debit card'
      : 'OOSAB Aurora Iridescent crypto debit card';

  if (imgError) {
    return (
      <div
        className={`relative aspect-[4/3] w-full rounded-xl overflow-hidden flex items-center justify-center p-6 ${
          finish === 'obsidian'
            ? 'bg-[#121926] text-white'
            : 'bg-gradient-to-br from-[#EEF2FF] via-[#F5D0FE] to-[#FFE4E6] text-[#0A2540]'
        } ${className}`}
      >
        <OosabLogo
          tone={finish === 'obsidian' ? 'dark' : 'light'}
          size={24}
          wordmarkClassName="text-lg"
        />
      </div>
    );
  }

  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

/* Clean, sculpted, card-proportioned OOSAB debit cards (no rectangular JPEG frame) */
interface SculptedDebitCardProps {
  variant: 'obsidian' | 'aurora';
  holderName?: string;
  lastFour?: string;
  className?: string;
}

export const SculptedDebitCard: React.FC<SculptedDebitCardProps> = ({
  variant,
  holderName = 'ALEX MERCER',
  lastFour = '8841',
  className = '',
}) => {
  const isObsidian = variant === 'obsidian';

  return (
    <div
      className={`relative aspect-[1.586/1] w-full rounded-[18px] p-5 sm:p-6 select-none overflow-hidden flex flex-col justify-between ${
        isObsidian
          ? 'text-white shadow-[0_28px_60px_-15px_rgba(10,37,64,0.45)] border border-white/15'
          : 'text-[#0A2540] shadow-[0_28px_60px_-15px_rgba(99,91,255,0.28)] border border-white/90'
      } ${className}`}
      style={{
        background: isObsidian
          ? 'linear-gradient(135deg, #1E2433 0%, #0F141F 52%, #192236 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #ECE9FF 45%, #FFE4F1 82%, #FFF3DC 100%)',
      }}
    >
      {/* Subtle metallic grain / iridescent light refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isObsidian
            ? 'radial-gradient(circle at 85% 15%, rgba(255, 178, 92, 0.16), transparent 48%), radial-gradient(circle at 12% 90%, rgba(99, 91, 255, 0.22), transparent 50%)'
            : 'radial-gradient(circle at 80% 15%, rgba(99, 91, 255, 0.22), transparent 55%), radial-gradient(circle at 15% 85%, rgba(255, 110, 160, 0.22), transparent 55%)',
        }}
      />

      {/* Top row: Brand + Contactless + Bitcoin mark */}
      <div className="relative z-10 flex items-center justify-between">
        <OosabLogo
          tone={isObsidian ? 'dark' : 'light'}
          size={20}
          wordmarkClassName="text-sm sm:text-base"
        />

        <div className="flex items-center gap-2">
          <Wifi
            className={`w-4 h-4 rotate-90 ${
              isObsidian ? 'text-white/65' : 'text-[#0A2540]/60'
            }`}
          />
          <span
            className={`text-sm font-extrabold ${
              isObsidian ? 'text-[#F7931A]' : 'text-[#635BFF]'
            }`}
          >
            ₿
          </span>
        </div>
      </div>

      {/* Middle: Brushed Metallic EMV Chip */}
      <div className="relative z-10 flex items-center justify-between my-1">
        <div
          className={`w-9 h-6.5 rounded-[5px] border flex items-center justify-center ${
            isObsidian
              ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 border-white/30'
              : 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 border-slate-400/40'
          }`}
        >
          <div className="w-5.5 h-3.5 border border-slate-600/35 rounded-[2px]" />
        </div>

        <span
          className={`text-[10px] font-semibold tracking-wider uppercase ${
            isObsidian ? 'text-white/55' : 'text-[#0A2540]/55'
          }`}
        >
          {isObsidian ? 'Obsidian Metal' : 'Aurora Virtual'}
        </span>
      </div>

      {/* Bottom: Card Number + Holder */}
      <div className="relative z-10 space-y-2.5">
        <div className="font-mono tabular-nums text-[13px] sm:text-sm tracking-[0.16em] font-medium opacity-90">
          4532 •••• •••• {lastFour}
        </div>

        <div className="flex items-end justify-between">
          <div className="text-[11px] font-semibold tracking-wider uppercase truncate max-w-[160px] opacity-85">
            {holderName}
          </div>
          <div className="flex items-center -space-x-1.5" aria-hidden="true">
            <span className="w-4 h-4 rounded-full bg-[#EB001B]/90" />
            <span className="w-4 h-4 rounded-full bg-[#F79E1B]/90" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface InteractiveDigitalCardProps {
  finish: CardFinish;
  holderName: string;
  cardNumber?: string;
  expiry?: string;
  frozen?: boolean;
  revealNumber?: boolean;
  walletLabel?: string;
}

export const InteractiveDigitalCard: React.FC<InteractiveDigitalCardProps> = ({
  finish,
  holderName,
  cardNumber = '4532 8910 4421 8841',
  expiry = '11/29',
  frozen = false,
  revealNumber = false,
  walletLabel = 'Direct Wallet Spend',
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -py * 10, y: px * 12 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const maskedNumber = revealNumber
    ? cardNumber
    : `${cardNumber.slice(0, 4)}  ••••  ••••  ${cardNumber.slice(-4)}`;

  const isObsidian = finish === 'obsidian';

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative w-full max-w-[400px] aspect-[1.586/1] rounded-2xl p-6 select-none overflow-hidden shadow-xl transition-opacity duration-200 ${
        frozen ? 'opacity-65 grayscale' : ''
      } ${
        isObsidian
          ? 'bg-gradient-to-br from-[#1E2433] via-[#0F141F] to-[#192236] text-white border border-white/15'
          : 'bg-gradient-to-br from-[#FFFFFF] via-[#ECE9FF] to-[#FFE4F1] text-[#0A2540] border border-[#CBD5E1]'
      }`}
    >
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <OosabLogo
              tone={isObsidian ? 'dark' : 'light'}
              size={20}
              wordmarkClassName="text-base sm:text-lg"
            />
            <div
              className={`text-[11px] font-medium mt-0.5 ${
                isObsidian ? 'text-slate-300' : 'text-[#425466]'
              }`}
            >
              {walletLabel}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Wifi
              className={`w-4 h-4 rotate-90 ${
                isObsidian ? 'text-slate-300' : 'text-[#425466]'
              }`}
            />
            <span
              className={`text-sm font-bold tracking-tight ${
                isObsidian ? 'text-amber-400' : 'text-[#635BFF]'
              }`}
            >
              ₿
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 my-1">
          <div
            className={`w-10 h-7 rounded-md border flex items-center justify-center ${
              isObsidian
                ? 'bg-gradient-to-br from-slate-200 to-slate-400 border-slate-300/60'
                : 'bg-gradient-to-br from-slate-100 to-slate-300 border-slate-400/50'
            }`}
          >
            <div className="w-6 h-4 border border-slate-500/40 rounded-[2px]" />
          </div>
          {frozen && (
            <span className="text-[11px] font-semibold tracking-wide uppercase text-rose-400">
              Card Frozen
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="font-mono tabular-nums text-[15px] sm:text-base tracking-[0.14em] font-medium">
            {maskedNumber}
          </div>

          <div className="flex items-end justify-between text-xs">
            <div>
              <div
                className={`text-[10px] uppercase tracking-wider ${
                  isObsidian ? 'text-slate-400' : 'text-[#64748B]'
                }`}
              >
                Cardholder
              </div>
              <div className="font-semibold tracking-wide uppercase truncate max-w-[180px]">
                {holderName || 'YOUR NAME'}
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-[10px] uppercase tracking-wider ${
                  isObsidian ? 'text-slate-400' : 'text-[#64748B]'
                }`}
              >
                Expires
              </div>
              <div className="font-mono tabular-nums font-medium">{expiry}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
