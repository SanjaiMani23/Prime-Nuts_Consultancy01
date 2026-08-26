import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/common/Button';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, MessageCircle, Sparkles, Truck, Check } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    updateWeight,
    removeFromCart,
    subtotal,
    deliveryFee,
    discount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
    totalSavings,
    generateWhatsAppOrderUrl,
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      const ok = applyCoupon(couponInput.trim());
      if (ok) setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-ivory-50 py-16 px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-10 rounded-3xl border border-sand-300 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-sand-100 border border-sand-300 flex items-center justify-center mx-auto text-charcoal-400">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-espresso-950">
            Your Bag is Empty
          </h1>
          <p className="text-xs text-charcoal-600 font-sans leading-relaxed">
            Looks like you haven’t added any delicious dry fruits or combo packs yet.
          </p>
          <Link to="/shop" className="inline-block pt-2">
            <Button variant="gold" size="lg">
              Explore Fresh Collection
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory-50 py-10 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-sans text-3xl sm:text-4xl font-bold text-espresso-950 mb-8">
          Shopping Bag ({cart.reduce((sum, it) => sum + it.quantity, 0)} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items Table (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Bar */}
            <div className="bg-sand-100 border border-sand-300 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-espresso-950 text-gold-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-espresso-950 font-sans">
                    Free Express Shipping Across Tamil Nadu!
                  </p>
                  <p className="text-[11px] text-charcoal-600 font-sans">
                    Direct dispatch from our Sundarapuram, Coimbatore facility.
                  </p>
                </div>
              </div>
              <span className="text-gold-700 font-bold text-xs bg-gold-100 border border-gold-300 px-3 py-1 rounded-full font-sans">
                ₹0 FREE
              </span>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-3xl border border-sand-300 p-6 shadow-sm divide-y divide-sand-200">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-sand-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-sans text-base font-bold text-espresso-950 hover:text-gold-700 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        Category: <span className="font-semibold text-charcoal-700">{item.product.category}</span>
                      </p>

                      {/* Weight Selector */}
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                        <label htmlFor={`cart-weight-${item.product.id}`} className="text-[11px] text-charcoal-500 font-medium">
                          Pack:
                        </label>
                        <select
                          id={`cart-weight-${item.product.id}`}
                          value={item.selectedWeight}
                          onChange={(e) => updateWeight(item.product.id, item.selectedWeight, e.target.value)}
                          className="bg-sand-100 border border-sand-300 rounded-lg px-2 py-0.5 font-semibold text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
                        >
                          {item.product.variants.map((v) => (
                            <option key={v.weight} value={v.weight}>
                              {v.weight} (₹{v.price})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="flex items-center border border-sand-300 rounded-xl bg-sand-50 overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedWeight, -1)}
                        className="p-2 hover:bg-sand-200 text-charcoal-700 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-espresso-950 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedWeight, 1)}
                        className="p-2 hover:bg-sand-200 text-charcoal-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[70px]">
                      <span className="font-sans text-lg font-bold text-espresso-950 block">
                        ₹{item.price * item.quantity}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-charcoal-400 line-through">
                          ₹{item.originalPrice * item.quantity}
                        </span>
                      )}
                    </div>

                    {/* Actions: Save & Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedWeight)}
                        className="p-2 text-charcoal-400 hover:text-spice-600 transition-colors"
                        title="Remove from bag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Order Instructions / Notes */}
            <div className="bg-white rounded-3xl border border-sand-300 p-6 shadow-sm">
              <label htmlFor="order-notes" className="block font-sans text-sm font-bold text-espresso-950 mb-2">
                Order Notes or Special Packing Instructions (Optional)
              </label>
              <textarea
                id="order-notes"
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Please pack in festive ribbon gift pouches, or call before dispatch..."
                className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-sans text-xl font-bold text-espresso-950 pb-4 border-b border-sand-200">
                Order Summary
              </h3>

              {/* Promo Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="bg-gold-50 border border-gold-300 p-3 rounded-xl flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center gap-1.5 text-espresso-950 font-semibold">
                      <Check className="w-4 h-4 text-gold-600" />
                      <span>Coupon <strong className="text-gold-700">{appliedCoupon}</strong> Applied</span>
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
                        placeholder="Promo Code (WELCOME100)"
                        className="w-full pl-8 pr-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs uppercase text-espresso-950 focus:outline-none focus:border-gold-500 font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-espresso-900 text-ivory-50 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-espresso-800 transition-colors font-sans"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-xs text-charcoal-700 pt-2 font-sans">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-espresso-950">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-gold-700 font-semibold">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tamil Nadu Delivery</span>
                  <span className="font-bold text-gold-700">FREE (₹0)</span>
                </div>

                {totalSavings > 0 && (
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Total Savings:
                    </span>
                    <span className="font-bold">₹{totalSavings}</span>
                  </div>
                )}

                <hr className="border-sand-200 my-2" />

                <div className="flex justify-between text-lg font-sans font-bold text-espresso-950 pt-1">
                  <span>Estimated Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Button
                variant="gold"
                size="lg"
                className="w-full shadow-lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>

              {/* WhatsApp Cart Ordering */}
              <a
                href={generateWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Bag via WhatsApp</span>
              </a>

              <p className="text-[10px] text-center text-charcoal-500">
                🔒 Safe & Secure Checkout. We do not store card or payment credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
