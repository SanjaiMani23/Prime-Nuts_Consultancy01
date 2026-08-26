import React from 'react';
import { Sparkles, Award, PackageCheck, Truck, CheckCircle2 } from 'lucide-react';

export const WhyThePrimeNuts: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Natural Taste & Freshness',
      tamil: 'இயற்கை சுவை & நலம்',
      desc: 'Selected whole dry fruits, crunchy nuts, and super seeds offering authentic flavor and freshness.',
    },
    {
      icon: Award,
      title: 'Direct Sourcing, Fair Price',
      tamil: 'தரம் பிரீமியம், விலை மினிமம்',
      desc: 'Quality nuts and dried fruits offered at honest, value-driven retail and combo pricing in Coimbatore.',
    },
    {
      icon: PackageCheck,
      title: 'Hygienic Sealed Packing',
      tamil: 'சுத்தமான பேக்கிங்',
      desc: 'Packed carefully in airtight containers to preserve freshness, natural crunch, and aroma.',
    },
    {
      icon: Truck,
      title: 'Delivery Across Tamil Nadu',
      tamil: 'இலவச தமிழ்நாடு டெலிவரி',
      desc: 'Fast dispatch from our Sundarapuram, Coimbatore facility directly to your home across Tamil Nadu.',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-ivory-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold font-sans uppercase tracking-widest text-gold-700 block">
            The Prime Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950">
            Why Choose The Prime Nuts?
          </h2>
          <p className="text-xs text-charcoal-600 font-sans">
            Located in Sundarapuram, Coimbatore with a focus on fresh quality, clean packaging, and helpful service.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-sand-300 shadow-sm hover:border-gold-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3 font-sans">
                  <div className="w-12 h-12 rounded-xl bg-espresso-950 text-gold-400 flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-medium font-serif text-gold-700 block">
                      {p.tamil}
                    </span>
                    <h3 className="font-sans text-base font-semibold text-espresso-950 mt-0.5">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs text-charcoal-600 font-sans leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-sand-200 flex items-center gap-1.5 text-[11px] font-semibold text-espresso-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" />
                  <span>The Prime Nuts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
