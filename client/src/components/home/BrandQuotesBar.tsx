import React from 'react';
import { Sparkles, Shield, Heart, Award } from 'lucide-react';

export const BrandQuotesBar: React.FC = () => {
  const quotes = [
    {
      tamil: '“கெமிக்கல் இல்லாத இயற்கை சுவை... எங்கள் கடையின் உலர் பழங்கள்!”',
      english: 'Natural dried fruits selected for authentic taste.',
      icon: Sparkles,
    },
    {
      tamil: '“சுத்தமான பேக்கிங், தரமான நட்ஸ்... உங்கள் நலம் எங்கள் லட்சியம்!”',
      english: 'Clean and careful packing for everyday freshness.',
      icon: Shield,
    },
    {
      tamil: '“மொறுமொறுப்பான முந்திரி... ஒவ்வொரு கடியிலும் அலாதி சுவை!”',
      english: 'Crispy quality cashews with delicious nutty taste.',
      icon: Heart,
    },
    {
      tamil: '“தரம் பிரீமியம், விலை மினிமம்... நட்ஸ் வாங்குங்க நச்சுனு வாழுங்க!”',
      english: 'Quality dry fruits and nuts at fair store prices.',
      icon: Award,
    },
  ];

  return (
    <section className="bg-espresso-950 py-8 border-y border-gold-500/25 text-ivory-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {quotes.map((q, idx) => {
            const Icon = q.icon;
            return (
              <div
                key={idx}
                className="bg-espresso-900/70 border border-gold-500/20 hover:border-gold-400/50 p-4 rounded-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-espresso-950 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="font-serif text-xs sm:text-sm font-medium text-gold-200 leading-snug">
                    {q.tamil}
                  </p>
                </div>
                <p className="font-sans text-[11px] text-sand-400 mt-2 pt-2 border-t border-espresso-800 leading-relaxed">
                  {q.english}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
