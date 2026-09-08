import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../common/BrandLogo';
import { MapPin, Phone, Clock, MessageCircle, ShieldCheck, Truck, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-espresso-950 text-ivory-100 border-t-2 border-gold-500/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-espresso-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-espresso-900/60 border border-gold-500/15">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-400/30 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-semibold text-ivory-50 text-sm">Free Delivery Across Tamil Nadu</h4>
              <p className="text-sand-400 text-xs mt-1 leading-relaxed">
                Prompt dispatch across Coimbatore, Chennai, Madurai, Salem, Trichy & all TN districts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-espresso-900/60 border border-gold-500/15">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-semibold text-ivory-50 text-sm">100% Handpicked Quality</h4>
              <p className="text-sand-400 text-xs mt-1 leading-relaxed">
                Hygienically sorted and vacuum-sealed for maximum natural crunch and flavor.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-espresso-900/60 border border-gold-500/15">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-ivory-50 text-sm">தரம் பிரீமியம், விலை மினிமம்</h4>
              <p className="text-sand-400 text-xs mt-1 leading-relaxed font-sans">
                Direct sourcing ensures authentic premium quality at minimum store prices.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-espresso-800 font-sans">
          {/* Col 1 & 2: Store Identity & Quote */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" />

            <p className="text-sand-300 text-xs leading-relaxed max-w-sm font-sans">
              Your destination for gourmet whole nuts, exotic dried fruits, super seeds, and value combo packs in Sundarapuram, Coimbatore.
            </p>

            {/* Tamil Brand Trust Box */}
            <div className="p-3.5 rounded-xl bg-espresso-900/90 border border-gold-400/30 text-xs text-gold-300 font-serif font-medium leading-relaxed">
              “சுத்தமான பேக்கிங், தரமான நட்ஸ்... உங்கள் நலம் எங்கள் லட்சியம்!”
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919994627970"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366] text-ivory-100 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#25D366]/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h5 className="font-serif text-gold-400 text-sm font-semibold mb-4 tracking-wider uppercase">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-sand-300">
              <li>
                <Link to="/shop?category=Nuts" className="hover:text-gold-300 transition-colors">
                  Whole Almonds & Cashews
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Dried Fruits" className="hover:text-gold-300 transition-colors">
                  Afghan Anjeer & Dates
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Seeds" className="hover:text-gold-300 transition-colors">
                  Raw Pumpkin & Chia Seeds
                </Link>
              </li>
              <li>
                <Link to="/combos" className="hover:text-gold-300 transition-colors">
                  25-Item & 15-in-1 Combos
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Snacks" className="hover:text-gold-300 transition-colors">
                  Healthy Vegetable Chips
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h5 className="font-serif text-gold-400 text-sm font-semibold mb-4 tracking-wider uppercase">
              Shopping & Help
            </h5>
            <ul className="space-y-2.5 text-xs text-sand-300">
              <li>
                <Link to="/shop" className="hover:text-gold-300 transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/combos" className="hover:text-gold-300 transition-colors">
                  Special Value Packs
                </Link>
              </li>
              <li>
                <Link to="/account?tab=orders" className="hover:text-gold-300 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-gold-300 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-gold-300 transition-colors">
                  Sundarapuram Store Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Physical Store Info */}
          <div>
            <h5 className="font-serif text-gold-400 text-sm font-semibold mb-4 tracking-wider uppercase">
              Visit Our Store
            </h5>
            <div className="space-y-3 text-xs text-sand-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  Opp. Abirami Hospital,<br />
                  Madukarai Main Road, Sundarapuram,<br />
                  Coimbatore, TN – 641024
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+919994627970" className="hover:text-gold-300">+91 99946 27970</a>
                  <a href="tel:+917538833035" className="hover:text-gold-300">+91 75388 33035</a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>10:00 AM – 9:00 PM Daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <p>© {new Date().getFullYear()} The Prime Nuts, Sundarapuram, Coimbatore. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gold-400">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span>for health & wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
