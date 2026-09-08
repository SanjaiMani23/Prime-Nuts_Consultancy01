import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedWeight, setSelectedWeight] = useState<string>(
    product.defaultWeight || product.variants[0]?.weight || '500g'
  );

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const cardRef = useRef<HTMLDivElement>(null);

  const activeVariant =
    product.variants.find((v) => v.weight === selectedWeight) || product.variants[0];

  const currentPrice = activeVariant ? activeVariant.price : 0;
  const originalPrice = activeVariant?.originalPrice;
  const savings = originalPrice && originalPrice > currentPrice ? originalPrice - currentPrice : 0;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeight, 1, cardRef.current);
  };

  // WhatsApp 1-click Order Link for single product
  const getWhatsAppProductLink = () => {
    const text = `Vanakkam! I would like to order *${product.name}* (${selectedWeight}) priced at *₹${currentPrice}* from The Prime Nuts, Coimbatore. Please confirm availability!`;
    return `https://wa.me/919994627970?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      ref={cardRef}
      className="group bg-[#FFFCF6] rounded-2xl border border-[#D8A15D]/60 hover:border-[#F28C00] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-[#FEEDD3]/30">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badges && product.badges.length > 0 ? (
            product.badges.map((badge) => {
              return (
                <span
                  key={badge}
                  className="bg-[#2B160D]/90 text-[#FEEDD3] border border-[#F28C00]/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm"
                >
                  {badge}
                </span>
              );
            })
          ) : (
            <span className="bg-[#FFF7E8] text-[#2B160D] border border-[#D8A15D] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id, product.name);
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-[#F28C00] text-[#2B160D] shadow-md'
              : 'bg-[#FFFCF6]/90 text-[#2B160D] hover:text-[#D96500] hover:bg-[#FFFCF6] border border-[#D8A15D]/50 shadow-sm'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#2B160D]' : ''}`} />
        </button>

        {/* Savings Ribbon */}
        {savings > 0 && (
          <div className="absolute bottom-3 left-3 bg-[#2B160D]/90 text-[#F28C00] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#F28C00]/40 backdrop-blur-sm">
            Save ₹{savings}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center justify-between mb-1.5">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
            <span className="text-[11px] font-medium font-sans text-[#7F6253] uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-sans text-base font-semibold text-[#2B160D] hover:text-[#D96500] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Tamil Name */}
          {product.tamilName && (
            <p className="text-xs text-[#B34E00] font-serif font-medium line-clamp-1 mt-0.5">
              {product.tamilName}
            </p>
          )}

          {/* Short Description */}
          <p className="text-xs text-[#634739] font-sans font-normal line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div>
          {/* Weight Variant Pills */}
          <div className="pt-2 border-t border-[#F5E5C9]">
            <span className="text-[10px] uppercase font-medium font-sans text-[#7F6253] block mb-1.5">
              Select Weight:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant) => {
                const isSelected = variant.weight === selectedWeight;
                return (
                  <button
                    key={variant.weight}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedWeight(variant.weight);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-sans font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#2B160D] text-[#FEEDD3] border border-[#F28C00] shadow-sm'
                        : 'bg-[#FFF7E8] text-[#2B160D] hover:bg-[#FEEDD3] border border-[#D8A15D]/60'
                    }`}
                  >
                    {variant.weight}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Add to Cart Row */}
          <div className="mt-4 pt-3 border-t border-[#F5E5C9] flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans text-lg font-bold text-[#D96500]">
                  ₹{currentPrice}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-xs text-[#7F6253] font-sans line-through">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#B34E00] font-sans font-semibold block">
                Free TN Delivery
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* WhatsApp Single Order */}
              <a
                href={getWhatsAppProductLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center border border-[#25D366]/30 transition-colors shadow-sm"
                title="Order directly on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              {/* Add to Bag Button: Saffron Orange bg with Dark Chocolate text */}
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 bg-[#F28C00] hover:bg-[#D96500] text-[#2B160D] hover:text-[#FFFCF6] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 group/btn"
                aria-label={`Add ${product.name} to Bag`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#2B160D] group-hover/btn:text-[#FFFCF6]" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
