import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Plus,
  Unlock,
  Wallet,
} from 'lucide-react';
import { OosabUser, TransactionRecord } from '../types';
import { BTC_USD_RATE, SUPPORTED_WALLETS } from '../data/wallets';
import { InteractiveDigitalCard } from './BitspendCardVisual';
import { ApplePayMark, GooglePayMark, WalletLogo } from './WalletLogo';

interface DashboardProps {
  user: OosabUser;
  onUpdateUser: (updated: OosabUser) => void;
  onBackToWebsite: () => void;
}

const SAMPLE_MERCHANTS = [
  { name: 'Blue Bottle Coffee', category: 'Dining', amount: 6.95 },
  { name: 'Uber Trip', category: 'Transport', amount: 24.4 },
  { name: 'Apple Store', category: 'Electronics', amount: 189.0 },
  { name: 'Sweetgreen', category: 'Dining', amount: 16.8 },
];

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onUpdateUser,
  onBackToWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'wallets' | 'limits'>('overview');
  const [revealCard, setRevealCard] = useState(false);
  const [copiedPan, setCopiedPan] = useState(false);
  const [simulatingSpend, setSimulatingSpend] = useState(false);
  const [customMerchant, setCustomMerchant] = useState(SAMPLE_MERCHANTS[0].name);
  const [customAmount, setCustomAmount] = useState('18.50');

  const connectedWallet =
    SUPPORTED_WALLETS.find((w) => w.id === user.connectedWalletId) || SUPPORTED_WALLETS[0];

  const monthlySpentUsd = user.transactions.reduce((acc, tx) => acc + tx.fiatAmount, 0);
  const unverifiedMonthlyCap = 2500;
  const usagePct = Math.min(100, Math.round((monthlySpentUsd / unverifiedMonthlyCap) * 100));

  const copyCardNumber = () => {
    navigator.clipboard?.writeText(user.cardNumber.replace(/\s+/g, ''));
    setCopiedPan(true);
    window.setTimeout(() => setCopiedPan(false), 1800);
  };

  const toggleFreeze = () => {
    onUpdateUser({ ...user, cardFrozen: !user.cardFrozen });
  };

  const toggleApplePay = () => {
    onUpdateUser({ ...user, applePayLinked: !user.applePayLinked });
  };

  const toggleGooglePay = () => {
    onUpdateUser({ ...user, googlePayLinked: !user.googlePayLinked });
  };

  const handleSwitchWallet = (walletId: string) => {
    const target = SUPPORTED_WALLETS.find((w) => w.id === walletId);
    if (!target) return;
    onUpdateUser({
      ...user,
      connectedWalletId: target.id,
      walletAddress: target.sampleAddress,
    });
  };

  const handleSimulatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.cardFrozen) return;
    const amountNum = parseFloat(customAmount);
    if (Number.isNaN(amountNum) || amountNum <= 0) return;

    setSimulatingSpend(true);
    window.setTimeout(() => {
      const btcSpent = Number((amountNum / BTC_USD_RATE).toFixed(6));
      const newTx: TransactionRecord = {
        id: `tx-${Date.now()}`,
        merchant: customMerchant.trim() || 'Merchant Checkout',
        category: 'Tap-to-Pay',
        fiatAmount: amountNum,
        currency: user.currency,
        btcAmount: btcSpent,
        walletName: connectedWallet.name,
        paymentRail: user.applePayLinked
          ? 'Apple Pay'
          : user.googlePayLinked
            ? 'Google Pay'
            : 'Virtual Card',
        timestamp: 'Just now',
        status: 'Settled',
      };

      onUpdateUser({
        ...user,
        btcBalance: Math.max(0, Number((user.btcBalance - btcSpent).toFixed(6))),
        transactions: [newTx, ...user.transactions],
      });
      setSimulatingSpend(false);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F6F9FC] py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Portal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E8EE]">
          <div>
            <div className="text-xs font-semibold text-[#635BFF]">OOSAB Card Portal</div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0A2540] mt-0.5">
              Welcome back, {user.fullName}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Segmented Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#E3E8EE] rounded-lg">
              {(
                [
                  { id: 'overview', label: 'Card & Activity' },
                  { id: 'wallets', label: 'Connected Wallet' },
                  { id: 'limits', label: 'Spending Limits' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#0A2540] text-white'
                      : 'text-[#425466] hover:text-[#0A2540]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onBackToWebsite}
              className="hidden md:inline-flex px-3.5 py-2 text-xs font-semibold text-[#425466] hover:text-[#0A2540] bg-white border border-[#E3E8EE] rounded-lg cursor-pointer whitespace-nowrap"
            >
              View Website
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Active OOSAB Card + Mobile Pay Provisioning */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[#0A2540]">Your OOSAB Card</div>
                  <span
                    className={`text-xs font-semibold ${
                      user.cardFrozen ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {user.cardFrozen ? 'Frozen' : 'Active'}
                  </span>
                </div>

                <div className="flex justify-center">
                  <InteractiveDigitalCard
                    finish={user.cardFinish}
                    holderName={user.fullName}
                    cardNumber={user.cardNumber}
                    expiry={user.cardExpiry}
                    frozen={user.cardFrozen}
                    revealNumber={revealCard}
                    walletLabel={`${connectedWallet.name} Linked`}
                  />
                </div>

                {/* Card Controls */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRevealCard((r) => !r)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#0A2540] bg-[#F6F9FC] hover:bg-[#EDF2F7] border border-[#E3E8EE] rounded-lg cursor-pointer"
                  >
                    {revealCard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{revealCard ? 'Hide' : 'Reveal'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={copyCardNumber}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#0A2540] bg-[#F6F9FC] hover:bg-[#EDF2F7] border border-[#E3E8EE] rounded-lg cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPan ? 'Copied' : 'Copy PAN'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleFreeze}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#0A2540] bg-[#F6F9FC] hover:bg-[#EDF2F7] border border-[#E3E8EE] rounded-lg cursor-pointer"
                  >
                    {user.cardFrozen ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Unfreeze</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-rose-600" />
                        <span>Freeze</span>
                      </>
                    )}
                  </button>
                </div>

                {revealCard && (
                  <div className="p-3 rounded-lg bg-[#F6F9FC] border border-[#E3E8EE] flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-[#425466]">Security Code (CVV):</span>
                    <span className="font-bold text-[#0A2540]">{user.cardCvv}</span>
                  </div>
                )}

                {/* Instant Apple Pay & Google Pay toggles */}
                <div className="pt-4 border-t border-[#E3E8EE] space-y-2.5">
                  <div className="text-xs font-semibold text-[#425466]">
                    Instant Contactless Provisioning
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={toggleApplePay}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        user.applePayLinked
                          ? 'border-[#635BFF] bg-[#635BFF]/5'
                          : 'border-[#E3E8EE] hover:bg-[#F6F9FC]'
                      }`}
                    >
                      <ApplePayMark className="h-6 w-auto" />
                      <div className="text-[11px] font-medium text-[#425466] mt-2">
                        {user.applePayLinked ? 'Connected' : 'Click to add'}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={toggleGooglePay}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        user.googlePayLinked
                          ? 'border-[#635BFF] bg-[#635BFF]/5'
                          : 'border-[#E3E8EE] hover:bg-[#F6F9FC]'
                      }`}
                    >
                      <GooglePayMark className="h-6 w-auto" />
                      <div className="text-[11px] font-medium text-[#425466] mt-2">
                        {user.googlePayLinked ? 'Connected' : 'Click to add'}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Wallet Balance, Team Spend Simulator, and Activity Ledger */}
            <div className="lg:col-span-7 space-y-5">
              {/* Connected Wallet Summary Strip */}
              <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#F6F9FC] border border-[#E3E8EE] flex items-center justify-center">
                    <WalletLogo walletId={connectedWallet.id} className="w-6 h-6 text-[#0A2540]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B]">
                      Spending directly from {connectedWallet.name}
                    </div>
                    <div className="font-mono tabular-nums text-lg font-extrabold text-[#0A2540]">
                      {user.btcBalance.toFixed(6)} BTC
                    </div>
                    <div className="font-mono text-[11px] text-[#64748B] truncate max-w-[240px]">
                      {user.walletAddress}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-[#64748B]">Available Purchasing Power</div>
                  <div className="font-mono tabular-nums text-xl font-extrabold text-[#0A2540]">
                    ${(user.btcBalance * BTC_USD_RATE).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700">
                    $0.00 custodial deposit held
                  </div>
                </div>
              </div>

              {/* Quick Merchant Checkout */}
              <form
                onSubmit={handleSimulatePurchase}
                className="bg-white border border-[#E3E8EE] rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#0A2540]">
                      Merchant Checkout Authorization
                    </div>
                    <div className="text-xs text-[#425466]">
                      Authorize an instant tap-to-pay settlement from your connected wallet
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={customMerchant}
                      onChange={(e) => setCustomMerchant(e.target.value)}
                      placeholder="Merchant name"
                      className="w-full px-3.5 py-2 text-sm border border-[#E3E8EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0.50"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Amount USD"
                      className="w-full px-3.5 py-2 text-sm font-mono tabular-nums border border-[#E3E8EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={simulatingSpend || user.cardFrozen}
                      className="w-full py-2 px-3 text-sm font-semibold text-white bg-[#635BFF] hover:bg-[#5249F5] disabled:bg-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{simulatingSpend ? 'Settling...' : 'Spend'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Transaction Ledger */}
              <div className="bg-white border border-[#E3E8EE] rounded-2xl shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E3E8EE] flex items-center justify-between">
                  <div className="text-sm font-bold text-[#0A2540]">Recent Card Activity</div>
                  <div className="text-xs text-[#64748B]">
                    {user.transactions.length} transactions
                  </div>
                </div>

                <div className="divide-y divide-[#E3E8EE]">
                  {user.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#F6F9FC]/60 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#0A2540] truncate">
                          {tx.merchant}
                        </div>
                        <div className="text-xs text-[#64748B] flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span>{tx.paymentRail}</span>
                          <span aria-hidden="true">·</span>
                          <span>{tx.walletName}</span>
                          <span aria-hidden="true">·</span>
                          <span>{tx.timestamp}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono tabular-nums text-sm font-bold text-[#0A2540]">
                          ${tx.fiatAmount.toFixed(2)}
                        </div>
                        <div className="font-mono tabular-nums text-xs text-[#64748B]">
                          -{tx.btcAmount.toFixed(6)} BTC
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0A2540]">Switch Active Self-Custody Wallet</h2>
              <p className="text-sm text-[#425466] mt-1">
                Point your OOSAB card to any supported wallet at any time with zero deposits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SUPPORTED_WALLETS.map((wallet) => {
                const isCurrent = user.connectedWalletId === wallet.id;
                return (
                  <button
                    key={wallet.id}
                    type="button"
                    onClick={() => handleSwitchWallet(wallet.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#635BFF] bg-[#635BFF]/5'
                        : 'border-[#E3E8EE] hover:bg-[#F6F9FC]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <WalletLogo walletId={wallet.id} className="w-6 h-6 text-[#0A2540]" />
                      {isCurrent && (
                        <span className="text-xs font-semibold text-[#635BFF] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-[#0A2540]">{wallet.name}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">{wallet.protocol}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'limits' && (
          <div className="bg-white border border-[#E3E8EE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
            <div className="flex items-start gap-3">
              <Wallet className="w-5 h-5 text-[#635BFF] mt-0.5 shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-[#0A2540]">
                  Spending Tiers &amp; Identity Verification Disclosure
                </h2>
                <p className="text-sm text-[#425466] mt-1 leading-relaxed">
                  No KYC or identification is required on registration. Standard self-custody
                  spending is active immediately up to $2,500 per rolling 30-day cycle.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#F6F9FC] border border-[#E3E8EE] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0A2540]">Current 30-day unverified usage</span>
                <span className="font-mono tabular-nums text-[#0A2540]">
                  ${monthlySpentUsd.toFixed(2)} / ${unverifiedMonthlyCap.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-[#E3E8EE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#635BFF] rounded-full transition-all"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <p className="text-xs text-[#425466]">
                Once your cumulative spend crosses $2,500/month (or $1,000 in a single transaction),
                lightweight identity verification is required to unlock the $25,000/month Tier 2
                limit.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
