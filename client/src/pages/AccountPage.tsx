import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Product, Order } from '../types';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { LuxuryInput } from '../components/common/LuxuryInput';
import { ProductCard } from '../components/product/ProductCard';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  LogOut,
  Shield,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, isAdmin, logout, updateUser, openAuthModal, changePassword } = useAuth();
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const tab = searchParams.get('tab');
    if (tab === 'wishlist') setActiveTab('wishlist');
    else if (tab === 'profile') setActiveTab('profile');
    else if (tab === 'addresses') setActiveTab('addresses');
    else setActiveTab('orders');

    if (isAuthenticated) {
      api.getMyOrders()
        .then((res) => {
          if (res.orders) setOrders(res.orders);
        })
        .catch(() => {});
    }

    // Filter Wishlist Products from API
    api.getProducts()
      .then((res) => {
        if (res.products) {
          const wProducts = res.products.filter((p) => wishlist.includes(p.id));
          setWishlistProducts(wProducts);
        }
      })
      .catch((err) => {
        console.error('Failed to load products for wishlist:', err);
      });
  }, [searchParams, isAuthenticated, wishlist]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-ivory-50 py-16 px-4">
        <div className="max-w-md w-full text-center space-y-5 bg-white p-10 rounded-3xl border border-sand-300 shadow-sm flex flex-col items-center">
          <BrandLogo size="md" isLink={false} />
          <h1 className="font-serif text-2xl font-bold text-espresso-950">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Track active shipments across Tamil Nadu, view past orders, and manage saved delivery addresses.
          </p>
          <Button variant="gold" size="lg" onClick={() => openAuthModal('login')} className="w-full">
            Sign In / Register
          </Button>
        </div>
      </main>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ name: editName, phone: editPhone });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  return (
    <main className="min-h-screen bg-ivory-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-sand-300">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-0.5">
              வணக்கம், {user?.name}!
            </h1>
            <p className="text-xs text-charcoal-600">{user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" leftIcon={<Shield className="w-4 h-4 text-gold-700" />}>
                  Admin Panel
                </Button>
              </Link>
            )}
            <Button variant="secondary" size="sm" leftIcon={<LogOut className="w-4 h-4 text-spice-600" />} onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tabs (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-sand-300 p-3 shadow-sm space-y-1">
            <button
              onClick={() => {
                setActiveTab('orders');
                setSearchParams({ tab: 'orders' });
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-espresso-950 text-gold-300 shadow'
                  : 'text-charcoal-700 hover:bg-sand-100 hover:text-espresso-950'
              }`}
            >
              <Package className="w-4 h-4 text-gold-500" />
              <span>My Orders & Tracking ({orders.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('wishlist');
                setSearchParams({ tab: 'wishlist' });
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-espresso-950 text-gold-300 shadow'
                  : 'text-charcoal-700 hover:bg-sand-100 hover:text-espresso-950'
              }`}
            >
              <Heart className="w-4 h-4 text-gold-500" />
              <span>My Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('addresses');
                setSearchParams({ tab: 'addresses' });
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-espresso-950 text-gold-300 shadow'
                  : 'text-charcoal-700 hover:bg-sand-100 hover:text-espresso-950'
              }`}
            >
              <MapPin className="w-4 h-4 text-gold-500" />
              <span>Saved Addresses ({user?.addresses.length || 0})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setSearchParams({ tab: 'profile' });
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-espresso-950 text-gold-300 shadow'
                  : 'text-charcoal-700 hover:bg-sand-100 hover:text-espresso-950'
              }`}
            >
              <UserIcon className="w-4 h-4 text-gold-500" />
              <span>Profile Settings</span>
            </button>
          </div>

          {/* Main Tab Content Area (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6 font-sans">
                <h2 className="font-sans text-2xl font-bold text-espresso-950">
                  Your Order History
                </h2>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-sand-300 p-10 text-center space-y-4">
                    <Package className="w-12 h-12 mx-auto text-charcoal-400" />
                    <h3 className="font-sans text-xl font-bold text-espresso-950">No orders placed yet</h3>
                    <p className="text-xs text-charcoal-600">Discover our healthy dry fruits and combo boxes today!</p>
                    <Link to="/shop">
                      <Button variant="gold" size="sm">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-6"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sand-200">
                        <div>
                          <span className="font-sans text-lg font-bold text-espresso-950">
                            Order #{ord.orderNumber}
                          </span>
                          <p className="text-xs text-charcoal-500 mt-0.5 font-sans">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 font-sans">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-espresso-950 text-gold-300 border border-gold-500/30">
                            {ord.orderStatus}
                          </span>
                          <span className="font-sans text-lg font-bold text-espresso-950">
                            ₹{ord.total}
                          </span>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="space-y-3 font-sans">
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-12 h-12 rounded-xl object-cover border border-sand-200 shrink-0"
                              />
                              <div>
                                <p className="font-semibold text-espresso-950 font-sans">{item.productName}</p>
                                <p className="text-[11px] text-charcoal-500 font-sans">
                                  {item.quantity}x {item.weight}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-espresso-950 font-sans">₹{item.total}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Timeline Steps */}
                      <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 text-xs space-y-2 font-sans">
                        <p className="font-bold text-espresso-950 uppercase tracking-wider text-[11px]">
                          Order Milestone Activity:
                        </p>
                        {ord.timeline.map((t, idx) => (
                          <div key={idx} className="flex items-center justify-between text-charcoal-700">
                            <span className="flex items-center gap-1.5 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" />
                              {t.status} — {t.note}
                            </span>
                            <span className="text-[10px] text-charcoal-500">
                              {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 font-sans">
                <h2 className="font-sans text-2xl font-bold text-espresso-950">
                  Saved Wishlist ({wishlistProducts.length} items)
                </h2>

                {wishlistProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-sand-300 p-10 text-center space-y-4">
                    <Heart className="w-12 h-12 mx-auto text-charcoal-400" />
                    <h3 className="font-sans text-xl font-bold text-espresso-950">Your wishlist is empty</h3>
                    <p className="text-xs text-charcoal-600">Save items while browsing to purchase them easily later.</p>
                    <Link to="/shop">
                      <Button variant="gold" size="sm">Explore Catalog</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wishlistProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 font-sans">
                <h2 className="font-sans text-2xl font-bold text-espresso-950">
                  Saved Delivery Addresses
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {user?.addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border border-sand-300 p-6 shadow-sm space-y-2 relative"
                    >
                      {addr.isDefault && (
                        <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold-300 uppercase">
                          Default Address
                        </span>
                      )}
                      <h4 className="font-bold text-sm text-espresso-950">{addr.fullName}</h4>
                      <p className="text-xs text-charcoal-600 leading-relaxed">
                        {addr.street}
                        {addr.landmark && `, Near ${addr.landmark}`}
                        <br />
                        {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                      <p className="text-xs text-charcoal-700 font-semibold pt-1">
                        Phone: {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-sand-300 p-8 shadow-sm space-y-6 max-w-xl font-sans">
                <h2 className="font-sans text-2xl font-bold text-espresso-950">
                  Profile Information
                </h2>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <LuxuryInput
                    label="Full Name"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />

                  <LuxuryInput
                    label="Email Address (Registered)"
                    type="email"
                    value={user?.email}
                    disabled
                  />

                  <LuxuryInput
                    label="Phone Number"
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                  />

                  <Button type="submit" variant="gold" size="md">
                    Save Profile Changes
                  </Button>
                </form>

                {/* Change Password Section */}
                <div className="pt-8 border-t border-sand-300">
                  <h3 className="font-sans text-lg font-bold text-espresso-950 mb-1">
                    Change Security Password
                  </h3>
                  <p className="text-xs text-charcoal-600 mb-4">
                    Ensure your account is using a secure, unique password.
                  </p>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <LuxuryInput
                      label="Current Password"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />

                    <LuxuryInput
                      label="New Password (Min 6 characters)"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />

                    <LuxuryInput
                      label="Confirm New Password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />

                    <Button
                      type="submit"
                      variant="outline"
                      size="md"
                      isLoading={isChangingPassword}
                    >
                      Update Password
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
