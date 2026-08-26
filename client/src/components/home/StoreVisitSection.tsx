import React from 'react';
import { MapPin, Phone, Clock, Navigation, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const StoreVisitSection: React.FC = () => {
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=The+Prime+Nuts+Opp+Abirami+Hospital+Madukarai+Main+Road+Sundarapuram+Coimbatore+641024';

  return (
    <section id="store-visit" className="py-16 md:py-24 bg-[#FFF7E8] border-b border-[#D8A15D]/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFCF6] rounded-3xl border border-[#D8A15D]/60 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Store Details & Actions (6 Cols) */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-[#FFF7E8] text-[#B34E00] border border-[#D8A15D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F28C00]" /> Physical Experience Store
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2B160D]">
                Visit The Prime Nuts Store
              </h2>

              <p className="text-xs sm:text-sm text-[#634739] leading-relaxed font-sans">
                Step into our retail showroom in Sundarapuram, Coimbatore to taste fresh roasted almonds, sample our seasonal combos, and explore premium dry fruit varieties in person.
              </p>

              {/* Information Cards */}
              <div className="space-y-4 pt-2 font-sans">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FFF7E8] border border-[#D8A15D]/40">
                  <div className="w-10 h-10 rounded-xl bg-[#2B160D] text-[#F28C00] flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-semibold text-[#2B160D]">Store Address</h4>
                    <p className="text-xs text-[#634739] mt-0.5 leading-relaxed">
                      Opp. Abirami Hospital, Madukarai Main Road,<br />
                      Sundarapuram, Coimbatore, Tamil Nadu – 641024
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFF7E8] border border-[#D8A15D]/40">
                    <div className="w-10 h-10 rounded-xl bg-[#2B160D] text-[#F28C00] flex items-center justify-center shrink-0 shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-[#2B160D]">Store Hours</h4>
                      <p className="text-xs text-[#634739] mt-0.5">
                        10:00 AM – 9:00 PM<br />
                        <span className="text-[#D96500] font-bold">Open Daily (All 7 Days)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFF7E8] border border-[#D8A15D]/40">
                    <div className="w-10 h-10 rounded-xl bg-[#2B160D] text-[#F28C00] flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-semibold text-[#2B160D]">Direct Hotline</h4>
                      <p className="text-xs text-[#634739] mt-0.5">
                        +91 99946 27970<br />
                        +91 75388 33035
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#F5E5C9]">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial"
              >
                <Button
                  variant="gold"
                  size="md"
                  leftIcon={<Navigation className="w-4 h-4" />}
                  className="w-full"
                >
                  Get Directions
                </Button>
              </a>

              <a
                href="tel:+919994627970"
                className="flex-1 sm:flex-initial"
              >
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Phone className="w-4 h-4" />}
                  className="w-full"
                >
                  Call Store
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Map Visual & Photo (6 Cols) */}
          <div className="lg:col-span-6 bg-[#2B160D] relative min-h-[350px] lg:min-h-full flex flex-col justify-end p-8 overflow-hidden">
            {/* Map Background Graphic / Photo */}
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
              alt="The Prime Nuts Coimbatore Showroom"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B160D] via-[#2B160D]/60 to-transparent" />

            {/* Map Overlay Card */}
            <div className="relative z-10 bg-[#1F0F08]/90 backdrop-blur-md border border-[#F28C00]/40 p-6 rounded-2xl text-[#FFFCF6] space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F28C00] animate-ping" />
                  <span className="font-serif text-sm font-bold text-[#F28C00]">
                    Sundarapuram Landmark
                  </span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#FEEDD3] hover:text-[#F28C00] flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-[#FEEDD3] leading-relaxed">
                Located right opposite to Abirami Hospital on Madukarai Main Road. Ample customer parking available for quick in-store shopping.
              </p>

              <div className="text-[11px] text-[#F28C00] bg-[#2B160D] p-2.5 rounded-xl border border-[#F28C00]/30 font-medium">
                📍 Madukarai Main Road, Sundarapuram, Coimbatore – 641024
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
