import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Store, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-ivory-50 py-16 px-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-10 rounded-3xl border border-sand-300 shadow-sm">
        <span className="font-display text-5xl font-extrabold text-gold-600">404</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950">
          Page Not Found
        </h1>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          The dry fruits page you are looking for might have been moved or does not exist.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="gold" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};
