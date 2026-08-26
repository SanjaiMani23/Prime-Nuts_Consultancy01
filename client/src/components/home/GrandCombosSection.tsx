import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MessageCircle, Gift, ShoppingBag } from 'lucide-react';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

interface GrandCombosSectionProps {
  combos?: Product[];
  loading?: boolean;
}

export const GrandCombosSection: React.FC<GrandCombosSectionProps> = ({
  combos: propCombos,
  loading: propLoading = false,
}) => {
  const [combos, setCombos] = useState<Product[]>(propCombos || []);
  const [loading, setLoading] = useState<boolean>(propLoading);
  const { addToCart } = useCart();

  useEffect(() => {
    if (propCombos && propCombos.length > 0) {
      setCombos(propCombos);
      return;
    }

    setLoading(true);
    api.getProducts({ category: 'Combos' })
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setCombos(res.products);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch combos for GrandCombosSection:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [propCombos]);

  // Display top 2 flagship combos
  const displayCombos = combos.slice(0, 2);

  return (
    <section className="py-16 md:py-24 bg-[#2B160D] text-[#FFF7E8] relative overflow-hidden border-b border-[#F28C00]/30">
      {/* Background Saffron Ambience */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#F28C00]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#D96500]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#F28C00]/20 text-[#F28C00] border border-[#F28C00]/40 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>Sundarapuram Store Special</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFCF6]">
            Grand Value Combo Offers
          </h2>
          <p className="text-xs sm:text-sm text-[#FEEDD3] font-serif font-medium leading-relaxed">
            “கார்ப்பரேட் கிஃப்டிங்கிற்கு ஏற்ற மிகச்சிறந்த நட்ஸ் காம்போஸ்!” — Bundled value with maximum freshness.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#1F0F08] rounded-3xl border border-[#D8A15D]/40 p-8 space-y-6 animate-pulse">
                <div className="h-6 bg-[#2B160D] rounded w-1/3" />
                <div className="h-8 bg-[#2B160D] rounded w-3/4" />
                <div className="h-48 bg-[#2B160D] rounded-2xl" />
                <div className="h-10 bg-[#2B160D] rounded-xl" />
              </div>
            ))}
          </div>
        ) : displayCombos.length === 0 ? (
          <div className="text-center py-12 bg-[#1F0F08] rounded-3xl border border-[#D8A15D]/40 p-8">
            <p className="text-sm font-semibold text-[#FEEDD3]">Explore our store combo packs in the combos catalog.</p>
            <Link to="/combos" className="text-xs text-[#F28C00] font-bold underline mt-2 inline-block">
              View all combos →
            </Link>
          </div>
        ) : (
          /* Combos Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {displayCombos.map((combo, idx) => {
              const activeVariant = combo.variants[0] || { weight: '1kg', price: 999, originalPrice: 1250 };
              const currentPrice = activeVariant.price;
              const originalPrice = activeVariant.originalPrice;
              const discountPercent =
                originalPrice && originalPrice > currentPrice
                  ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                  : 0;

              const itemsList =
                combo.ingredients && combo.ingredients.length > 0
                  ? combo.ingredients
                  : [
                      'California Almonds & Jumbo Cashews',
                      'Roasted Iranian Pistachios & Afghan Walnuts',
                      'King Medjool Dates & Afghan Figs',
                      'Super Seeds: Pumpkin, Chia, Flax & Sunflower',
                    ];

              return (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className="bg-[#1F0F08] rounded-3xl border border-[#D8A15D]/40 p-6 sm:p-8 flex flex-col justify-between hover:border-[#F28C00] transition-all duration-300 shadow-2xl relative overflow-hidden group"
                >
                  <div className="space-y-6">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {discountPercent > 0 ? (
                        <span className="bg-[#F28C00] text-[#2B160D] text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm font-sans">
                          {discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="bg-[#F28C00] text-[#2B160D] text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm font-sans">
                          SPECIAL COMBO
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#F28C00] border border-[#F28C00]/40 px-3 py-1 rounded-full bg-[#2B160D] font-sans">
                        {combo.badges?.[0] || 'BEST VALUE'}
                      </span>
                    </div>

                    {/* Title & Tamil Name */}
                    <div>
                      <Link to={`/product/${combo.slug}`}>
                        <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#FFFCF6] group-hover:text-[#F28C00] transition-colors">
                          {combo.name}
                        </h3>
                      </Link>
                      {combo.tamilName && (
                        <p className="text-xs text-[#F28C00] font-serif font-medium mt-1">
                          {combo.tamilName}
                        </p>
                      )}
                      <p className="text-xs text-[#FEEDD3] font-sans mt-2 leading-relaxed">
                        {combo.shortDescription}
                      </p>
                    </div>

                    {/* Image and Checklist Split */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      <div className="sm:col-span-5 rounded-2xl overflow-hidden aspect-square border border-[#D8A15D]/30 bg-[#2B160D]">
                        <Link to={`/product/${combo.slug}`} className="block w-full h-full">
                          <img
                            src={combo.images[0]}
                            alt={combo.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      <div className="sm:col-span-7 space-y-2 text-xs text-[#FFF7E8] font-sans">
                        <p className="font-bold text-[#F28C00] uppercase tracking-wider text-[11px] mb-1">
                          Included in this pack:
                        </p>
                        {itemsList.slice(0, 6).map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#F28C00] shrink-0 mt-0.5" />
                            <span className="leading-tight text-[#FEEDD3]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA Row */}
                  <div className="mt-8 pt-6 border-t border-[#3A1F13] flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] text-[#D8A15D] block font-medium font-sans">
                        Pack Weight: {activeVariant.weight}
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5 font-sans">
                        <span className="text-2xl sm:text-3xl font-bold text-[#F28C00]">
                          ₹{currentPrice}
                        </span>
                        {originalPrice && originalPrice > currentPrice && (
                          <span className="text-sm text-[#8C624E] line-through">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/919994627970?text=${encodeURIComponent(
                          `Vanakkam! I would like to order the ${combo.name} (₹${currentPrice}) from The Prime Nuts.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl shadow transition-colors"
                        title="Order on WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>

                      <button
                        onClick={() => addToCart(combo, activeVariant.weight, 1)}
                        className="p-3 bg-[#2B160D] hover:bg-[#3A1F13] border border-[#F28C00]/40 text-[#F28C00] rounded-xl shadow transition-colors"
                        title="Add to Bag"
                        aria-label={`Add ${combo.name} to bag`}
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>

                      <Link to={`/product/${combo.slug}`}>
                        <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                          Order Combo Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Combos CTA */}
        <div className="text-center mt-12">
          <Link to="/combos">
            <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Combos →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
