import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { useToast } from './ToastContext';

export interface FlyingItemData {
  startX: number;
  startY: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedWeight?: string, quantity?: number, sourceElement?: HTMLElement | null) => void;
  updateQuantity: (productId: string, weight: string, delta: number) => void;
  updateWeight: (productId: string, oldWeight: string, newWeight: string) => void;
  removeFromCart: (productId: string, weight: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  total: number;
  totalSavings: number;
  flyingItem: FlyingItemData | null;
  clearFlyingItem: () => void;
  generateWhatsAppOrderUrl: (customerAddress?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tpn_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [flyingItem, setFlyingItem] = useState<FlyingItemData | null>(null);
  const toast = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('tpn_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to local storage:', e);
    }
  }, [cart]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const clearFlyingItem = () => setFlyingItem(null);

  const addToCart = (
    product: Product,
    selectedWeight?: string,
    quantity = 1,
    sourceElement?: HTMLElement | null
  ) => {
    const weight = selectedWeight || product.defaultWeight || product.variants[0]?.weight || '500g';
    const variant = product.variants.find((v) => v.weight === weight) || product.variants[0];
    const price = variant ? variant.price : 0;
    const originalPrice = variant ? variant.originalPrice : undefined;

    // Trigger flying animation if element coordinates provided
    if (sourceElement) {
      const rect = sourceElement.getBoundingClientRect();
      setFlyingItem({
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        image: product.images[0] || '',
      });
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === weight
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            selectedWeight: weight,
            price,
            originalPrice,
            quantity,
          },
        ];
      }
    });

    toast.gold(`Added to Cart: ${product.name}`, `${quantity}x (${weight}) — ₹${price * quantity}`);

    // Open animated cart drawer smoothly
    setTimeout(() => {
      setIsDrawerOpen(true);
    }, 280);
  };

  const updateQuantity = (productId: string, weight: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedWeight === weight) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const updateWeight = (productId: string, oldWeight: string, newWeight: string) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId && item.selectedWeight === oldWeight) {
          const variant = item.product.variants.find((v) => v.weight === newWeight);
          if (variant) {
            return {
              ...item,
              selectedWeight: newWeight,
              price: variant.price,
              originalPrice: variant.originalPrice,
            };
          }
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string, weight: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedWeight === weight))
    );
    toast.info('Item Removed', 'Item has been removed from your shopping bag.');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'WELCOME100') {
      if (subtotal < 999) {
        toast.error('Coupon Condition', 'WELCOME100 requires minimum cart subtotal of ₹999.');
        return false;
      }
      setAppliedCoupon('WELCOME100');
      toast.gold('Coupon Applied!', '₹100 discount applied to your order.');
      return true;
    } else if (cleanCode === 'COMBO15') {
      setAppliedCoupon('COMBO15');
      toast.gold('Coupon Applied!', '15% Combo special discount applied.');
      return true;
    } else if (cleanCode === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      toast.gold('Free Shipping!', 'Free Tamil Nadu express shipping activated.');
      return true;
    } else {
      toast.error('Invalid Coupon', 'The promo code entered is either expired or invalid.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon Removed');
  };

  // Calculations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalMRP = cart.reduce((sum, item) => {
    const orig = item.originalPrice || item.price;
    return sum + orig * item.quantity;
  }, 0);

  const productSavings = Math.max(0, totalMRP - subtotal);

  // Delivery: Free delivery across Tamil Nadu!
  const deliveryFee = 0;

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon === 'WELCOME100') {
    couponDiscount = 100;
  } else if (appliedCoupon === 'COMBO15') {
    couponDiscount = Math.round(subtotal * 0.15);
  }

  const discount = couponDiscount;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const totalSavings = productSavings + discount;

  // WhatsApp Order Text Generator
  const generateWhatsAppOrderUrl = (customerAddress?: string): string => {
    const storeWhatsApp = '919994627970'; // Primary WhatsApp number
    let text = `✨ *THE PRIME NUTS — ORDER INQUIRY*\n`;
    text += `📍 *Sundarapuram, Coimbatore, Tamil Nadu*\n\n`;
    text += `வணக்கம்! I would like to place an order for the following items:\n\n`;

    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.name}*\n`;
      text += `   ⚖️ Weight: ${item.selectedWeight}\n`;
      text += `   📦 Qty: ${item.quantity}\n`;
      text += `   💰 Price: ₹${item.price * item.quantity}\n\n`;
    });

    text += `──────────────────────\n`;
    text += `*Subtotal:* ₹${subtotal}\n`;
    if (discount > 0) text += `*Discount:* -₹${discount} (${appliedCoupon})\n`;
    text += `*Tamil Nadu Delivery:* FREE (₹0)\n`;
    text += `*Total Payable:* *₹${total}*\n`;
    text += `──────────────────────\n\n`;

    if (customerAddress) {
      text += `🚚 *Delivery Address:*\n${customerAddress}\n\n`;
    }

    text += `Please confirm my order and share payment details. Thank you!`;

    return `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        updateWeight,
        removeFromCart,
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        totalItemsCount,
        subtotal,
        deliveryFee,
        discount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
        totalSavings,
        flyingItem,
        clearFlyingItem,
        generateWhatsAppOrderUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
