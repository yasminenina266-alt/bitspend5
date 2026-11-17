import React from 'react';
import WalletLedger from '@web3icons/react/icons/wallets/WalletLedger';
import WalletPhantom from '@web3icons/react/icons/wallets/WalletPhantom';
import WalletTrust from '@web3icons/react/icons/wallets/WalletTrust';
import WalletMetamask from '@web3icons/react/icons/wallets/WalletMetamask';
import WalletCoinbase from '@web3icons/react/icons/wallets/WalletCoinbase';
import WalletTrezor from '@web3icons/react/icons/wallets/WalletTrezor';
import WalletRainbow from '@web3icons/react/icons/wallets/WalletRainbow';
import WalletExodus from '@web3icons/react/icons/wallets/WalletExodus';
import WalletSafe from '@web3icons/react/icons/wallets/WalletSafe';
import WalletRabby from '@web3icons/react/icons/wallets/WalletRabby';
import WalletOkx from '@web3icons/react/icons/wallets/WalletOkx';
import WalletWalletConnect from '@web3icons/react/icons/wallets/WalletWalletConnect';

interface WalletLogoProps {
  walletId: string;
  className?: string;
  variant?: 'branded' | 'background';
}

export const ApplePayMark: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg
    viewBox="0 0 112 46"
    fill="none"
    className={className}
    role="img"
    aria-label="Apple Pay"
  >
    <rect x="0.75" y="0.75" width="110.5" height="44.5" rx="8" fill="#000000" stroke="#1F2937" strokeWidth="1.5" />
    {/* Official Apple silhouette */}
    <path
      d="M34.2 19.3c-.1-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.2-.9-1.6 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.5 1.2-.1 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.7-3.8Zm-2.4-7.2c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z"
      fill="#FFFFFF"
    />
    {/* Crisp Pay wordmark */}
    <text
      x="46"
      y="30"
      fill="#FFFFFF"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif"
      fontSize="20"
      fontWeight="600"
      letterSpacing="-0.4"
    >
      Pay
    </text>
  </svg>
);

export const GooglePayMark: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg
    viewBox="0 0 118 46"
    fill="none"
    className={className}
    role="img"
    aria-label="Google Pay"
  >
    <rect x="0.75" y="0.75" width="116.5" height="44.5" rx="8" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
    {/* Google 4-color G */}
    <path
      d="M35.8 23.2c0-.7-.06-1.4-.18-2.06H26v3.9h5.5c-.24 1.28-.96 2.36-2.04 3.08v2.56h3.3c1.93-1.78 3.04-4.4 3.04-7.48Z"
      fill="#4285F4"
    />
    <path
      d="M26 33.2c2.76 0 5.07-.91 6.76-2.47l-3.3-2.56c-.91.61-2.08.98-3.46.98-2.66 0-4.91-1.8-5.72-4.21h-3.4v2.64c1.68 3.34 5.13 5.62 9.12 5.62Z"
      fill="#34A853"
    />
    <path
      d="M20.28 24.94c-.2-.61-.32-1.26-.32-1.94s.12-1.33.32-1.94v-2.64h-3.4A10.17 10.17 0 0 0 15.8 23c0 1.64.39 3.2 1.08 4.58l3.4-2.64Z"
      fill="#FBBC04"
    />
    <path
      d="M26 16.85c1.5 0 2.85.52 3.91 1.53l2.93-2.93C31.06 13.79 28.75 12.8 26 12.8c-3.99 0-7.44 2.28-9.12 5.62l3.4 2.64c.81-2.41 3.06-4.21 5.72-4.21Z"
      fill="#EA4335"
    />
    <text
      x="44"
      y="29.5"
      fill="#3C4043"
      fontFamily="'Plus Jakarta Sans', -apple-system, sans-serif"
      fontSize="19"
      fontWeight="600"
      letterSpacing="-0.3"
    >
      Pay
    </text>
  </svg>
);

const WALLET_ICON_MAP = {
  ledger: WalletLedger,
  phantom: WalletPhantom,
  trust: WalletTrust,
  metamask: WalletMetamask,
  coinbase: WalletCoinbase,
  trezor: WalletTrezor,
  rainbow: WalletRainbow,
  exodus: WalletExodus,
  safe: WalletSafe,
  rabby: WalletRabby,
  okx: WalletOkx,
  walletconnect: WalletWalletConnect,
} as const;

export const WalletLogo: React.FC<WalletLogoProps> = ({
  walletId,
  className = 'w-6 h-6',
  variant = 'branded',
}) => {
  const IconComponent = WALLET_ICON_MAP[walletId as keyof typeof WALLET_ICON_MAP];

  if (IconComponent) {
    return (
      <IconComponent
        variant={variant}
        aria-hidden="true"
        className={`${variant === 'background' ? 'rounded-lg overflow-hidden ' : ''}${className}`}
      />
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#0A2540" />
      <rect x="7" y="10" width="18" height="12" rx="2.5" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="20.5" cy="16" r="1.5" fill="#FFFFFF" />
    </svg>
  );
};
