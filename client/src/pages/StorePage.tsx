import React, { useEffect } from 'react';
import { StoreVisitSection } from '../components/home/StoreVisitSection';
import { WhyThePrimeNuts } from '../components/home/WhyThePrimeNuts';

export const StorePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF7E8] py-8 sm:py-12">
      <StoreVisitSection />
      <WhyThePrimeNuts />
    </main>
  );
};
