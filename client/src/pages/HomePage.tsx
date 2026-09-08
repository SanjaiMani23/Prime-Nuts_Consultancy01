import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { GrandCombosSection } from '../components/home/GrandCombosSection';
import { PromotionalBannerSection } from '../components/home/PromotionalBannerSection';
import { WhyThePrimeNuts } from '../components/home/WhyThePrimeNuts';
import { StoreVisitSection } from '../components/home/StoreVisitSection';
import { FinalCTASection } from '../components/home/FinalCTASection';
import { Product, Offer } from '../types';
import { api } from '../services/api';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      api.getProducts(),
      api.getProducts({ category: 'Combos' }),
      api.getPublicOffers()
    ])
      .then(([productsRes, combosRes, offersRes]) => {
        if (productsRes.products) setProducts(productsRes.products);
        if (combosRes.products) setCombos(combosRes.products);
        if (offersRes.offers) setOffers(offersRes.offers);
      })
      .catch((err) => {
        console.error('Failed to load homepage data from server:', err);
        setError('Could not connect to store server. Please check your internet or try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHomeData();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF7E8] selection:bg-[#F28C00] selection:text-[#2B160D]">
      <HeroSection />

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-900 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={fetchHomeData}>
              Retry
            </Button>
          </div>
        </div>
      )}

      <CategoryShowcase products={products} />
      <FeaturedProductsSection products={products} loading={loading} />
      <GrandCombosSection combos={combos} loading={loading} />
      
      {/* 4.5 Promotional Banner */}
      <PromotionalBannerSection offers={offers} />

      <WhyThePrimeNuts />
      <StoreVisitSection />
      <FinalCTASection />
    </main>
  );
};

