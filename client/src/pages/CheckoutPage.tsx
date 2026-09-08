import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { LuxuryInput } from '../components/common/LuxuryInput';
import {
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard,
  QrCode,
  MessageCircle,
  Sparkles,
  Store,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryFee, discount, appliedCoupon, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [street, setStreet] = useState(user?.addresses[0]?.street || '');
  const [landmark, setLandmark] = useState(user?.addresses[0]?.landmark || '');
  const [city, setCity] = useState(user?.addresses[0]?.city || 'Coimbatore');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState(user?.addresses[0]?.pincode || '641024');

  const [deliveryMethod, setDeliveryMethod] = useState<
    'Free Tamil Nadu Delivery' | 'Store Pickup (Sundarapuram)'
  >('Free Tamil Nadu Delivery');

  const [paymentMethod, setPaymentMethod] = useState<
    'UPI / Online' | 'Cash on Delivery' | 'Direct WhatsApp Order'
  >('UPI / Online');

  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !street || !city || !pincode) {
      toast.error('Missing Details', 'Please complete all required address fields.');
      return;
    }

    setIsProcessing(true);

    const orderPayload = {
      items: cart.map((it) => ({
        productId: it.product.id,
        productName: it.product.name,
        productSlug: it.product.slug,
        image: it.product.images[0],
        weight: it.selectedWeight,
        price: it.price,
        quantity: it.quantity,
        total: it.price * it.quantity,
      })),
      shippingAddress: {
        fullName,
        phone,
        street,
        landmark,
        city,
        state,
        pincode,
      },
      deliveryMethod,
      paymentMethod,
      subtotal,
      deliveryFee,
      discount,
      couponCode: appliedCoupon || undefined,
      total,
      guestCustomer: !isAuthenticated ? { name: fullName, email, phone } : undefined,
    };

    try {
      const res = await api.createOrder(orderPayload);
      if (res.order) {
        clearCart();
        toast.gold('Order Placed Successfully! 🎉', `Order reference: ${res.order.orderNumber}`);
        navigate(`/order-success/${res.order.orderNumber}`);
      }
    } catch (err: any) {
      toast.error('Order Failed', err.response?.data?.message || 'Unable to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <main className="min-h-screen bg-ivory-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
            Secure Checkout
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold text-espresso-950 mt-1">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-sans">
          {/* Left Column: Delivery Details & Payment (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Contact & Customer Details */}
            <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-sand-200">
                <div className="w-8 h-8 rounded-full bg-espresso-950 text-gold-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-sans text-xl font-bold text-espresso-950">
                  Customer & Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LuxuryInput
                  label="Full Name *"
                  type="text"
                  placeholder="e.g. Karthik Ramanathan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <LuxuryInput
                  label="Phone Number (For Delivery Updates) *"
                  type="tel"
                  placeholder="+91 99946 27970"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <LuxuryInput
                label="Email Address (For Invoices)"
                type="email"
                placeholder="karthik@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-sand-200">
                <div className="w-8 h-8 rounded-full bg-espresso-950 text-gold-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-sans text-xl font-bold text-espresso-950">
                    Delivery Address
                  </h3>
                  <p className="text-xs text-gold-700 font-semibold mt-0.5 font-sans">
                    ✨ Free Express Delivery Across Tamil Nadu
                  </p>
                </div>
              </div>

              {/* Delivery Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Free Tamil Nadu Delivery')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    deliveryMethod === 'Free Tamil Nadu Delivery'
                      ? 'bg-espresso-950 text-ivory-50 border-gold-500 shadow-md ring-1 ring-gold-500/30'
                      : 'bg-sand-50 text-charcoal-800 border-sand-300 hover:bg-sand-100'
                  }`}
                >
                  <Truck className={`w-5 h-5 ${deliveryMethod === 'Free Tamil Nadu Delivery' ? 'text-gold-400' : 'text-charcoal-500'}`} />
                  <div>
                    <p className="font-bold text-xs">Doorstep Delivery Across TN</p>
                    <p className="text-[11px] opacity-80 mt-0.5">Free Express Dispatch (₹0)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Store Pickup (Sundarapuram)')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    deliveryMethod === 'Store Pickup (Sundarapuram)'
                      ? 'bg-espresso-950 text-ivory-50 border-gold-500 shadow-md ring-1 ring-gold-500/30'
                      : 'bg-sand-50 text-charcoal-800 border-sand-300 hover:bg-sand-100'
                  }`}
                >
                  <Store className={`w-5 h-5 ${deliveryMethod === 'Store Pickup (Sundarapuram)' ? 'text-gold-400' : 'text-charcoal-500'}`} />
                  <div>
                    <p className="font-bold text-xs">Pickup at Sundarapuram Store</p>
                    <p className="text-[11px] opacity-80 mt-0.5">Opp. Abirami Hospital (Ready in 2 hrs)</p>
                  </div>
                </button>
              </div>

              <LuxuryInput
                label="Street Address / House No. / Apartment *"
                type="text"
                placeholder="e.g. 14/B, Nehru Nagar East, Kalapatti Road"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <LuxuryInput
                  label="Landmark (Optional)"
                  type="text"
                  placeholder="Near Abirami Temple"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />

                <LuxuryInput
                  label="City / District *"
                  type="text"
                  placeholder="Coimbatore, Chennai, Salem"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />

                <LuxuryInput
                  label="Pincode *"
                  type="text"
                  placeholder="641024"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-sand-200">
                <div className="w-8 h-8 rounded-full bg-espresso-950 text-gold-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h3 className="font-sans text-xl font-bold text-espresso-950">
                  Payment Method
                </h3>
              </div>

              <div className="space-y-3">
                {/* Mode 1: UPI / Online Simulation */}
                <label
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'UPI / Online'
                      ? 'bg-gold-50/60 border-gold-500 ring-1 ring-gold-500/20'
                      : 'bg-sand-50/60 border-sand-300 hover:bg-sand-100/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'UPI / Online'}
                    onChange={() => setPaymentMethod('UPI / Online')}
                    className="mt-1 accent-gold-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-espresso-950 flex items-center gap-1.5 font-sans">
                        <QrCode className="w-4 h-4 text-gold-700" /> Instant UPI / GPay / PhonePe / QR
                      </span>
                      <span className="text-[10px] bg-gold-200/80 text-gold-900 font-bold px-2 py-0.5 rounded-full font-sans">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-600 mt-1 font-sans">
                      Direct scan and pay with any UPI App. Zero transaction fees.
                    </p>
                  </div>
                </label>

                {/* Mode 2: COD */}
                <label
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-gold-50/60 border-gold-500 ring-1 ring-gold-500/20'
                      : 'bg-sand-50/60 border-sand-300 hover:bg-sand-100/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="mt-1 accent-gold-600"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-xs text-espresso-950 flex items-center gap-1.5 font-sans">
                      <CreditCard className="w-4 h-4 text-gold-700" /> Cash on Delivery (COD)
                    </span>
                    <p className="text-[11px] text-charcoal-600 mt-1 font-sans">
                      Pay cash or UPI directly to the courier executive upon receipt.
                    </p>
                  </div>
                </label>

                {/* Mode 3: WhatsApp Verification */}
                <label
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                    paymentMethod === 'Direct WhatsApp Order'
                      ? 'bg-gold-50/60 border-gold-500 ring-1 ring-gold-500/20'
                      : 'bg-sand-50/60 border-sand-300 hover:bg-sand-100/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Direct WhatsApp Order'}
                    onChange={() => setPaymentMethod('Direct WhatsApp Order')}
                    className="mt-1 accent-gold-600"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-xs text-espresso-950 flex items-center gap-1.5 font-sans">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" /> Direct WhatsApp Verification
                    </span>
                    <p className="text-[11px] text-charcoal-600 mt-1 font-sans">
                      Our Sundarapuram team will message your WhatsApp immediately to verify order details.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 font-sans">
            <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-sans text-xl font-bold text-espresso-950 pb-4 border-b border-sand-200">
                Order Review ({cart.length} items)
              </h3>

              {/* Items Thumbnail List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedWeight}`}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-sand-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-espresso-950 truncate font-sans">{item.product.name}</p>
                        <p className="text-[10px] text-charcoal-500 font-sans">
                          {item.quantity}x {item.selectedWeight}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-espresso-950 shrink-0 font-sans">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-sand-200" />

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-charcoal-700 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-espresso-950">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-gold-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tamil Nadu Delivery</span>
                  <span className="font-bold text-gold-700">FREE (₹0)</span>
                </div>

                <div className="flex justify-between text-base font-sans font-bold text-espresso-950 pt-2 border-t border-sand-200">
                  <span>Grand Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full shadow-lg"
                isLoading={isProcessing}
              >
                Place Order Now (₹{total})
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-gold-600" />
                <span>SSL Encrypted Checkout • No Card Data Stored</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
