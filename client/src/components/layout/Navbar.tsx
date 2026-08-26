import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User as UserIcon, Menu, X, Shield, LogOut, PackageCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { totalItemsCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Combos & Offers', path: '/combos' },
    { name: 'Store Visit', path: '/store' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFCF6]/95 backdrop-blur-md shadow-md border-b border-[#D8A15D]/40 py-3'
            : 'bg-[#FFFCF6] border-b border-[#F5E5C9] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Official Brand Logo & Mark */}
          <BrandLogo size="md" variant="dark" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[15px] font-medium font-sans transition-colors duration-200 relative py-1 ${
                    isActive ? 'text-[#D96500] font-semibold' : 'text-[#2B160D] hover:text-[#D96500]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F28C00] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Search, Wishlist, User, Cart Drawer Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#2B160D] hover:text-[#D96500] hover:bg-[#FFF7E8] transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/account?tab=wishlist"
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#2B160D] hover:text-[#D96500] hover:bg-[#FFF7E8] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#F28C00] text-[#2B160D] text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Trigger */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#FFF7E8] border border-[#D8A15D]/60 text-[#2B160D] text-xs font-semibold hover:border-[#F28C00] transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2B160D] text-[#F28C00] flex items-center justify-center text-xs font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[90px] truncate">{user?.name.split(' ')[0]}</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#2B160D] bg-[#FFF7E8] hover:bg-[#FEEDD3] border border-[#D8A15D]/60 px-3.5 py-2 rounded-xl transition-all"
                >
                  <UserIcon className="w-4 h-4 text-[#F28C00]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown */}
              <AnimatePresence>
                {userDropdownOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 bg-[#FFFCF6] border border-[#D8A15D] rounded-xl shadow-xl py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-[#F5E5C9]">
                      <p className="text-xs font-bold text-[#2B160D] truncate">{user?.name}</p>
                      <p className="text-[11px] text-[#634739] truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/account"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#2B160D] hover:bg-[#FFF7E8] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#F28C00]" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/account?tab=orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#2B160D] hover:bg-[#FFF7E8] transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-[#F28C00]" />
                      <span>My Orders & Tracking</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#B34E00] bg-[#FEEDD3] hover:bg-[#FDDAA8] transition-colors font-medium border-y border-[#D8A15D]/40"
                      >
                        <Shield className="w-4 h-4 text-[#F28C00]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#D96500] hover:bg-[#FFF7E8] transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Animated Cart Button */}
            <button
              onClick={openDrawer}
              className="relative flex items-center gap-2 bg-[#2B160D] hover:bg-[#3A1F13] text-[#FFFCF6] px-3.5 sm:px-4 py-2 rounded-xl shadow-md border border-[#D8A15D]/40 transition-all group active:scale-95"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#F28C00] group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline">Bag</span>
              <span className="w-5 h-5 rounded-full bg-[#F28C00] text-[#2B160D] text-xs font-extrabold flex items-center justify-center shadow-sm">
                {totalItemsCount}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#2B160D] hover:bg-[#FFF7E8]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-sand-100/90 border-t border-sand-200 px-4 py-3"
            >
              <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search California badam, jumbo cashews, Afghan figs, 25-item combo, seeds..."
                    className="w-full pl-10 pr-4 py-2.5 bg-ivory-50 border border-sand-300 rounded-xl text-sm text-espresso-950 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="bg-espresso-900 text-ivory-50 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-espresso-800"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-charcoal-500 hover:text-espresso-900 p-2 text-xs font-medium"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-sand-200 bg-ivory-50 px-6 py-5 shadow-inner"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold text-charcoal-800 hover:text-gold-700 py-1"
                  >
                    {link.name}
                  </Link>
                ))}

                <hr className="border-sand-200 my-1" />

                {!isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full text-center bg-espresso-900 text-ivory-50 py-3 rounded-xl font-semibold text-sm shadow-md"
                  >
                    Sign In / Register
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/account"
                      className="text-sm font-medium text-charcoal-700 hover:text-espresso-950 py-1"
                    >
                      My Profile & Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="text-sm font-semibold text-amber-800 bg-gold-100/60 p-2.5 rounded-lg"
                      >
                        🛡️ Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="text-left text-sm font-semibold text-spice-600 py-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
