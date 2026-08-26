import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { RatingStars } from '../components/common/RatingStars';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ProductCard } from '../components/product/ProductCard';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Check,
  Star,
  Layers,
  Flame,
  Zap,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'reviews'>('overview');

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('Coimbatore');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    setLoading(true);
    // Fetch live from server
    api.getProductBySlug(slug)
      .then((res) => {
        if (res.product) {
          setProduct(res.product);
          setSelectedImage(res.product.images[0]);
          setSelectedWeight(res.product.defaultWeight || res.product.variants[0]?.weight || '500g');
          setRelated(res.related || []);
          setQuantity(1);

          // Fetch Reviews for this product
          api.getReviews(res.product.id)
            .then((rRes) => {
              if (rRes.reviews) setReviewsList(rRes.reviews);
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error('Failed to load product detail from API:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-ivory-50 text-center p-8">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-espresso-950">Product Not Found</h2>
          <p className="text-xs text-charcoal-600">The requested dry fruit or combo is not available.</p>
          <Link to="/shop">
            <Button variant="gold" size="md">Return to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeVariant =
    product.variants.find((v) => v.weight === selectedWeight) || product.variants[0];
  const price = activeVariant ? activeVariant.price : 0;
  const originalPrice = activeVariant?.originalPrice;
  const savings = originalPrice && originalPrice > price ? (originalPrice - price) * quantity : 0;
  const isWishlisted = isInWishlist(product.id);

  // Unit Price Calculation (e.g., ₹/100g)
  let unitPriceText = '';
  if (selectedWeight.includes('g') && !selectedWeight.includes('kg')) {
    const g = parseInt(selectedWeight, 10);
    if (!isNaN(g) && g > 0) {
      const per100g = Math.round((price / g) * 100);
      unitPriceText = `(₹${per100g} / 100g)`;
    }
  } else if (selectedWeight.includes('1kg')) {
    const per100g = Math.round(price / 10);
    unitPriceText = `(₹${per100g} / 100g)`;
  }

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity, imageRef.current);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, quantity);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const text = `Vanakkam! I would like to order *${product.name}*\n⚖️ Weight: ${selectedWeight}\n📦 Quantity: ${quantity}\n💰 Total Amount: ₹${price * quantity}\n\nPlease confirm availability and payment options. Thank you!`;
    window.open(`https://wa.me/919994627970?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      toast.error('Missing Details', 'Please fill in your name and review.');
      return;
    }

    try {
      await api.addReview({
        productId: product.id,
        userName: reviewName,
        userCity: reviewCity,
        rating: reviewRating,
        comment: reviewComment,
      });

      const newRev: Review = {
        id: `rev-${Date.now()}`,
        productId: product.id,
        userName: reviewName,
        userCity: reviewCity,
        rating: reviewRating,
        comment: reviewComment,
        verifiedPurchase: true,
        createdAt: new Date().toISOString(),
      };

      setReviewsList([newRev, ...reviewsList]);
      toast.gold('Review Submitted! ⭐', 'Thank you for sharing your feedback.');
      setIsReviewModalOpen(false);
      setReviewComment('');
    } catch {
      toast.error('Submission Failed', 'Could not post review. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-ivory-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-charcoal-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-gold-700">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold-700">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-gold-700">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-espresso-950 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero: Gallery & Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 bg-white rounded-3xl border border-sand-300 p-6 sm:p-10 shadow-sm">
          {/* Left: Gallery & Zoom Preview (6 Cols) */}
          <div className="lg:col-span-6 space-y-4" ref={imageRef}>
            {/* Main Featured Photo */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand-100/60 border border-sand-200 shadow-inner group">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badges?.map((badge) => (
                  <Badge key={badge} variant={badge === 'Combo Offer' ? 'festival' : 'espresso'} size="sm">
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id, product.name)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-ivory-50/90 text-charcoal-700 hover:text-amber-700 hover:bg-white shadow-sm'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img
                        ? 'border-gold-500 shadow-md ring-2 ring-gold-500/20'
                        : 'border-sand-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Buy Controls, Variants, Pricing (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
                  {product.category}
                </span>
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
              </div>

              {/* Product Title & Tamil Subtitle */}
              <div>
                <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-espresso-950 leading-tight">
                  {product.name}
                </h1>
                {product.tamilName && (
                  <p className="text-sm font-serif font-medium text-gold-800 mt-1">
                    {product.tamilName}
                  </p>
                )}
              </div>

              {/* Tamil Marketing Quote Banner */}
              {product.quote && (
                <div className="bg-sand-100/90 border border-sand-300/80 p-3.5 rounded-2xl text-xs text-gold-900 font-serif leading-relaxed">
                  {product.quote}
                </div>
              )}

              {/* Price Row */}
              <div className="pt-2">
                <div className="flex items-baseline gap-3 font-sans">
                  <span className="text-3xl sm:text-4xl font-bold text-espresso-950">
                    ₹{price * quantity}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-base text-charcoal-400 line-through">
                      ₹{originalPrice * quantity}
                    </span>
                  )}
                  {unitPriceText && (
                    <span className="text-xs text-charcoal-500 font-medium">
                      {unitPriceText}
                    </span>
                  )}
                </div>

                {savings > 0 && (
                  <p className="text-xs text-amber-800 font-bold mt-1">
                    ✨ You save ₹{savings} ({Math.round(((originalPrice! - price) / originalPrice!) * 100)}% OFF)
                  </p>
                )}
              </div>

              {/* Weight Variant Selector */}
              <div className="space-y-2 pt-2 border-t border-sand-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Select Weight:
                  </label>
                  <span className="text-xs text-gold-700 font-semibold">
                    {activeVariant?.stock && activeVariant.stock > 0 ? (
                      `In Stock (${activeVariant.stock} packs)`
                    ) : (
                      'In Stock'
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = v.weight === selectedWeight;
                    return (
                      <button
                        key={v.weight}
                        type="button"
                        onClick={() => setSelectedWeight(v.weight)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-espresso-950 text-ivory-50 border-gold-500 shadow-md ring-1 ring-gold-500/30'
                            : 'bg-sand-50 text-charcoal-800 hover:bg-sand-100 border-sand-300'
                        }`}
                      >
                        <span className="block text-xs font-bold">{v.weight}</span>
                        <span className="block text-xs text-gold-400 font-semibold mt-0.5">
                          ₹{v.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-sand-300 rounded-xl bg-sand-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-sand-200 rounded-lg text-charcoal-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-espresso-950 select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-sand-200 rounded-lg text-charcoal-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-charcoal-500 font-medium">
                    Total Weight: {quantity * (parseInt(selectedWeight) || 1)}{selectedWeight.includes('kg') ? 'kg' : 'g'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, WhatsApp */}
            <div className="space-y-3 pt-6 border-t border-sand-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<ShoppingBag className="w-4 h-4 text-gold-400" />}
                  onClick={handleAddToCart}
                  className="w-full shadow-md"
                >
                  Add to Bag
                </Button>

                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleBuyNow}
                  className="w-full shadow-md"
                >
                  Buy Now
                </Button>
              </div>

              {/* WhatsApp Direct Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order on WhatsApp (+91 99946 27970)</span>
              </button>

              {/* Delivery & Quality Guarantees */}
              <div className="grid grid-cols-3 gap-2 text-center pt-3 text-[11px] text-charcoal-700">
                <div className="p-2 bg-sand-50 rounded-xl border border-sand-200">
                  <Truck className="w-4 h-4 mx-auto text-gold-600 mb-1" />
                  <span className="font-semibold">Free Delivery Across TN</span>
                </div>
                <div className="p-2 bg-sand-50 rounded-xl border border-sand-200">
                  <ShieldCheck className="w-4 h-4 mx-auto text-gold-600 mb-1" />
                  <span className="font-semibold">100% Pure & Fresh</span>
                </div>
                <div className="p-2 bg-sand-50 rounded-xl border border-sand-200">
                  <Sparkles className="w-4 h-4 mx-auto text-gold-600 mb-1" />
                  <span className="font-semibold">Airtight Sealed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Details: Overview & Reviews */}
        <div className="mt-12 bg-white rounded-3xl border border-sand-300 overflow-hidden shadow-sm">
          {/* Tab Navigation */}
          <div className="flex border-b border-sand-200 bg-sand-50/80">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === 'overview'
                  ? 'border-gold-600 text-espresso-950 bg-white'
                  : 'border-transparent text-charcoal-600 hover:text-espresso-950'
              }`}
            >
              Product Details & Sourcing
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-gold-600 text-espresso-950 bg-white'
                  : 'border-transparent text-charcoal-600 hover:text-espresso-950'
              }`}
            >
              Customer Reviews ({reviewsList.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-10">
            {activeTab === 'overview' && (
              <div className="space-y-6 text-sm text-charcoal-700 leading-relaxed max-w-4xl font-sans">
                <div>
                  <h3 className="font-sans text-xl font-bold text-espresso-950 mb-2">About this Product</h3>
                  <p>{product.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-sand-200">
                  <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-espresso-950">Ingredients</h4>
                    <p className="text-xs text-charcoal-600">
                      {product.ingredients?.join(', ') || '100% Whole Dry Fruits / Nuts'}
                    </p>
                  </div>

                  <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-espresso-950">Storage Instructions</h4>
                    <p className="text-xs text-charcoal-600">
                      {product.storage || 'Store in an airtight container in a cool, dry place.'}
                    </p>
                  </div>

                  <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-espresso-950">Store Location</h4>
                    <p className="text-xs text-charcoal-600">{product.origin || 'Sundarapuram, Coimbatore'}</p>
                  </div>

                  <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-espresso-950">Packaging</h4>
                    <p className="text-xs text-charcoal-600">Carefully sealed for crispness and freshness.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 max-w-4xl font-sans">
                {/* Header & Write Review Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sand-200">
                  <div>
                    <h3 className="font-sans text-xl font-bold text-espresso-950">Customer Reviews</h3>
                    {reviewsList.length > 0 ? (
                      <div className="flex items-center gap-2 mt-1">
                        <RatingStars rating={product.rating} reviewCount={reviewsList.length} size="md" />
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        Verified customer reviews will appear here.
                      </p>
                    )}
                  </div>

                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => setIsReviewModalOpen(true)}
                  >
                    Write a Review
                  </Button>
                </div>

                {/* Reviews List or Empty State */}
                {reviewsList.length > 0 ? (
                  <div className="space-y-4 font-sans">
                    {reviewsList.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-sand-50 p-5 rounded-2xl border border-sand-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-espresso-950">{rev.userName}</span>
                          <RatingStars rating={rev.rating} size="sm" />
                        </div>
                        <p className="text-charcoal-700 leading-relaxed">“{rev.comment}”</p>
                        {rev.userCity && <span className="text-[10px] text-charcoal-500">{rev.userCity}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-3 bg-sand-50/50 rounded-2xl border border-sand-200 p-6 font-sans">
                    <p className="font-sans text-sm font-semibold text-espresso-950">
                      No reviews yet for this product.
                    </p>
                    <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                      Be the first to share your experience with this item from The Prime Nuts!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {related.length > 0 && (
          <div className="mt-16 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold-700">Explore More</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950">
                  Related in {product.category}
                </h3>
              </div>
              <Link to={`/shop?category=${product.category}`} className="text-xs font-bold text-gold-700 hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Share Your Review"
        subtitle={`Reviewing: ${product.name}`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Your Rating:
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-gold-500 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= reviewRating ? 'fill-gold-500 text-gold-500' : 'text-sand-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Your Name:
            </label>
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="e.g. Ramesh K."
              className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              City:
            </label>
            <input
              type="text"
              value={reviewCity}
              onChange={(e) => setReviewCity(e.target.value)}
              placeholder="e.g. Coimbatore, Chennai, Salem"
              className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Your Experience:
            </label>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Tell us about the crunch, freshness, packaging and taste..."
              className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
              required
            />
          </div>

          <Button type="submit" variant="gold" size="md" className="w-full">
            Submit Verified Review
          </Button>
        </form>
      </Modal>
    </main>
  );
};
