import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';

interface CategoryShowcaseProps {
  products?: Product[];
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ products = [] }) => {
  const nutsCount = products.filter((p) => p.category === 'Nuts').length;
  const driedFruitsCount = products.filter((p) => p.category === 'Dried Fruits').length;
  const seedsCount = products.filter((p) => p.category === 'Seeds').length;
  const combosCount = products.filter((p) => p.category === 'Combos').length;

  const categories = [
    {
      name: 'Nuts & Kernels',
      tamil: 'பாதாம், முந்திரி, பிஸ்தா & அக்ரூட்',
      desc: 'Whole almonds, jumbo cashews, roasted pistachios & crunchy walnuts.',
      image: '/images/products/almonds_badam.jpg',
      link: '/shop?category=Nuts',
      itemCount: nutsCount > 0 ? `${nutsCount} Varieties` : 'Fresh Harvest',
      colSpan: 'sm:col-span-1 lg:col-span-4',
    },
    {
      name: 'Dried Fruits',
      tamil: 'அத்திப்பழம், பேரீச்சை & திராட்சை',
      desc: 'Dried figs (anjeer), Medjool dates, black raisins & Badam Pisin.',
      image: '/images/products/dried_figs_anjeer.jpg',
      link: '/shop?category=Dried Fruits',
      itemCount: driedFruitsCount > 0 ? `${driedFruitsCount} Varieties` : 'Royal Selection',
      colSpan: 'sm:col-span-1 lg:col-span-4',
    },
    {
      name: 'Super Seeds',
      tamil: 'பூசணி, சியா, ஆளி & சப்ஜா விதைகள்',
      desc: 'Raw pumpkin, sunflower, organic chia, flax & halim seeds.',
      image: '/images/products/groundnuts_peanuts.jpg',
      link: '/shop?category=Seeds',
      itemCount: seedsCount > 0 ? `${seedsCount} Varieties` : 'Superfoods',
      colSpan: 'sm:col-span-1 lg:col-span-4',
    },
    {
      name: 'Combos & Packs',
      tamil: '25 வகை ராயல் மெகா காம்போ',
      desc: '25-Item family combos, 15-in-1 power mixes & daily vitality packs.',
      image: '/images/hero_nuts_luxury.jpg',
      link: '/combos',
      itemCount: combosCount > 0 ? `${combosCount} Curated Packs` : 'Store Combos',
      colSpan: 'sm:col-span-1 lg:col-span-12',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FFF7E8] border-b border-[#D8A15D]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28C00] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C00]" />
              <span>Explore Categories</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2B160D]">
              Curated Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#634739] max-w-xl leading-relaxed font-sans">
              Explore authentic varieties categorized for your daily nutrition and festive feasts.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold font-sans text-[#D96500] hover:text-[#B34E00] uppercase tracking-wider group self-start md:self-auto transition-colors"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Asymmetric Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`${cat.colSpan}`}
            >
              <Link
                to={cat.link}
                className="group relative rounded-3xl overflow-hidden bg-[#2B160D] block h-72 sm:h-80 border border-[#D8A15D]/60 shadow-sm hover:shadow-2xl hover:border-[#F28C00] transition-all duration-400"
              >
                {/* Category Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B160D] via-[#2B160D]/45 to-black/10" />

                {/* Top Category Badge */}
                <div className="absolute top-4 right-4 bg-[#2B160D]/90 backdrop-blur-md border border-[#F28C00]/40 text-[#FEEDD3] text-[10px] font-bold font-sans px-3 py-1 rounded-full shadow-sm">
                  {cat.itemCount}
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-0 inset-x-0 p-6 space-y-1.5 text-[#FFFCF6]">
                  <p className="text-xs text-[#F28C00] font-serif font-medium">{cat.tamil}</p>
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans text-xl sm:text-2xl font-bold group-hover:text-[#FEEDD3] transition-colors">
                      {cat.name}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-[#F28C00] text-[#2B160D] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#D96500] group-hover:text-[#FFFCF6] transition-all shadow-md shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-[#FEEDD3]/90 font-sans line-clamp-1">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
