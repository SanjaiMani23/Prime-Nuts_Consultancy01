import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { AnimatedCartDrawer } from './components/cart/AnimatedCartDrawer';
import { CartFlyAnimation } from './components/cart/CartFlyAnimation';
import { SplitScreenAuthModal } from './components/auth/SplitScreenAuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CombosPage } from './pages/CombosPage';
import { StorePage } from './pages/StorePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-[#FFF7E8] text-[#2B160D] selection:bg-[#F28C00] selection:text-[#2B160D]">
                {/* Sticky Navbar */}
                <Navbar />

                {/* Main Content Router */}
                <div className="flex-1">
                  <Routes>
                    {/* Public Storefront Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:slug" element={<ProductDetailPage />} />
                    <Route path="/combos" element={<CombosPage />} />
                    <Route path="/store" element={<StorePage />} />
                    <Route path="/store-visit" element={<Navigate to="/store" replace />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ForgotPasswordPage />} />

                    {/* Customer Protected Routes */}
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute requiredRole="customer">
                          <AccountPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/wishlist" element={<Navigate to="/account?tab=wishlist" replace />} />
                    <Route path="/orders" element={<Navigate to="/account?tab=orders" replace />} />

                    {/* Admin Protected Routes */}
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>

                {/* Global Footer */}
                <Footer />

                {/* Mobile Navigation Sticky Bottom Bar */}
                <MobileNav />

                {/* Floating WhatsApp Quick Action */}
                <FloatingWhatsApp />

                {/* Animated Slide-Over Cart Drawer */}
                <AnimatedCartDrawer />

                {/* Flying Add-to-Cart Animation */}
                <CartFlyAnimation />

                {/* Split-Screen Luxury Auth Modal */}
                <SplitScreenAuthModal />
              </div>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
