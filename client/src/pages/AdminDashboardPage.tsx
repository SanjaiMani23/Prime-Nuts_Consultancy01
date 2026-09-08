import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Product, Order, AdminStats, WeightVariant } from '../types';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LuxuryInput } from '../components/common/LuxuryInput';
import { BrandLogo } from '../components/common/BrandLogo';
import {
  Shield,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  ExternalLink,
  Store,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'offers'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [searchProduct, setSearchProduct] = useState('');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodTamil, setProdTamil] = useState('');
  const [prodCategory, setProdCategory] = useState<'Nuts' | 'Dried Fruits' | 'Seeds' | 'Combos' | 'Gift Packs' | 'Snacks'>('Nuts');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodVariants, setProdVariants] = useState<WeightVariant[]>([
    { weight: '250g', price: 250, originalPrice: 300, stock: 100, sku: 'SKU-250' },
    { weight: '500g', price: 480, originalPrice: 580, stock: 80, sku: 'SKU-500' },
  ]);

  // Order Status Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Packed');
  const [statusNote, setStatusNote] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated || !isAdmin) {
      // Allow viewing or redirect
    }

    loadDashboardData();
  }, [isAuthenticated, isAdmin]);

  const loadDashboardData = () => {
    api.getAdminStats()
      .then((res) => setStats(res.stats))
      .catch(() => {});

    api.getProducts()
      .then((res) => setProducts(res.products))
      .catch(() => {});

    api.getAllOrders()
      .then((res) => setOrders(res.orders))
      .catch(() => {});

    api.getCustomers()
      .then((res) => setCustomers(res.customers))
      .catch(() => {});

    api.getOffers()
      .then((res) => setOffers(res.offers))
      .catch(() => {});
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdTamil('');
    setProdCategory('Nuts');
    setProdShortDesc('');
    setProdDesc('');
    setProdImage('https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?auto=format&fit=crop&w=900&q=80');
    setProdVariants([
      { weight: '250g', price: 250, originalPrice: 300, stock: 100, sku: 'SKU-250' },
      { weight: '500g', price: 480, originalPrice: 580, stock: 80, sku: 'SKU-500' },
      { weight: '1kg', price: 920, originalPrice: 1100, stock: 50, sku: 'SKU-1KG' },
    ]);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdTamil(p.tamilName || '');
    setProdCategory(p.category);
    setProdShortDesc(p.shortDescription);
    setProdDesc(p.description);
    setProdImage(p.images[0] || '');
    setProdVariants(p.variants);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      tamilName: prodTamil,
      category: prodCategory,
      shortDescription: prodShortDesc,
      description: prodDesc,
      images: [prodImage],
      variants: prodVariants,
    };

    try {
      if (editingProductId) {
        await api.updateProduct(editingProductId, payload);
        toast.gold('Product Updated', `Changes to "${prodName}" saved successfully.`);
      } else {
        await api.createProduct(payload);
        toast.gold('Product Added', `"${prodName}" added to active store catalog.`);
      }
      setIsProductModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      toast.error('Operation Failed', err.response?.data?.message || 'Could not save product.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      try {
        await api.deleteProduct(id);
        toast.info('Product Removed', `"${name}" removed from catalog.`);
        loadDashboardData();
      } catch {
        toast.error('Delete Failed', 'Could not delete product.');
      }
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await api.updateOrderStatus(selectedOrder.id, newStatus, statusNote);
      toast.gold('Order Updated', `Order #${selectedOrder.orderNumber} status changed to ${newStatus}`);
      setIsOrderModalOpen(false);
      loadDashboardData();
    } catch {
      toast.error('Update Failed', 'Could not update order status.');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-sand-50/60 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-espresso-950 text-ivory-50 rounded-3xl p-8 border border-gold-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <BrandLogo variant="light" size="md" isLink={false} />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 border border-gold-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" /> Store Manager Portal
              </div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold text-ivory-50">
                Store Administration
              </h1>
              <p className="text-xs text-sand-300">
                Sundarapuram, Coimbatore • Real-Time Inventory, Orders & Products
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAddProduct}
            >
              Add New Product
            </Button>
            <Link to="/">
              <Button variant="secondary" size="sm">
                View Live Store
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-sand-300 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto no-scrollbar">
          {[
            { key: 'overview', label: '📊 KPI Analytics' },
            { key: 'products', label: `📦 Product Catalog (${products.length})` },
            { key: 'orders', label: `🛍️ Store Orders (${orders.length})` },
            { key: 'customers', label: `👥 Customers (${customers.length})` },
            { key: 'offers', label: `🏷️ Offers & Discounts (${offers.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-espresso-950 text-gold-300 shadow-sm'
                  : 'text-charcoal-700 hover:bg-sand-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: KPI Analytics Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-sand-300 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-espresso-950 text-gold-400 flex items-center justify-center font-bold text-xl shadow">
                  ₹
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Total Sales Revenue</span>
                  <p className="font-sans text-2xl font-bold text-espresso-950 mt-0.5">
                    ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : '24,850'}
                  </p>
                  <span className="text-[10px] text-gold-700 font-semibold">+18% this week</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-sand-300 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-espresso-950 text-gold-400 flex items-center justify-center font-bold text-xl shadow">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Total Orders</span>
                  <p className="font-sans text-2xl font-bold text-espresso-950 mt-0.5">
                    {stats?.totalOrders || orders.length}
                  </p>
                  <span className="text-[10px] text-gold-700 font-semibold">Across Tamil Nadu</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-sand-300 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-espresso-950 text-gold-400 flex items-center justify-center font-bold text-xl shadow">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Active Catalog</span>
                  <p className="font-sans text-2xl font-bold text-espresso-950 mt-0.5">
                    {products.length} Products
                  </p>
                  <span className="text-[10px] text-gold-700 font-semibold">6 Categories</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-sand-300 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center font-bold text-xl shadow">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Stock Alerts</span>
                  <p className="font-sans text-2xl font-bold text-amber-900 mt-0.5">
                    {stats?.lowStockCount || 2} Low Items
                  </p>
                  <span className="text-[10px] text-amber-700 font-semibold">Ready for replenishment</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                <h3 className="font-sans text-xl font-bold text-espresso-950">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-gold-700 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-charcoal-700">
                  <thead className="bg-sand-50 uppercase text-[10px] font-bold text-charcoal-500">
                    <tr>
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-sand-50/60">
                        <td className="p-3 font-bold text-espresso-950">{ord.orderNumber}</td>
                        <td className="p-3 font-medium">{ord.shippingAddress?.fullName || 'Guest Customer'}</td>
                        <td className="p-3">{ord.items.length} items</td>
                        <td className="p-3 font-bold text-espresso-950">₹{ord.total}</td>
                        <td className="p-3">
                          <span className="bg-gold-100 text-gold-800 font-bold px-2.5 py-0.5 rounded-full border border-gold-300 text-[10px]">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] font-medium">{ord.paymentMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Product Catalog Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Filter products..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
                />
              </div>

              <Button
                variant="gold"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleOpenAddProduct}
              >
                Add New Product
              </Button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-sand-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-charcoal-700">
                  <thead className="bg-sand-50 uppercase text-[10px] font-bold text-charcoal-500 border-b border-sand-200">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Weight Variants & Prices</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-sand-50/60">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-sand-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-espresso-950">{prod.name}</p>
                              {prod.tamilName && (
                                <p className="text-[11px] text-gold-700">{prod.tamilName}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-espresso-900">{prod.category}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {prod.variants.map((v) => (
                              <span
                                key={v.weight}
                                className="bg-sand-100 border border-sand-300 px-2 py-0.5 rounded-md text-[11px] font-medium"
                              >
                                {v.weight}: <strong>₹{v.price}</strong>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-espresso-950">★ {prod.rating}</td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold bg-gold-100 text-gold-900 border border-gold-300 px-2 py-0.5 rounded-full">
                            In Stock
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 bg-sand-100 hover:bg-gold-100 text-charcoal-700 hover:text-gold-900 rounded-lg transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 bg-sand-100 hover:bg-spice-50 text-charcoal-700 hover:text-spice-600 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Order Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6 font-sans">
            <h2 className="font-sans text-2xl font-bold text-espresso-950">
              Customer Orders & Delivery Status
            </h2>

            <div className="bg-white rounded-3xl border border-sand-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-charcoal-700 font-sans">
                  <thead className="bg-sand-50 uppercase text-[10px] font-bold text-charcoal-500 border-b border-sand-200">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer & City</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Delivery Type</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-sand-50/60">
                        <td className="p-4 font-bold text-espresso-950">{ord.orderNumber}</td>
                        <td className="p-4">
                          <p className="font-semibold text-espresso-950">{ord.shippingAddress?.fullName}</p>
                          <p className="text-[11px] text-charcoal-500">{ord.shippingAddress?.city}, {ord.shippingAddress?.phone}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-espresso-900">{ord.items[0]?.productName}</p>
                          {ord.items.length > 1 && (
                            <span className="text-[10px] text-charcoal-500">+ {ord.items.length - 1} more items</span>
                          )}
                        </td>
                        <td className="p-4 text-[11px] font-semibold text-gold-800">{ord.deliveryMethod}</td>
                        <td className="p-4 font-sans font-bold text-base text-espresso-950">₹{ord.total}</td>
                        <td className="p-4">
                          <span className="bg-espresso-950 text-gold-300 font-bold px-2.5 py-1 rounded-full border border-gold-500/30 text-[10px]">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setNewStatus(ord.orderStatus);
                              setIsOrderModalOpen(true);
                            }}
                            className="bg-gold-500 hover:bg-gold-400 text-espresso-950 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                          >
                            Update Milestone
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Customer Directory */}
        {activeTab === 'customers' && (
          <div className="space-y-6 font-sans">
            <h2 className="font-sans text-2xl font-bold text-espresso-950">
              Customer Accounts & History
            </h2>

            <div className="bg-white rounded-3xl border border-sand-300 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-charcoal-700 font-sans">
                  <thead className="bg-sand-50 uppercase text-[10px] font-bold text-charcoal-500 border-b border-sand-200">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Orders Placed</th>
                      <th className="p-4">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-200">
                    {customers.map((c, i) => (
                      <tr key={i} className="hover:bg-sand-50/60">
                        <td className="p-4 font-bold text-espresso-950">{c.name}</td>
                        <td className="p-4">{c.email}</td>
                        <td className="p-4">{c.phone || '—'}</td>
                        <td className="p-4 font-semibold">{c.ordersCount} orders</td>
                        <td className="p-4 font-bold text-espresso-950">₹{c.totalSpent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Offers & Coupons */}
        {activeTab === 'offers' && (
          <div className="space-y-6 font-sans">
            <h2 className="font-sans text-2xl font-bold text-espresso-950">
              Active Promo Coupons & Offers
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
              {offers.map((off) => (
                <div
                  key={off.id}
                  className="bg-white rounded-3xl border border-sand-300 p-6 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <span className="bg-gold-500 text-espresso-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                    {off.code}
                  </span>
                  <h3 className="font-sans text-lg font-bold text-espresso-950 mt-1">{off.title}</h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">{off.description}</p>
                  <div className="pt-2 border-t border-sand-200 flex items-center justify-between text-xs font-semibold text-gold-700">
                    <span>Valid until {off.validUntil}</span>
                    <span>Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProductId ? 'Edit Product' : 'Add New Dry Fruit / Combo'}
        subtitle="Catalog updates reflect instantly across the entire application."
        maxWidth="xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <LuxuryInput
            label="Product Name *"
            type="text"
            placeholder="e.g. California Whole Almonds"
            value={prodName}
            onChange={(e) => setProdName(e.target.value)}
            required
          />

          <LuxuryInput
            label="Tamil Name / Tagline"
            type="text"
            placeholder="e.g. கலிபோர்னியா பாதாம்"
            value={prodTamil}
            onChange={(e) => setProdTamil(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Category *
              </label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-ivory-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
              >
                <option value="Nuts">Nuts</option>
                <option value="Dried Fruits">Dried Fruits</option>
                <option value="Seeds">Seeds</option>
                <option value="Combos">Combos</option>
                <option value="Gift Packs">Gift Packs</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>

            <LuxuryInput
              label="Image URL"
              type="url"
              placeholder="https://..."
              value={prodImage}
              onChange={(e) => setProdImage(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Short Summary
            </label>
            <input
              type="text"
              value={prodShortDesc}
              onChange={(e) => setProdShortDesc(e.target.value)}
              placeholder="100% natural, crisp, rich-in-vitamin E..."
              className="w-full px-3.5 py-2.5 bg-ivory-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Full Description
            </label>
            <textarea
              rows={3}
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              placeholder="Detailed description..."
              className="w-full px-3.5 py-2 bg-ivory-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Weight Variants Editor */}
          <div className="pt-2 border-t border-sand-200 space-y-2">
            <span className="font-bold text-xs uppercase tracking-wider text-espresso-950 block">
              Weight Variants & Pricing (Editable):
            </span>
            {prodVariants.map((v, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 bg-sand-50 p-2 rounded-xl border border-sand-200">
                <input
                  type="text"
                  value={v.weight}
                  onChange={(e) => {
                    const copy = [...prodVariants];
                    copy[i].weight = e.target.value;
                    setProdVariants(copy);
                  }}
                  className="px-2 py-1 bg-white border border-sand-300 rounded-lg text-xs"
                />
                <input
                  type="number"
                  placeholder="Price ₹"
                  value={v.price}
                  onChange={(e) => {
                    const copy = [...prodVariants];
                    copy[i].price = Number(e.target.value);
                    setProdVariants(copy);
                  }}
                  className="px-2 py-1 bg-white border border-sand-300 rounded-lg text-xs"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => {
                    const copy = [...prodVariants];
                    copy[i].stock = Number(e.target.value);
                    setProdVariants(copy);
                  }}
                  className="px-2 py-1 bg-white border border-sand-300 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>

          <Button type="submit" variant="gold" size="md" className="w-full mt-4">
            Save Product to Store
          </Button>
        </form>
      </Modal>

      {/* Order Status Update Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title={`Update Order #${selectedOrder?.orderNumber}`}
        subtitle={`Customer: ${selectedOrder?.shippingAddress?.fullName}`}
      >
        <form onSubmit={handleUpdateOrderStatus} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Select Delivery Milestone:
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full py-2.5 px-3 bg-ivory-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
            >
              <option value="Placed">Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Packed">Packed</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Milestone Activity Note:
            </label>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Dispatched via Coimbatore Local Express"
              className="w-full px-3.5 py-2 bg-ivory-50 border border-sand-300 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-gold-500"
            />
          </div>

          <Button type="submit" variant="gold" size="md" className="w-full">
            Update Status
          </Button>
        </form>
      </Modal>
    </main>
  );
};
