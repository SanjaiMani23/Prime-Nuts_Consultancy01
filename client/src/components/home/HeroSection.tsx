import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';

interface SlideItem {
  id: number;
  image: string;
  alt: string;
  ribbonTag: string;
}

const HERO_SLIDES: SlideItem[] = [
  {
    id: 1,
    image: '/images/hero/hero_nut_collection.jpg',
    alt: 'Premium almonds, cashews, pistachios, walnuts, dates and raisins',
    ribbonTag: 'Almonds • Cashews • Pistachios • Walnuts • Dates • Raisins',
  },
  {
    id: 2,
    image: '/images/hero/hero_nuts_closeup.jpg',
    alt: 'Close-up view of fresh almonds, cashews, pistachios and walnuts',
    ribbonTag: 'California Almonds • Jumbo Cashews • Afghan Walnuts',
  },
  {
    id: 3,
    image: '/images/hero/hero_dry_fruits.jpg',
    alt: 'Sophisticated dried fruits collection featuring dates, figs, raisins and blueberries',
    ribbonTag: 'Medjool Dates • Afghan Figs • Black & Golden Raisins',
  },
  {
    id: 4,
    image: '/images/hero/hero_seeds_collection.jpg',
    alt: 'Healthy seeds collection featuring pumpkin, sunflower, flax and watermelon seeds',
    ribbonTag: 'Pumpkin Seeds • Sunflower Seeds • Flax & Chia Seeds',
  },
  {
    id: 5,
    image: '/images/hero/hero_premium_combo.jpg',
    alt: 'Luxurious healthy snack collection combo of premium nuts, dry fruits and seeds',
    ribbonTag: 'Grand Combo Feast • Handpicked Pure Quality',
  },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();

  // Preload all 5 slider images for flicker-free transitions
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // 5-second continuous autoplay loop (pauses on desktop hover, restarts on slide change)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const currentSlideData = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-[#FFF7E8] pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28 border-b border-[#D8A15D]/30">
      {/* Soft Ambient Warm Saffron Radial Accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#F28C00]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#FEEDD3]/80 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left / Primary Content (6 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-8 text-left z-20">
            {/* Small Eyebrow Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 bg-[#FFFCF6] border border-[#D8A15D] px-3.5 py-1.5 rounded-full shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F28C00]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#2B160D] uppercase">
                THE PRIME NUTS • SUNDARAPURAM
              </span>
            </motion.div>

            {/* Main Tamil Headline (Modern Bold Sans-Serif Typography in Noto Sans Tamil) */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-[64px] xl:text-[72px] font-extrabold tracking-tight text-[#2B160D] leading-[1.03]"
                style={{ fontFamily: '"Noto Sans Tamil", "Manrope", sans-serif' }}
              >
                தரம் பிரீமியம், <br />
                <span className="text-[#D96500]">விலை மினிமம்...</span>
              </motion.h1>

              {/* Supporting English */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg sm:text-xl font-bold text-[#2B160D] font-sans tracking-tight"
                style={{ fontFamily: '"Manrope", sans-serif' }}
              >
                Premium quality. Minimum price.
              </motion.p>
            </div>

            {/* Additional Short Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-[#3A2418] max-w-lg leading-relaxed font-medium font-sans"
              style={{ fontFamily: '"Manrope", sans-serif' }}
            >
              Premium dry fruits, nuts and healthy treats for everyday life.
            </motion.p>

            {/* Approved Tamil Quote Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pl-3.5 border-l-2 border-[#F28C00]"
            >
              <p
                className="text-sm sm:text-base text-[#7A3E0B] font-semibold leading-relaxed"
                style={{ fontFamily: '"Noto Sans Tamil", "Manrope", sans-serif' }}
              >
                “தரம் பிரீமியம், விலை மினிமம்... நட்ஸ் வாங்குங்க நச்சுனு வாழுங்க!”
              </p>
            </motion.div>

            {/* Call To Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link to="/shop">
                <Button
                  variant="gold"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-lg shadow-[#F28C00]/25 font-bold"
                >
                  Shop Now
                </Button>
              </Link>

              <Link to="/combos">
                <Button
                  variant="primary"
                  size="lg"
                  className="font-bold"
                >
                  Explore Combos
                </Button>
              </Link>

              <a
                href="https://wa.me/919994627970?text=Vanakkam!%20I%20would%20like%20to%20order%20from%20The%20Prime%20Nuts."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex"
              >
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<MessageCircle className="w-4 h-4 text-[#25D366]" />}
                  className="bg-[#FFFCF6] border-[#D8A15D] text-[#2B160D] hover:bg-[#FEEDD3] hover:text-[#2B160D] font-semibold shadow-sm"
                >
                  WhatsApp Order
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Right / 5-Image Automatic Slider Visual (6 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 relative mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-lg lg:max-w-none group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slider Image Container */}
              <div className="relative rounded-3xl lg:rounded-[36px] overflow-hidden shadow-2xl border border-[#D8A15D]/60 aspect-[16/10] sm:aspect-[4/3] bg-[#FFFCF6]">
                <AnimatePresence>
                  <motion.img
                    key={currentSlideData.id}
                    src={currentSlideData.image}
                    alt={currentSlideData.alt}
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.015 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.005 }}
                    transition={{ duration: shouldReduceMotion ? 0.3 : 1.3, ease: [0.65, 0, 0.35, 1] }}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading={currentSlide === 0 ? 'eager' : 'lazy'}
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-[#2B160D]/50 via-transparent to-transparent pointer-events-none z-10" />

                {/* Minimal 5-Step Saffron Indicator Badge */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#2B160D]/75 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#F28C00]/30 shadow-md">
                  {HERO_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        idx === currentSlide
                          ? 'w-5 h-1.5 bg-[#F28C00]'
                          : 'w-1.5 h-1.5 bg-[#FFFCF6]/40 hover:bg-[#FFFCF6]'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Micro Brand Ribbon on visual */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 py-2 px-3.5 rounded-xl bg-[#2B160D]/90 backdrop-blur-md border border-[#F28C00]/30 flex items-center justify-between text-[#FFF7E8] z-20 pointer-events-none">
                  <span className="text-[11px] sm:text-xs font-serif font-semibold text-[#FFF7E8] truncate pr-2">
                    {currentSlideData.ribbonTag}
                  </span>
                  <span className="text-[10px] text-[#F28C00] font-bold shrink-0 hidden sm:inline">
                    100% Pure
                  </span>
                </div>

                {/* Manual Navigation Controls (Visible on hover) */}
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#2B160D]/70 hover:bg-[#F28C00] text-[#FFFCF6] hover:text-[#2B160D] flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-md"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#2B160D]/70 hover:bg-[#F28C00] text-[#FFFCF6] hover:text-[#2B160D] flex items-center justify-center backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 shadow-md"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
