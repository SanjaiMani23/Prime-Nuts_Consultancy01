import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import {
  CheckCircle2,
  Package,
  Truck,
  Check,
  Clock,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Printer,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Trigger joyful celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C29329', '#231610', '#D5B77B', '#A75D28'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }

    if (orderId) {
      api.getOrderById(orderId)
        .then((res) => {
          if (res.order) setOrder(res.order);
        })
        .catch(() => {});
    }
  }, [orderId]);

  const timelineSteps: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    { status: 'Placed', label: 'Order Placed', icon: Clock, desc: 'Order received & verified' },
    { status: 'Confirmed', label: 'Confirmed', icon: Check, desc: 'Quality verification passed' },
    { status: 'Packed', label: 'Vacuum Packed', icon: Package, desc: 'Airtight sealed with love' },
    { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, desc: 'On express route to your home' },
    { status: 'Delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Enjoy fresh goodness!' },
  ];

  const currentStatus = order?.orderStatus || 'Placed';
  const currentStepIndex = timelineSteps.findIndex((s) => s.status === currentStatus);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-ivory-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Success Banner Card */}
        <div className="bg-white rounded-3xl border border-sand-300 p-8 sm:p-12 text-center shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-gold-100 border-2 border-gold-400 text-gold-700 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block">
            Order Confirmed • The Prime Nuts
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950">
            நன்றி! Thank you for your order.
          </h1>

          <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
            Your order <strong className="text-espresso-950 font-bold">{orderId || 'TPN-2026-XXXX'}</strong> is placed. We are handpicking and vacuum-sealing your nuts for express delivery across Tamil Nadu.
          </p>

          {/* WhatsApp Update Link */}
          <div className="pt-2">
            <a
              href={`https://wa.me/919994627970?text=${encodeURIComponent(`Vanakkam! I would like to check status of my order ${orderId || ''}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Track Order Updates on WhatsApp (+91 99946 27970)</span>
            </a>
          </div>
        </div>

        {/* Animated Order Status Timeline (#21) */}
        <div className="bg-white rounded-3xl border border-sand-300 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sand-200 font-sans">
            <div>
              <h2 className="font-sans text-xl font-bold text-espresso-950">Live Order Milestone Tracker</h2>
              <p className="text-xs text-charcoal-500">Real-time status updates from our Coimbatore packing facility</p>
            </div>
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-espresso-950 bg-sand-100 px-3 py-1.5 rounded-xl border border-sand-300"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>
          </div>

          {/* 5-Step Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {timelineSteps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx <= (currentStepIndex !== -1 ? currentStepIndex : 0);
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.status}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                    isPast
                      ? 'bg-espresso-950 text-ivory-50 border-gold-500 shadow-md'
                      : 'bg-sand-50/70 text-charcoal-400 border-sand-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isPast ? 'bg-gold-500 text-espresso-950 font-bold' : 'bg-sand-200 text-charcoal-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isPast ? 'text-gold-300' : 'text-charcoal-600'}`}>
                      {step.label}
                    </h4>
                    <p className={`text-[10px] mt-0.5 leading-tight ${isPast ? 'text-sand-300' : 'text-charcoal-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bottom Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <Link to="/">
            <Button variant="secondary" size="md">
              Return to Home
            </Button>
          </Link>

          <Link to="/shop">
            <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};
