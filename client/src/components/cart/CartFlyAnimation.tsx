import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

export const CartFlyAnimation: React.FC = () => {
  const { flyingItem, clearFlyingItem } = useCart();

  useEffect(() => {
    if (flyingItem) {
      const timer = setTimeout(() => {
        clearFlyingItem();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [flyingItem, clearFlyingItem]);

  if (!flyingItem) return null;

  const targetX = window.innerWidth - 70; // Top right cart location
  const targetY = 30;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          position: 'fixed',
          left: flyingItem.startX,
          top: flyingItem.startY,
          x: '-50%',
          y: '-50%',
          scale: 1,
          opacity: 1,
          zIndex: 9999,
        }}
        animate={{
          left: targetX,
          top: targetY,
          scale: 0.2,
          opacity: 0.8,
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1], // Luxury cubic-bezier curve
        }}
        className="pointer-events-none w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400 shadow-2xl bg-espresso-950 flex items-center justify-center"
      >
        <img
          src={flyingItem.image}
          alt="Adding to Bag"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </AnimatePresence>
  );
};
