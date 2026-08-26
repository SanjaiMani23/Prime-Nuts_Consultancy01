import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Store, Gift, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { totalItemsCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();

  const items = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/shop', icon: Store },
    { name: 'Combos', path: '/combos', icon: Gift },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory-50/95 backdrop-blur-md border-t border-sand-300 py-2 px-4 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-gold-700 font-bold' : 'text-charcoal-600 hover:text-espresso-950'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-gold-700 stroke-[2.5]' : ''}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Wishlist Link */}
        <Link
          to="/account?tab=wishlist"
          className={`relative flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            location.search.includes('wishlist') ? 'text-gold-700 font-bold' : 'text-charcoal-600'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-amber-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </Link>

        {/* Bag Trigger */}
        <button
          onClick={openDrawer}
          className="relative flex flex-col items-center gap-1 text-[11px] font-medium text-charcoal-700 hover:text-gold-700"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-espresso-950" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-gold-500 text-espresso-950 text-[9px] font-extrabold rounded-full flex items-center justify-center shadow">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="font-semibold text-espresso-950">Bag</span>
        </button>
      </div>
    </div>
  );
};
