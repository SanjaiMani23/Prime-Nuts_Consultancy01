import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle, Sparkles, Tag, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Button } from '../common/Button';

export const AnimatedCartDrawer: React.FC = () => {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    updateWeight,
    removeFromCart,
    subtotal,
    discount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
    totalSavings,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const success = applyCoupon(couponInput.trim());
      if (success) setCouponInput('');
    }
  };

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Subtle Dim & Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-espresso-950/70 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Animated Drawer Panel (320ms smooth curve) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-ivory-50 text-espresso-950 shadow-drawer flex flex-col border-l border-sand-300"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-sand-200 bg-sand-50/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-espresso-950 text-gold-400 flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-espresso-950">Your Shopping Bag</h3>
                    <p className="text-[11px] text-charcoal-500 font-medium font-sans">
                      {cart.length} unique {cart.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeDrawer}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-500 hover:text-espresso-950 hover:bg-sand-200 transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Tamil Nadu Delivery Indicator */}
              <div className="bg-sand-100/90 px-6 py-3 border-b border-sand-200/80 font-sans">
                <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                  <span className="font-semibold text-espresso-900 flex items-center gap-1.5">
                    <span className="text-gold-600">✨</span> Free Tamil Nadu Delivery
                  </span>
                  <span className="text-gold-700 font-bold text-[11px] bg-gold-100/80 px-2 py-0.5 rounded-full border border-gold-300/60 font-sans">
                    UNLOCKED (₹0)
                  </span>
                </div>
                <div className="w-full bg-sand-300 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-gold-600 to-gold-400 h-full w-full rounded-full"></div>
                </div>
                <p className="text-[10px] text-charcoal-600 mt-1 font-sans">
                  Enjoy zero delivery charges across all districts in Tamil Nadu!
                </p>
              </div>

              {/* Drawer Body / Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 font-sans">
                    <div className="w-20 h-20 rounded-full bg-sand-100 border border-sand-300 flex items-center justify-center mb-4 text-charcoal-400">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h4 className="font-sans text-xl font-bold text-espresso-950 mb-1">Your bag is empty</h4>
                    <p className="text-xs text-charcoal-600 max-w-xs mb-6 leading-relaxed font-sans">
                      Discover our handpicked California almonds, jumbo cashews, Afghan figs, and grand combo packs!
                    </p>
                    <Button
                      variant="gold"
                      size="md"
                      onClick={() => {
                        closeDrawer();
                        navigate('/shop');
                      }}
                    >
                      Start Shopping Now
                    </Button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedWeight}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 bg-white rounded-2xl border border-sand-200/90 shadow-sm flex gap-3.5 items-start relative group font-sans"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-sand-200 shrink-0"
                      />

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 pr-6">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={closeDrawer}
                          className="font-sans text-sm font-semibold text-espresso-950 hover:text-gold-700 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>

                        {/* Weight Switcher Dropdown */}
                        <div className="mt-1 flex items-center gap-1.5 font-sans">
                          <label htmlFor={`weight-${item.product.id}`} className="text-[10px] uppercase font-semibold text-charcoal-500">
                            Weight:
                          </label>
                          <select
                            id={`weight-${item.product.id}`}
                            value={item.selectedWeight}
                            onChange={(e) => updateWeight(item.product.id, item.selectedWeight, e.target.value)}
                            className="text-xs font-semibold text-espresso-900 bg-sand-100 border border-sand-300 rounded-md px-1.5 py-0.5 focus:outline-none focus:border-gold-500 cursor-pointer font-sans"
                          >
                            {item.product.variants.map((v) => (
                              <option key={v.weight} value={v.weight}>
                                {v.weight} (₹{v.price})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="mt-3 flex items-center justify-between font-sans">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-sand-300 rounded-lg bg-sand-50 overflow-hidden shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedWeight, -1)}
                              className="p-1.5 hover:bg-sand-200 text-charcoal-700 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-espresso-950 select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedWeight, 1)}
                              className="p-1.5 hover:bg-sand-200 text-charcoal-700 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right">
                            <span className="font-sans font-bold text-sm text-espresso-950">
                              ₹{item.price * item.quantity}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="block text-[10px] text-charcoal-400 line-through">
                                ₹{item.originalPrice * item.quantity}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove Trash Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                        className="absolute top-3 right-3 text-charcoal-400 hover:text-spice-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}

                {/* Promo Code Box */}
                {cart.length > 0 && (
                  <div className="bg-sand-100/70 p-3.5 rounded-xl border border-sand-200 mt-2">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-espresso-950 font-semibold">
                          <Check className="w-4 h-4 text-gold-600" />
                          <span>Code <strong className="text-gold-700 uppercase">{appliedCoupon}</strong> applied!</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs text-spice-600 hover:underline font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Promo code (e.g. WELCOME100)"
                            className="w-full pl-8 pr-3 py-1.5 bg-white border border-sand-300 rounded-lg text-xs uppercase text-espresso-950 focus:outline-none focus:border-gold-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-espresso-900 text-ivory-50 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-espresso-800"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Drawer Footer / Checkout CTA */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-sand-300/80 bg-sand-50/90 space-y-3">
                  {/* Bill Breakdown */}
                  <div className="space-y-1.5 text-xs text-charcoal-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-espresso-950">₹{subtotal}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-gold-700 font-semibold">
                        <span>Discount ({appliedCoupon})</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Across Tamil Nadu</span>
                      <span className="font-bold text-gold-700">FREE</span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="flex justify-between text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-md border border-amber-200">
                        <span className="flex items-center gap-1 font-medium">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Total Savings on this Order:
                        </span>
                        <span className="font-bold">₹{totalSavings}</span>
                      </div>
                    )}

                    <hr className="border-sand-200 my-1" />

                    <div className="flex justify-between text-base font-sans font-bold text-espresso-950 pt-1">
                      <span>Total Amount</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  {/* Primary Checkout CTA */}
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full shadow-lg"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={handleCheckoutClick}
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Order Directly on WhatsApp Button */}
                  <a
                    href={generateWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order Bag on WhatsApp (+91 99946 27970)</span>
                  </a>

                  {/* View Full Cart Page & Continue Shopping */}
                  <div className="flex items-center justify-between text-xs text-charcoal-600 pt-1 px-1">
                    <Link
                      to="/cart"
                      onClick={closeDrawer}
                      className="hover:text-gold-700 underline font-medium"
                    >
                      View Detailed Cart
                    </Link>
                    <button
                      onClick={closeDrawer}
                      className="hover:text-espresso-950 underline font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
