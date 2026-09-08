import React, { useEffect, useState } from 'react';
import { RatingStars } from '../common/RatingStars';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';
import { Review } from '../../types';

export const CustomerReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch any verified database reviews
    api.getProducts()
      .then(async (res) => {
        // If there are products, check for any verified reviews
        if (res.products && res.products.length > 0) {
          const allReviews: Review[] = [];
          for (const p of res.products.slice(0, 5)) {
            try {
              const rRes = await api.getReviews(p.id);
              if (rRes.reviews && rRes.reviews.length > 0) {
                allReviews.push(...rRes.reviews);
              }
            } catch {
              // Ignore
            }
          }
          setReviews(allReviews);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 md:py-16 bg-ivory-50 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold font-sans uppercase tracking-widest text-gold-700 block">
            Customer Feedback
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950">
            Customer Reviews
          </h2>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-6 border border-sand-300 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3 font-sans">
                  <RatingStars rating={rev.rating} size="sm" />
                  <p className="text-xs text-charcoal-700 leading-relaxed">
                    “{rev.comment}”
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-sand-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-semibold text-espresso-950">{rev.userName}</h4>
                    {rev.userCity && <p className="text-[10px] text-charcoal-500 font-sans">{rev.userCity}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-sand-300 text-center max-w-xl mx-auto shadow-sm space-y-4 font-sans">
            <div className="w-12 h-12 rounded-full bg-sand-100 text-gold-700 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="font-sans text-base font-semibold text-espresso-950">
                Verified customer reviews will appear here.
              </p>
              <p className="text-xs text-charcoal-500 font-sans mt-1 max-w-sm mx-auto leading-relaxed">
                Have you shopped with The Prime Nuts in Sundarapuram or online? We welcome your authentic feedback!
              </p>
            </div>
            <div>
              <a
                href={`https://wa.me/919994627970?text=${encodeURIComponent('Vanakkam! I would like to share feedback on my order from The Prime Nuts.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share Feedback on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
