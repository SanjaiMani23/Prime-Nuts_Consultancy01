import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedNumber, setSelectedNumber] = useState<'9994627970' | '7538833035'>('9994627970');

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || message || 'Vanakkam! I would like to order fresh nuts and dry fruits from The Prime Nuts.';
    const encoded = encodeURIComponent(textToSend);
    window.open(`https://wa.me/91${selectedNumber}?text=${encoded}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  const quickPrompts = [
    { label: '📦 Order 25-Item Mega Combo', text: 'Vanakkam! I would like to order the 25-Item Royal Grand Feast Family Mega Combo. Please share price & delivery details.' },
    { label: '✨ Inquire About Gift Boxes', text: 'Vanakkam! I would like details about The Prime Nuts Royal Velvet Gift Hamper boxes for an upcoming event.' },
    { label: '🚚 Tamil Nadu Free Shipping', text: 'Vanakkam! I would like to order dry fruits for delivery in Tamil Nadu.' },
  ];

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-5 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3 w-80 sm:w-96 bg-ivory-50 rounded-2xl shadow-2xl border border-sand-300 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-espresso-950 text-ivory-50 p-4 flex items-center justify-between border-b border-gold-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-ivory-50">The Prime Nuts Desk</h4>
                  <p className="text-[10px] text-gold-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                    Sundarapuram, Coimbatore • Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-sand-400 hover:text-white hover:bg-espresso-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 bg-sand-50/70 text-xs">
              {/* Number Switcher */}
              <div className="bg-ivory-50 p-2.5 rounded-xl border border-sand-200">
                <p className="text-[11px] font-semibold text-charcoal-700 mb-1.5 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-gold-600" />
                  Select Store Order Hotline:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedNumber('9994627970')}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
                      selectedNumber === '9994627970'
                        ? 'bg-espresso-900 text-gold-300 font-bold shadow-sm'
                        : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
                    }`}
                  >
                    +91 99946 27970
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedNumber('7538833035')}
                    className={`py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
                      selectedNumber === '7538833035'
                        ? 'bg-espresso-900 text-gold-300 font-bold shadow-sm'
                        : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
                    }`}
                  >
                    +91 75388 33035
                  </button>
                </div>
              </div>

              {/* Chat Bubble Message */}
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-sand-200 shadow-sm text-charcoal-800 leading-relaxed">
                <p className="font-semibold text-espresso-950 text-xs mb-1">வணக்கம்! 🙏</p>
                <p>Welcome to The Prime Nuts! How can we assist with your order, combo deals, or customized festive gift hampers today?</p>
              </div>

              {/* Quick Prompts */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider">Quick Inquiries:</p>
                {quickPrompts.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q.text)}
                    className="w-full text-left bg-ivory-50 hover:bg-gold-50 border border-sand-300/80 hover:border-gold-400 p-2 rounded-xl text-charcoal-800 transition-colors flex items-center justify-between text-xs"
                  >
                    <span>{q.label}</span>
                    <Sparkles className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-white border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2 rounded-xl shadow transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 border-2 border-white transition-all relative group"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></span>
      </motion.button>
    </div>
  );
};
