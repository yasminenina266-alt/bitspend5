export type WalletCategory = 'Hardware' | 'Mobile & Browser';

export interface SupportedWallet {
  id: string;
  name: string;
  category: WalletCategory;
  protocol: string;
  chains: string[];
  description: string;
  sampleAddress: string;
  featured: boolean;
}

export type CardFinish = 'obsidian' | 'aurora';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export interface TransactionRecord {
  id: string;
  merchant: string;
  category: string;
  fiatAmount: number;
  currency: CurrencyCode;
  btcAmount: number;
  walletName: string;
  paymentRail: 'Apple Pay' | 'Google Pay' | 'Virtual Card';
  timestamp: string;
  status: 'Settled' | 'Pending';
}

export interface OosabUser {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  currency: CurrencyCode;
  cardFinish: CardFinish;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardFrozen: boolean;
  applePayLinked: boolean;
  googlePayLinked: boolean;
  connectedWalletId: string;
  walletAddress: string;
  btcBalance: number;
  createdAt: string;
  transactions: TransactionRecord[];
}

export type BitspendUser = OosabUser;

export type AppView = 'landing' | 'login' | 'register' | 'dashboard';
