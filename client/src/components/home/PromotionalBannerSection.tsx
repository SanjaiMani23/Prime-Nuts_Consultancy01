import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Offer } from '../../types';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import { ArrowRight, Tag, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PromotionalBannerSectionProps {
  offers?: Offer[];
}

export const PromotionalBannerSection: React.FC<PromotionalBannerSectionProps> = ({ offers: propOffers }) => {
  const [offers, setOffers] = useState<Offer[]>(propOffers || []);
  const [loading, setLoading] = useState<boolean>(!propOffers);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    if (propOffers && propOffers.length > 0) {
      setOffers(propOffers.filter(o => o.isBanner));
      return;
    }

    setLoading(true);
    api.getPublicOffers()
      .then((res) => {
        if (res.offers) {
          setOffers(res.offers.filter(o => o.isBanner));
        }
      })
      .catch((err) => {
        console.warn('Failed to load promotional offers:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [propOffers]);

  // Auto-rotate offers every 8 seconds if there are multiple
  useEffect(() => {
    if (offers.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [offers.length]);

  if (loading || offers.length === 0) {
    return null; // Don't render if no banner offers available
  }

  const currentOffer = offers[currentOfferIndex];

  return (
    <section className="py-12 md:py-16 bg-[#FFF7E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#2B160D]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOffer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row h-full min-h-[400px]"
            >
              {/* Content Side (Left) */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center z-10 relative">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                  <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#F28C00]/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-[#F28C00]/20 text-[#F28C00] px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-[#F28C00]/30">
                    <Tag className="w-3.5 h-3.5" />
                    Special Promotion
                  </div>
                  
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFF7E8] mb-3 leading-tight">
                    {currentOffer.title}
                  </h2>
                  
                  {currentOffer.tamilTitle && (
                    <p className="font-sans text-[#F28C00] text-xl font-bold mb-4">
                      {currentOffer.tamilTitle}
                    </p>
                  )}
                  
                  <p className="text-[#FFF7E8]/80 text-sm sm:text-base mb-6 max-w-md leading-relaxed">
                    {currentOffer.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <Link to="/combos">
                      <Button 
                        variant="primary" 
                        size="lg"
                        className="w-full sm:w-auto bg-[#D96500] hover:bg-[#F28C00] text-white border-none shadow-lg shadow-[#D96500]/30"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Shop Offer Now
                      </Button>
                    </Link>
                    <a href="https://wa.me/919994627970" target="_blank" rel="noopener noreferrer">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="w-full sm:w-auto border-[#F28C00]/50 text-[#FFF7E8] hover:bg-[#F28C00]/10"
                        leftIcon={<Phone className="w-4 h-4" />}
                      >
                        Order via WhatsApp
                      </Button>
                    </a>
                  </div>

                  {currentOffer.discountPercent > 0 && (
                    <div className="mt-8 flex items-center gap-4">
                      <div className="bg-[#FFF7E8] text-[#2B160D] font-bold text-2xl px-4 py-2 rounded-xl inline-block shadow-inner">
                        {currentOffer.discountPercent}% OFF
                      </div>
                      <div className="text-xs text-[#FFF7E8]/60 uppercase tracking-widest">
                        Use Code:<br/>
                        <span className="text-[#F28C00] font-bold text-sm">{currentOffer.code}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Side (Right) */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-[#1A0D08]">
                {currentOffer.bannerImage ? (
                  <img 
                    src={currentOffer.bannerImage} 
                    alt={currentOffer.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#2B160D] border-l border-[#F28C00]/20">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-[#F28C00]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F28C00]/30">
                        <Tag className="w-10 h-10 text-[#F28C00]" />
                      </div>
                      <h3 className="text-[#FFF7E8] font-serif text-xl font-bold">Premium Quality</h3>
                    </div>
                  </div>
                )}
                
                {/* Overlay gradient to blend with left side */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2B160D] via-[#2B160D]/50 to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          {offers.length > 1 && (
            <div className="absolute bottom-6 left-1/2 md:left-1/4 -translate-x-1/2 flex gap-2 z-20">
              {offers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentOfferIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentOfferIndex 
                      ? 'bg-[#F28C00] w-8' 
                      : 'bg-[#FFF7E8]/30 hover:bg-[#FFF7E8]/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
