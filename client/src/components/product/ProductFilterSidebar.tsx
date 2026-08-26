import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedWeight: string;
  onSelectWeight: (weight: string) => void;
  selectedBadge: string;
  onSelectBadge: (badge: string) => void;
  onReset: () => void;
  totalResults: number;
}

export const ProductFilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  selectedWeight,
  onSelectWeight,
  selectedBadge,
  onSelectBadge,
  onReset,
  totalResults,
}) => {
  const weights = ['All', '250g', '500g', '1kg', 'Combo Pack'];
  const badges = ['All', 'Best Seller', 'Combo Offer', 'Best Value', 'Festival Special'];

  return (
    <aside className="w-full bg-white rounded-2xl border border-sand-300 p-6 space-y-6 shadow-sm font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sand-200">
        <div className="flex items-center gap-2 text-espresso-950 font-sans font-bold text-base">
          <Filter className="w-4 h-4 text-gold-600" />
          <span>Filters</span>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-charcoal-500 hover:text-gold-700 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Results Count */}
      <div className="text-xs text-charcoal-600 bg-sand-50 p-2.5 rounded-xl border border-sand-200">
        Showing <strong className="text-espresso-950">{totalResults}</strong> premium items
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-sans text-xs font-bold text-espresso-950 uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-espresso-950 text-gold-300 shadow-sm'
                    : 'text-charcoal-700 hover:bg-sand-100 hover:text-espresso-950'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-gold-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-4 border-t border-sand-200">
        <h4 className="font-sans text-xs font-bold text-espresso-950 uppercase tracking-wider">
          Price Range
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal-800">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-gold-600 bg-sand-200 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-charcoal-500">
            <span>Min: ₹100</span>
            <span>Max: ₹3,000+</span>
          </div>
        </div>
      </div>

      {/* Weight Filter */}
      <div className="space-y-3 pt-4 border-t border-sand-200">
        <h4 className="font-sans text-xs font-bold text-espresso-950 uppercase tracking-wider">
          Weight Variant
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {weights.map((w) => {
            const isSelected = selectedWeight === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() => onSelectWeight(w)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isSelected
                    ? 'bg-gold-500 text-espresso-950 font-bold shadow-sm'
                    : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200 border border-sand-200'
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges / Special Collections */}
      <div className="space-y-3 pt-4 border-t border-sand-200">
        <h4 className="font-sans text-xs font-bold text-espresso-950 uppercase tracking-wider">
          Collection Highlight
        </h4>
        <div className="space-y-1.5">
          {badges.map((b) => {
            const isSelected = selectedBadge === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => onSelectBadge(b)}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all ${
                  isSelected
                    ? 'bg-sand-200 text-espresso-950 font-bold border border-sand-400'
                    : 'text-charcoal-600 hover:bg-sand-50 hover:text-espresso-950'
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
