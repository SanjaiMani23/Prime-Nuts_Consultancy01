import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilterSidebar } from '../components/product/ProductFilterSidebar';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const normalizeCategoryParam = (cat: string | null): string => {
  if (!cat || cat.toLowerCase() === 'all') return 'All';
  const c = cat.toLowerCase().replace(/[-_]/g, ' ').trim();
  if (c === 'nuts' || c === 'nut' || c === 'nuts kernels' || c === 'nuts & kernels') return 'Nuts';
  if (c === 'dried fruits' || c === 'dry fruits' || c === 'dry fruit' || c === 'dried fruit' || c === 'dryfruits') return 'Dried Fruits';
  if (c === 'seeds' || c === 'seed' || c === 'super seeds') return 'Seeds';
  if (c === 'combos' || c === 'combo' || c === 'combos packs' || c === 'combos & packs' || c === 'packs') return 'Combos';
  if (c === 'gift packs' || c === 'gifts' || c === 'gift pack') return 'Gift Packs';
  if (c === 'snacks' || c === 'snack') return 'Snacks';
  return cat;
};

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    normalizeCategoryParam(searchParams.get('category'))
  );
  const [selectedWeight, setSelectedWeight] = useState(searchParams.get('weight') || 'All');
  const [selectedBadge, setSelectedBadge] = useState(searchParams.get('badge') || 'All');
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 3000]);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['All', 'Nuts', 'Dried Fruits', 'Seeds', 'Combos', 'Gift Packs', 'Snacks'];

  // Sync URL search params with local state
  useEffect(() => {
    const rawCategory = searchParams.get('category');
    const normalizedCategory = normalizeCategoryParam(rawCategory);
    if (normalizedCategory !== selectedCategory) {
      setSelectedCategory(normalizedCategory);
    }
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.getProducts()
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch shop products from server:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.tamilName && p.tamilName.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Badge Filter
      if (selectedBadge !== 'All') {
        if (!p.badges || !p.badges.includes(selectedBadge as any)) return false;
      }

      // Weight Filter
      if (selectedWeight !== 'All') {
        const hasWeight = p.variants.some((v) =>
          v.weight.toLowerCase().includes(selectedWeight.toLowerCase())
        );
        if (!hasWeight) return false;
      }

      // Price Range Filter
      const hasPriceInRange = p.variants.some(
        (v) => v.price >= priceRange[0] && v.price <= priceRange[1]
      );
      if (!hasPriceInRange) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0);
      } else if (sortBy === 'price-high') {
        return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        // Default Popular
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return b.reviewCount - a.reviewCount;
      }
    });
  }, [products, selectedCategory, searchQuery, selectedBadge, selectedWeight, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedWeight('All');
    setSelectedBadge('All');
    setPriceRange([100, 3000]);
    setSearchQuery('');
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <main className="min-h-screen bg-ivory-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Banner Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700 inline-flex items-center gap-1.5 bg-gold-100/80 px-3 py-1 rounded-full border border-gold-300">
            <Sparkles className="w-3.5 h-3.5" /> 100% Handpicked Fresh Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-950">
            Shop Gourmet Dry Fruits & Nuts
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Enjoy free delivery across all Tamil Nadu districts on all orders.
          </p>
        </div>

        {/* Search & Top Action Bar */}
        <div className="bg-white rounded-2xl border border-sand-300 p-4 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  setSearchParams({ search: e.target.value });
                } else {
                  setSearchParams({});
                }
              }}
              placeholder="Search almonds, cashews, figs, chia seeds, combos..."
              className="w-full pl-10 pr-4 py-2.5 bg-sand-50/70 border border-sand-300 rounded-xl text-xs sm:text-sm text-espresso-950 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-espresso-950"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Actions: Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-sand-100 border border-sand-300 px-4 py-2.5 rounded-xl text-xs font-bold text-espresso-950 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="shop-sort" className="text-xs font-semibold text-charcoal-500 hidden sm:inline flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs font-semibold text-espresso-950 focus:outline-none focus:border-gold-500 cursor-pointer shadow-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (cat !== 'All') {
                    setSearchParams({ category: cat });
                  } else {
                    setSearchParams({});
                  }
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-espresso-950 text-gold-300 shadow-md border border-gold-500/40'
                    : 'bg-white text-charcoal-700 hover:bg-sand-100 border border-sand-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar (3 Cols) */}
          <div className="hidden lg:block lg:col-span-3">
            <ProductFilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                if (cat !== 'All') setSearchParams({ category: cat });
                else setSearchParams({});
              }}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedWeight={selectedWeight}
              onSelectWeight={setSelectedWeight}
              selectedBadge={selectedBadge}
              onSelectBadge={setSelectedBadge}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Product Grid (9 Cols) */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-sand-300 p-4 space-y-4 animate-pulse">
                    <div className="aspect-square bg-sand-100 rounded-xl" />
                    <div className="h-4 bg-sand-200 rounded w-3/4" />
                    <div className="h-3 bg-sand-100 rounded w-1/2" />
                    <div className="h-8 bg-sand-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-sand-300 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-sand-100 border border-sand-300 flex items-center justify-center mx-auto text-charcoal-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-xl sm:text-2xl font-bold text-espresso-950">
                  No products matched your filters
                </h3>
                <p className="text-xs text-charcoal-600 max-w-sm mx-auto leading-relaxed">
                  Try adjusting your search query, clearing specific price filters, or exploring all store categories.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-gold-500 hover:bg-gold-400 text-espresso-950 font-bold text-xs px-6 py-2.5 rounded-xl shadow transition-colors inline-block"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Slide Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="absolute inset-0 bg-espresso-950/70 backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-screen max-w-xs bg-ivory-50 shadow-2xl p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand-300">
                  <h3 className="font-sans text-lg font-bold text-espresso-950">Filter Catalog</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 text-charcoal-500 hover:text-espresso-950"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <ProductFilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setMobileFilterOpen(false);
                  }}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  selectedWeight={selectedWeight}
                  onSelectWeight={(w) => {
                    setSelectedWeight(w);
                    setMobileFilterOpen(false);
                  }}
                  selectedBadge={selectedBadge}
                  onSelectBadge={(b) => {
                    setSelectedBadge(b);
                    setMobileFilterOpen(false);
                  }}
                  onReset={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                  totalResults={filteredProducts.length}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
