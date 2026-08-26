import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface FeaturedSectionProps {
  products: Product[];
  loading?: boolean;
}

export const FeaturedProductsSection: React.FC<FeaturedSectionProps> = ({ products, loading = false }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Best Seller' | 'Combos' | 'Seeds'>('All');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'All') return p.isFeatured || p.isBestSeller || true;
    if (activeTab === 'Best Seller') return p.isBestSeller;
    if (activeTab === 'Combos') return p.category === 'Combos';
    if (activeTab === 'Seeds') return p.category === 'Seeds';
    return true;
  }).slice(0, 8);

  const tabs: { label: string; value: 'All' | 'Best Seller' | 'Combos' | 'Seeds' }[] = [
    { label: '🌟 All Favorites', value: 'All' },
    { label: '🔥 Best Sellers', value: 'Best Seller' },
    { label: '🎁 Value Combos', value: 'Combos' },
    { label: '🌱 Super Seeds', value: 'Seeds' },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FFF7E8] border-b border-[#D8A15D]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28C00] inline-flex items-center gap-1.5 bg-[#FFFCF6] px-3 py-1 rounded-full border border-[#D8A15D]">
            <Sparkles className="w-3.5 h-3.5 text-[#F28C00]" /> Sundarapuram Store Catalog
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2B160D]">
            Best Sellers & Customer Favorites
          </h2>
          <p className="text-xs sm:text-sm text-[#B34E00] leading-relaxed font-serif font-medium">
            “தரம் பிரீமியம், விலை மினிமம்... நட்ஸ் வாங்குங்க நச்சுனு வாழுங்க!”
          </p>

          {/* Filter Pills Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold transition-all ${
                  activeTab === tab.value
                    ? 'bg-[#2B160D] text-[#FEEDD3] shadow-md border border-[#F28C00]'
                    : 'bg-[#FFFCF6] text-[#2B160D] hover:bg-[#FEEDD3] border border-[#D8A15D]/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid or Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-[#FFFCF6] rounded-2xl border border-[#D8A15D]/40 p-4 space-y-4 animate-pulse">
                <div className="aspect-square bg-[#FEEDD3]/60 rounded-xl" />
                <div className="h-4 bg-[#FEEDD3] rounded w-3/4" />
                <div className="h-3 bg-[#FEEDD3]/60 rounded w-1/2" />
                <div className="h-8 bg-[#FEEDD3]/40 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-[#FFFCF6] rounded-3xl border border-[#D8A15D]/50 p-8">
            <p className="text-sm font-semibold text-[#2B160D]">No items found in this section.</p>
            <Link to="/shop" className="text-xs text-[#F28C00] font-bold underline mt-2 inline-block">
              View all products in shop →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom Call to Action */}
        <div className="text-center mt-12">
          <Link to="/shop">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse Complete Catalog (30+ Varieties)
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
