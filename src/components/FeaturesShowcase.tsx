import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ApplePayMark, GooglePayMark } from './WalletLogo';

interface FeaturesShowcaseProps {
  onGetStarted: () => void;
}

export const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({ onGetStarted }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section id="features" className="bg-[#F6F9FC] py-14 sm:py-20 lg:py-24 border-b border-[#E3E8EE]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 space-y-14 sm:space-y-20">
        {/* Editorial Split: Instant Apple Pay & Google Pay */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 space-y-5 text-center lg:text-left"
          >
            <div className="text-sm font-semibold text-[#635BFF]">Instant mobile pay</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0A2540] leading-[1.12] text-balance">
              Ready for Apple Pay and Google Pay the moment you register.
            </h2>
            <p className="text-base text-[#425466] leading-relaxed max-w-lg mx-auto lg:mx-0">
              Your virtual OOSAB card activates immediately upon sign-up. Add it to Apple Wallet
              or Google Wallet with one click and tap to pay anywhere contactless cards work—no
              waiting for plastic delivery.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <ApplePayMark className="h-8 w-auto" />
              <GooglePayMark className="h-8 w-auto" />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#635BFF] hover:text-[#5249F5] cursor-pointer group"
              >
                <span>Create your card</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-7"
          >
            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-[0_24px_60px_-15px_rgba(10,37,64,0.16)] bg-[#E2E8F0]">
              {!imgFailed ? (
                <img
                  src="https://i.postimg.cc/ZRsxNMzT/shutterstock-2488493799-scaled.jpg"
                  alt="Paying with smartphone tap-to-pay at a contactless payment terminal"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-[#425466]">
                  Contactless Apple Pay &amp; Google Pay Terminal
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Clean Unboxed 3-Column Editorial Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-2 sm:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4 }}
            className="pt-5 sm:pt-6 border-t border-[#CBD5E1] space-y-2 text-center md:text-left"
          >
            <h3 className="text-lg font-bold text-[#0A2540]">Zero upfront deposit</h3>
            <p className="text-sm sm:text-[15px] text-[#425466] leading-relaxed max-w-md mx-auto md:mx-0">
              Never transfer or lock your bitcoin on an exchange balance before shopping. OOSAB
              settles only the exact purchase amount at the register.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="pt-5 sm:pt-6 border-t border-[#CBD5E1] space-y-2 text-center md:text-left"
          >
            <h3 className="text-lg font-bold text-[#0A2540]">Spend directly from your wallet</h3>
            <p className="text-sm sm:text-[15px] text-[#425466] leading-relaxed max-w-md mx-auto md:mx-0">
              Link Ledger, Phantom, Trust Wallet, MetaMask, and more. Your keys stay safely in your
              own custody until the millisecond you tap.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="pt-5 sm:pt-6 border-t border-[#CBD5E1] space-y-2 text-center md:text-left"
          >
            <h3 className="text-lg font-bold text-[#0A2540]">No KYC to register</h3>
            <p className="text-sm sm:text-[15px] text-[#425466] leading-relaxed max-w-md mx-auto md:mx-0">
              Start in under a minute with email and a wallet link—no ID upload needed. Verification
              applies only above higher volume tiers, disclosed inside your account limits.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
