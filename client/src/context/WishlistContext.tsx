import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface WishlistContextType {
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string, productName?: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tpn_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toast = useToast();

  // Sync wishlist from user profile when logged in
  useEffect(() => {
    if (user && user.wishlist) {
      setWishlist(user.wishlist);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('tpn_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist]);

  const toggleWishlist = async (productId: string, productName?: string) => {
    const exists = wishlist.includes(productId);
    let newWishlist: string[];
    
    if (exists) {
      toast.info('Removed from Wishlist', productName ? `${productName} removed.` : undefined);
      newWishlist = wishlist.filter((id) => id !== productId);
    } else {
      toast.gold('Added to Wishlist ❤️', productName ? `${productName} saved to your favorites.` : undefined);
      newWishlist = [...wishlist, productId];
    }
    
    setWishlist(newWishlist);
    
    if (isAuthenticated) {
      try {
        await api.updateProfile({ wishlist: newWishlist });
      } catch (err) {
        console.error('Failed to update wishlist on server', err);
      }
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
