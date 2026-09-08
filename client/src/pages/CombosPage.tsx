import React, { useEffect, useState } from 'react';
import { Product, Offer } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { GrandCombosSection } from '../components/home/GrandCombosSection';
import { Gift, Tag } from 'lucide-react';

export const CombosPage: React.FC = () => {
  const [combos, setCombos] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    Promise.all([
      api.getProducts({ category: 'Combos' }),
      api.getPublicOffers()
    ])
      .then(([resCombos, resOffers]) => {
        if (resCombos.products) setCombos(resCombos.products);
        if (resOffers.offers) setOffers(resOffers.offers.filter(o => o.isActive && !o.isBanner)); // Show non-banner offers here
      })
      .catch((err) => {
        console.error('Failed to load combos on CombosPage:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF7E8] py-10 md:py-16 selection:bg-[#F28C00] selection:text-[#2B160D]">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#F28C00]/10 text-[#D96500] border border-[#F28C00]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <Gift className="w-3.5 h-3.5" />
          <span>The Prime Nuts Signature Packs</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2B160D]">
          Curated Value Combos & Mega Feasts
        </h1>
        <p className="font-serif text-base sm:text-lg text-[#D96500] font-medium">
          “கார்ப்பரேட் கிஃப்டிங்கிற்கு ஏற்ற மிகச்சிறந்த நட்ஸ் காம்போஸ்!”
        </p>
        <p className="text-xs sm:text-sm text-[#2B160D]/70 font-sans max-w-2xl mx-auto leading-relaxed">
          From our legendary 25-item Sundarapuram family mega combo to daily 5-seed superfood mixes. Packed in individual compartments with guaranteed factory-direct savings.
        </p>
      </div>

      {/* Flagship Combos Highlight Banner */}
      <GrandCombosSection combos={combos} loading={loading} />

      {/* Grid of All Combo Offerings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Active Offers Banner */}
        {offers.length > 0 && !loading && (
          <div className="mb-12 bg-[#2B160D] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#F28C00]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F28C00]/20 rounded-full flex items-center justify-center shrink-0 border border-[#F28C00]/30">
                <Tag className="w-6 h-6 text-[#F28C00]" />
              </div>
              <div>
                <h3 className="text-[#FFF7E8] font-bold text-lg mb-1">Available Store Offers</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {offers.map(offer => (
                    <div key={offer.id} className="bg-[#1A0D08] text-[#F28C00] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#F28C00]/20">
                      {offer.code}: {offer.discountPercent > 0 ? `${offer.discountPercent}% OFF` : offer.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-sm text-[#FFF7E8]/70 text-right">
              Apply these codes at checkout to unlock your savings.<br/>
              *Terms and conditions apply.
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B160D]">
            All Value Combo Packs
          </h2>
          <span className="text-xs text-[#2B160D]/60 font-medium">
            {combos.length} Special Combos Available
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5D5B5] p-4 space-y-4 animate-pulse">
                <div className="aspect-square bg-[#FFF7E8] rounded-xl" />
                <div className="h-4 bg-[#E5D5B5] rounded w-3/4" />
                <div className="h-3 bg-[#FFF7E8] rounded w-1/2" />
                <div className="h-8 bg-[#FFF7E8] rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {combos.map((combo) => (
              <ProductCard key={combo.id} product={combo} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
