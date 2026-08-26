import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, Send, Gift, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const FinalCTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.gold('Coupon Unlocked! 🎉', 'Use promo code WELCOME100 during checkout for ₹100 flat discount.');
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24 bg-[#2B160D] text-[#FFF7E8] relative overflow-hidden">
      {/* Saffron Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F28C00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#1F0F08] border border-[#F28C00]/30 rounded-3xl p-8 sm:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Message (7 Cols) */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28C00] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Start Your Healthy Habit Today
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFCF6] leading-tight">
                Ready to fill your pantry with pure nutrition?
              </h2>

              <p className="text-xs sm:text-sm text-[#FEEDD3] max-w-lg leading-relaxed font-sans">
                Explore handpicked whole almonds, rich cashews, Afghan figs, super seeds, and value combo packs delivered straight to your home across Tamil Nadu.
              </p>

              {/* Shopping & WhatsApp Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link to="/shop" className="inline-block">
                  <button className="bg-[#F28C00] hover:bg-[#D96500] text-[#2B160D] hover:text-[#FFFCF6] px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-colors">
                    Shop Now →
                  </button>
                </Link>
                <Link to="/combos" className="inline-block">
                  <button className="bg-[#FFF7E8] hover:bg-[#FEEDD3] text-[#2B160D] px-6 py-3 rounded-xl font-bold text-xs shadow transition-colors">
                    Explore Combos →
                  </button>
                </Link>
                <a
                  href="https://wa.me/919994627970?text=Vanakkam!%20I%20would%20like%20to%20place%20an%20order%20with%20The%20Prime%20Nuts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: +91 99946 27970</span>
                </a>
              </div>
            </div>

            {/* Right: Newsletter / Coupon Unlock Box (5 Cols) */}
            <div className="lg:col-span-5 bg-[#2B160D] border border-[#D8A15D]/40 p-6 sm:p-8 rounded-2xl">
              <div className="flex items-center gap-2 text-[#F28C00] text-xs font-bold mb-2">
                <Gift className="w-4 h-4" />
                <span>Special First-Order Discount</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#FFFCF6] mb-1">
                Get ₹100 Flat OFF
              </h3>
              <p className="text-xs text-[#FEEDD3] mb-4">
                Enter your email to receive our latest catalog and festive offer codes.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1F0F08] border border-[#D8A15D]/40 rounded-xl text-xs text-[#FFFCF6] placeholder-[#7F6253] focus:outline-none focus:border-[#F28C00]"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#F28C00] hover:bg-[#D96500] text-[#2B160D] hover:text-[#FFFCF6] font-bold text-xs py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Claim WELCOME100 Promo Code</span>
                </button>
              </form>
              <div className="flex items-center gap-1.5 text-[10px] text-[#FEEDD3]/70 mt-3 justify-center">
                <ShieldCheck className="w-3 h-3 text-[#F28C00]" />
                <span>Zero spam. Only fresh nutrition & festive specials.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
