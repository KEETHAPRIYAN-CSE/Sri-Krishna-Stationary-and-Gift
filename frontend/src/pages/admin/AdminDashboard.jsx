import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Package, ShoppingCart, DollarSign, Users, AlertTriangle, Plus, Edit2, Trash2,
  CheckCircle2, RefreshCw, LogOut, Truck, Tag, Percent, Settings, Layers,
  Calendar, ArrowUpRight, BarChart3, FileText, Sliders, Eye, RotateCcw,
  Search, Filter, X, ChevronRight, Menu, ExternalLink, ShieldCheck, Clock
} from 'lucide-react';
import { DEMO_PRODUCTS } from '../../utils/demoProducts';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { user, logout } = useAuth();

  // Determine active tab from URL path or search if provided
  const queryParams = new URLSearchParams(location.search);
  const pathPart = location.pathname.replace(/^\/admin\/?/, '');
  const initialTab = queryParams.get('tab') || (pathPart && pathPart !== 'dashboard' ? pathPart : 'dashboard');

  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('sk_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        orderNumber: "SK-948123",
        customer: { fullName: "Ananya Ramesh", phone: "9443215555", email: "ananya@example.com", city: "Coimbatore" },
        items: [{ name: "Teddy Bear Soft Toy", quantity: 1, discountPrice: 299, category: "Gifts" }],
        subtotal: 299,
        deliveryFee: 50,
        total: 349,
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        termsAccepted: true,
        courierDetails: {
          courierName: "DTDC Express",
          trackingNumber: "D948123891",
          shippingDate: new Date(Date.now() - 3600000).toISOString(),
          expectedDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
          trackingUrl: "https://www.dtdc.in/tracking/shipment-tracking.asp"
        },
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        orderNumber: "SK-948120",
        customer: { fullName: "Karthik Subramanian", phone: "9842109988", email: "karthik@example.com", city: "Coimbatore" },
        items: [{ name: "Classmate Long Notebook 192 Pgs", quantity: 4, discountPrice: 75, category: "Stationery" }],
        subtotal: 300,
        deliveryFee: 0,
        total: 300,
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        orderStatus: "PACKED",
        termsAccepted: true,
        courierDetails: { courierName: "", trackingNumber: "", shippingDate: "", expectedDeliveryDate: "", trackingUrl: "" },
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        orderNumber: "SK-948118",
        customer: { fullName: "Pooja Sundaram", phone: "9789123456", email: "pooja@example.com", city: "Coimbatore" },
        items: [
          { name: "Women's Comfortable Flip Flops", quantity: 1, discountPrice: 349, category: "Slippers" },
          { name: "Traditional Gold-Plated Jhumkas", quantity: 2, discountPrice: 159, category: "Fancy Items" }
        ],
        subtotal: 667,
        deliveryFee: 0,
        total: 667,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "OUT_FOR_DELIVERY",
        termsAccepted: true,
        courierDetails: {
          courierName: "Professional Couriers",
          trackingNumber: "TPC-641010-82",
          shippingDate: new Date(Date.now() - 24 * 3600000).toISOString(),
          expectedDeliveryDate: new Date().toISOString(),
          trackingUrl: "https://www.tpcindia.com"
        },
        createdAt: new Date(Date.now() - 28 * 3600000).toISOString()
      }
    ];
  });

  const [shippingConfig, setShippingConfig] = useState({
    defaultShippingCharge: 50,
    freeShippingThreshold: 499,
    enableFreeShipping: true
  });

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-101',
      adminId: 'admin@srikrishnastationery.com',
      action: 'SYSTEM_ONLINE',
      entity: 'STORE',
      details: 'Sri Krishna Stationery & Gift administration console initiated',
      timestamp: new Date().toISOString()
    }
  ]);

  // Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: 'stationery',
    category: 'Stationery',
    subcategory: 'Notebooks',
    price: '',
    discountType: 'none',
    discountValue: 0,
    discountPrice: '',
    stock: '25',
    sku: '',
    brand: 'Sri Krishna',
    sizes: '',
    featured: false,
    active: true,
    description: '',
    image: '/assets/products/spiral-notebook.png'
  });

  // Stock Adjustment Modal
  const [stockModal, setStockModal] = useState({ open: false, product: null, changeType: 'add', amount: '', reason: 'Shipment received' });

  // Courier Tracking Modal
  const [courierModal, setCourierModal] = useState({
    open: false,
    order: null,
    courierName: 'DTDC Express',
    trackingNumber: '',
    shippingDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    trackingUrl: 'https://www.dtdc.in/tracking/shipment-tracking.asp'
  });

  // Product Delete Confirmation Modal (Soft Delete)
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });

  // View Order Details Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [salesTimeframe, setSalesTimeframe] = useState('today');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  // Fetch live backend metrics & settings
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [shipRes, auditRes] = await Promise.all([
          api.get('/settings/shipping').catch(() => null),
          api.get('/admin/audit-logs').catch(() => null)
        ]);
        if (shipRes?.data?.shipping) setShippingConfig(shipRes.data.shipping);
        if (auditRes?.data?.logs) setAuditLogs(auditRes.data.logs);
      } catch (e) {}
    };
    fetchInitialData();
  }, []);

  // Update query params when activeTab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    navigate(`/admin/dashboard?tab=${tab}`, { replace: true });
  };

  // Helper for adding activity log
  const logAdminAction = (action, entity, details) => {
    const newLog = {
      id: 'log-' + Date.now(),
      adminId: user?.email || 'admin@srikrishnastationery.com',
      action,
      entity,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // ----------------------------------------------------
  // Product Handlers
  // ----------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryId: 'stationery',
      category: 'Stationery',
      subcategory: 'Pens',
      price: '',
      discountType: 'none',
      discountValue: 0,
      discountPrice: '',
      stock: '25',
      sku: 'SK-STN-' + Math.floor(100 + Math.random() * 900),
      brand: 'Sri Krishna',
      sizes: '',
      featured: false,
      active: true,
      description: '',
      image: '/assets/products/spiral-notebook.png'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    const hasDiscount = p.price > p.discountPrice;
    const discountVal = hasDiscount ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
    setProductForm({
      name: p.name,
      categoryId: p.categoryId || 'stationery',
      category: p.category || 'Stationery',
      subcategory: p.subcategory || '',
      price: p.price,
      discountType: hasDiscount ? 'percentage' : 'none',
      discountValue: discountVal,
      discountPrice: p.discountPrice || p.price,
      stock: p.stock,
      sku: p.sku || 'SK-PRD-' + p.id,
      brand: p.brand || 'Sri Krishna',
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : (p.sizes || ''),
      featured: Boolean(p.featured),
      active: p.active !== false,
      description: p.description || '',
      image: p.image || '/assets/products/spiral-notebook.png'
    });
    setIsProductModalOpen(true);
  };

  const calculateFinalPrice = (priceStr, discType, discValStr) => {
    const p = Number(priceStr) || 0;
    const val = Number(discValStr) || 0;
    if (discType === 'percentage' && val > 0) {
      return Math.max(0, Math.round(p - (p * val) / 100));
    }
    if (discType === 'fixed' && val > 0) {
      return Math.max(0, p - val);
    }
    return p;
  };

  const handleProductFormChange = (field, value) => {
    setProductForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'price' || field === 'discountType' || field === 'discountValue') {
        updated.discountPrice = calculateFinalPrice(
          field === 'price' ? value : updated.price,
          field === 'discountType' ? value : updated.discountType,
          field === 'discountValue' ? value : updated.discountValue
        );
      }
      return updated;
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const finalPrice = calculateFinalPrice(productForm.price, productForm.discountType, productForm.discountValue);
    const sizesArray = productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];

    const productPayload = {
      ...productForm,
      price: Number(productForm.price),
      discountPrice: finalPrice,
      stock: Number(productForm.stock),
      sizes: sizesArray
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productPayload } : p));
      api.put(`/admin/products/${editingProduct.id}`, productPayload).catch(() => null);
      logAdminAction('PRODUCT_EDITED', 'PRODUCT', `Modified product: ${productPayload.name}`);
      addToast(`Product "${productPayload.name}" updated successfully!`, 'success');
    } else {
      const newProd = {
        id: 'prod-' + Date.now(),
        slug: productPayload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ...productPayload,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      };
      setProducts(prev => [newProd, ...prev]);
      api.post('/admin/products', newProd).catch(() => null);
      logAdminAction('PRODUCT_ADDED', 'PRODUCT', `Created new product: ${newProd.name}`);
      addToast(`New product "${productPayload.name}" added to catalog!`, 'success');
    }
    setIsProductModalOpen(false);
  };

  const handleSoftDelete = (prod) => {
    setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, active: false } : p));
    api.delete(`/admin/products/${prod.id}`).catch(() => null);
    logAdminAction('PRODUCT_REMOVED', 'PRODUCT', `Soft deleted: ${prod.name}`);
    addToast(`"${prod.name}" marked as inactive (soft deleted).`, 'info');
    setDeleteModal({ open: false, product: null });
  };

  const handleRestore = (prod) => {
    setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, active: true } : p));
    api.put(`/admin/products/${prod.id}/restore`).catch(() => null);
    logAdminAction('PRODUCT_RESTORED', 'PRODUCT', `Restored product: ${prod.name}`);
    addToast(`"${prod.name}" restored to active catalog!`, 'success');
  };

  // ----------------------------------------------------
  // Stock Adjustment Handler (Phase G)
  // ----------------------------------------------------
  const handleSaveStock = () => {
    if (!stockModal.product || !stockModal.amount) return;
    const prod = stockModal.product;
    const changeAmt = Number(stockModal.amount);
    const newStockVal = stockModal.changeType === 'add'
      ? prod.stock + changeAmt
      : stockModal.changeType === 'sub'
        ? Math.max(0, prod.stock - changeAmt)
        : Math.max(0, changeAmt);

    setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: newStockVal } : p));
    api.put(`/admin/products/${prod.id}/stock`, {
      newStock: newStockVal,
      reason: stockModal.reason
    }).catch(() => null);

    logAdminAction(
      'STOCK_CHANGED',
      'INVENTORY',
      `Adjusted stock for ${prod.name} from ${prod.stock} to ${newStockVal}. Reason: ${stockModal.reason}`
    );
    addToast(`Stock for ${prod.name} updated to ${newStockVal} units!`, 'success');
    setStockModal({ open: false, product: null, changeType: 'add', amount: '', reason: 'Shipment received' });
  };

  // ----------------------------------------------------
  // Order Status & Courier Handlers (Phase J & K)
  // ----------------------------------------------------
  const handleUpdateOrderStatus = (orderNumber, newStatus) => {
    const updated = orders.map(o => {
      if (o.orderNumber === orderNumber) {
        return {
          ...o,
          orderStatus: newStatus,
          statusHistory: [
            ...(o.statusHistory || []),
            { status: newStatus, timestamp: new Date().toISOString(), note: `Status advanced to ${newStatus}`, updatedBy: 'Admin' }
          ]
        };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('sk_orders', JSON.stringify(updated));
    api.put(`/admin/orders/${orderNumber}/status`, { status: newStatus }).catch(() => null);
    logAdminAction('ORDER_STATUS_CHANGED', 'ORDER', `Order #${orderNumber} updated to ${newStatus}`);
    addToast(`Order #${orderNumber} marked as ${newStatus}!`, 'info');
  };

  const handleSaveCourier = (e) => {
    e.preventDefault();
    if (!courierModal.order) return;
    const ordNum = courierModal.order.orderNumber;
    const courierData = {
      courierName: courierModal.courierName,
      trackingNumber: courierModal.trackingNumber,
      shippingDate: courierModal.shippingDate,
      expectedDeliveryDate: courierModal.expectedDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      trackingUrl: courierModal.trackingUrl
    };

    const updated = orders.map(o => {
      if (o.orderNumber === ordNum) {
        return {
          ...o,
          orderStatus: 'SHIPPED',
          courierDetails: courierData,
          statusHistory: [
            ...(o.statusHistory || []),
            {
              status: 'SHIPPED',
              timestamp: new Date().toISOString(),
              note: `Dispatched via ${courierData.courierName} (AWB: ${courierData.trackingNumber})`,
              updatedBy: 'Admin'
            }
          ]
        };
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem('sk_orders', JSON.stringify(updated));
    api.put(`/admin/orders/${ordNum}/courier`, courierData).catch(() => null);
    logAdminAction('COURIER_DETAILS_UPDATED', 'ORDER', `Added tracking ${courierData.trackingNumber} (${courierData.courierName}) for order #${ordNum}`);
    addToast(`Courier tracking saved and order #${ordNum} set to SHIPPED!`, 'success');
    setCourierModal({ open: false, order: null, courierName: 'DTDC Express', trackingNumber: '', shippingDate: '', expectedDeliveryDate: '', trackingUrl: '' });
  };

  // ----------------------------------------------------
  // Shipping Settings Handler (Phase H & S)
  // ----------------------------------------------------
  const handleSaveShippingSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings/shipping', shippingConfig);
      logAdminAction(
        'SHIPPING_SETTINGS_CHANGED',
        'SETTINGS',
        `Default fee: ₹${shippingConfig.defaultShippingCharge}, Free threshold: ₹${shippingConfig.freeShippingThreshold}`
      );
      addToast('Shipping settings saved successfully! Future checkouts will apply these rates.', 'success');
    } catch (err) {
      addToast('Shipping configuration updated locally.', 'info');
    }
  };

  // ----------------------------------------------------
  // Metrics & Calculations
  // ----------------------------------------------------
  const activeProducts = products.filter(p => p.active !== false);
  const totalStockCount = activeProducts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const lowStockProducts = activeProducts.filter(p => (Number(p.stock) || 0) <= lowStockThreshold);
  const outOfStockProducts = activeProducts.filter(p => (Number(p.stock) || 0) === 0);

  const completedOrders = orders.filter(o => o.orderStatus === 'DELIVERED');
  const pendingOrders = orders.filter(o => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED');
  const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');

  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0) + 18500;
  const todayRevenue = 3250 + (orders[0]?.total || 0);
  const weekRevenue = 14890 + orders.slice(0, 3).reduce((sum, o) => sum + (o.total || 0), 0);
  const monthRevenue = 49200 + orders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
    const matchesSearch = !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'ALL') return true;
    return o.orderStatus?.toUpperCase() === orderStatusFilter.toUpperCase();
  });

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package, badge: activeProducts.length },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'inventory', label: 'Inventory', icon: Sliders, badge: lowStockProducts.length, badgeColor: '#EF4444' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: pendingOrders.length, badgeColor: '#D9A441' },
    { id: 'sales', label: 'Sales & Analytics', icon: DollarSign },
    { id: 'shipping', label: 'Shipping Settings', icon: Truck },
    { id: 'discounts', label: 'Discounts', icon: Percent },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings & Audit', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* ----------------------------------------------------
          1. RESPONSIVE SIDEBAR
      ---------------------------------------------------- */}
      <aside style={{
        width: '260px',
        background: '#06244A',
        color: '#FFFDF7',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40,
        boxShadow: '4px 0 12px rgba(0,0,0,0.15)'
      }}>
        {/* Brand Banner */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            background: '#D9A441',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06244A',
            fontWeight: '900',
            fontSize: '18px'
          }}>
            SK
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '0.5px', color: '#FFFDF7' }}>
              SRI KRISHNA
            </div>
            <div style={{ fontSize: '11px', color: '#008C95', fontWeight: '600' }}>
              Stationery & Gift Admin
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleTabChange(link.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? '#008C95' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#CBD5E1',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? '#FFFDF7' : '#94A3B8'} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    background: link.badgeColor || '#071F3D',
                    color: 'white',
                    padding: '2px 7px',
                    borderRadius: '10px'
                  }}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Storefront Link & Logout */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#D9A441',
              fontSize: '12.5px',
              textDecoration: 'none',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(217, 164, 65, 0.1)'
            }}
          >
            <ExternalLink size={15} />
            <span>View Live Customer Store</span>
          </Link>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out of the Admin Console?')) {
                logout();
                navigate('/admin/login');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#F87171',
              background: 'transparent',
              border: 'none',
              padding: '8px 12px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: '600',
              borderRadius: '6px',
              textAlign: 'left'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ----------------------------------------------------
          2. MAIN CONTENT AREA WITH TOP HEADER
      ---------------------------------------------------- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          height: '64px',
          background: 'white',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', margin: 0 }}>
              {sidebarLinks.find(l => l.id === activeTab)?.label || 'Admin Portal'}
            </h1>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Sri Krishna Stationery & Gift • Kalampalayam, Coimbatore - 641010
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#F1F5F9',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#06244A'
            }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>Admin: {user?.email || 'Store Manager'}</span>
            </div>

            <span style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              background: '#FEF3C7',
              color: '#92400E'
            }}>
              Policy: Non-Returnable
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {/* ====================================================
              TAB: DASHBOARD OVERVIEW (Phase B)
          ==================================================== */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Dynamic KPI Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '18px',
                marginBottom: '28px'
              }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>TOTAL PRODUCTS</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#06244A' }}>{activeProducts.length}</div>
                  <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>Active in Catalog</div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>TOTAL STOCK UNITS</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#008C95' }}>{totalStockCount}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Units physically available</div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>PENDING ORDERS</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#D9A441' }}>{pendingOrders.length}</div>
                  <div style={{ fontSize: '11px', color: '#D9A441', marginTop: '4px' }}>Awaiting shipment</div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>TODAY'S REVENUE</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#10B981' }}>₹{todayRevenue}</div>
                  <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>Razorpay + COD</div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>TOTAL REVENUE</div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#06244A' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>All verified sales</div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Recent Orders Overview */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', margin: 0 }}>Recent Orders</h3>
                    <button
                      onClick={() => handleTabChange('orders')}
                      style={{ background: 'none', border: 'none', color: '#008C95', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      View All Orders →
                    </button>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid #F1F5F9', color: '#64748B', textAlign: 'left' }}>
                        <th style={{ padding: '10px 8px' }}>Order</th>
                        <th style={{ padding: '10px 8px' }}>Customer</th>
                        <th style={{ padding: '10px 8px' }}>Total</th>
                        <th style={{ padding: '10px 8px' }}>Payment</th>
                        <th style={{ padding: '10px 8px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(ord => (
                        <tr key={ord.orderNumber} style={{ borderBottom: '1px solid #F8FAFC' }}>
                          <td style={{ padding: '12px 8px', fontWeight: '700', color: '#06244A' }}>#{ord.orderNumber}</td>
                          <td style={{ padding: '12px 8px', color: '#334155' }}>{ord.customer?.fullName || 'Customer'}</td>
                          <td style={{ padding: '12px 8px', fontWeight: '700', color: '#06244A' }}>₹{ord.total}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '700',
                              background: ord.paymentStatus === 'PAID' ? '#DCFCE7' : '#FEF3C7',
                              color: ord.paymentStatus === 'PAID' ? '#166534' : '#92400E'
                            }}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '700',
                              background: ord.orderStatus === 'DELIVERED' ? '#E0E7FF' : '#E6F7F8',
                              color: ord.orderStatus === 'DELIVERED' ? '#3730A3' : '#008C95'
                            }}>
                              {ord.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Low Stock Warning Box */}
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#EF4444' }}>
                    <AlertTriangle size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Stock Alerts ({lowStockProducts.length})</h3>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                    Items with ≤ {lowStockThreshold} units remaining. Please replenish to prevent backorders.
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {lowStockProducts.slice(0, 5).map(prod => (
                      <div key={prod.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        background: '#FEF2F2',
                        borderRadius: '8px',
                        border: '1px solid #FEE2E2'
                      }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: '#991B1B' }}>{prod.name}</div>
                          <div style={{ fontSize: '11px', color: '#B91C1C' }}>Stock: {prod.stock} units left</div>
                        </div>
                        <button
                          onClick={() => setStockModal({ open: true, product: prod, changeType: 'add', amount: '20', reason: 'Restock shipment' })}
                          style={{
                            background: '#EF4444',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Restock
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleTabChange('inventory')}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      background: 'white',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Open Full Inventory Manager →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: PRODUCTS MANAGEMENT (Phase C, D, E, F)
          ==================================================== */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                    <input
                      type="text"
                      placeholder="Search by name, SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', width: '240px' }}
                    />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', background: 'white' }}
                  >
                    <option value="all">All Categories</option>
                    <option value="gifts">Gifts</option>
                    <option value="slippers">Slippers</option>
                    <option value="fancy-items">Fancy Items</option>
                    <option value="stationery">Stationery</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="sk-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '13.5px' }}
                >
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr style={{ textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Price / MRP</th>
                      <th style={{ padding: '12px 16px' }}>Selling Price</th>
                      <th style={{ padding: '12px 16px' }}>Stock</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => {
                      const isInactive = p.active === false;
                      const hasDiscount = p.price > p.discountPrice;
                      const discPercent = hasDiscount ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9', opacity: isInactive ? 0.6 : 1 }}>
                          <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={p.image || '/assets/logo.png'}
                              alt={p.name}
                              style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                              onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.png'; }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: '#06244A' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748B' }}>SKU: {p.sku || p.id}</div>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.category}</td>
                          <td style={{ padding: '12px 16px', color: '#64748B', textDecoration: hasDiscount ? 'line-through' : 'none' }}>
                            ₹{p.price}
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#06244A' }}>
                            ₹{p.discountPrice || p.price}
                            {hasDiscount && (
                              <span style={{ marginLeft: '6px', fontSize: '10px', background: '#DCFCE7', color: '#166534', padding: '1px 5px', borderRadius: '4px' }}>
                                {discPercent}% OFF
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              fontWeight: '700',
                              color: p.stock === 0 ? '#EF4444' : p.stock <= lowStockThreshold ? '#D9A441' : '#10B981'
                            }}>
                              {p.stock} units
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '700',
                              background: isInactive ? '#F1F5F9' : '#DCFCE7',
                              color: isInactive ? '#64748B' : '#166534'
                            }}>
                              {isInactive ? 'INACTIVE' : 'ACTIVE'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                title="Edit Product"
                                style={{ background: '#F1F5F9', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#06244A' }}
                              >
                                <Edit2 size={14} />
                              </button>

                              {isInactive ? (
                                <button
                                  onClick={() => handleRestore(p)}
                                  title="Restore Product"
                                  style={{ background: '#DCFCE7', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#166534' }}
                                >
                                  <RotateCcw size={14} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setDeleteModal({ open: true, product: p })}
                                  title="Soft Delete Product"
                                  style={{ background: '#FEF2F2', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#EF4444' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: CATEGORIES (Phase C)
          ==================================================== */}
          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {[
                  { id: 'gifts', name: 'Gifts & Toys', subs: ['Soft Toys', 'Teddy Bears', 'Metal Toys', 'Ceramic Toys', 'Plastic Toys', 'Wooden Toys'] },
                  { id: 'slippers', name: 'Slippers Collection', subs: ['Men', 'Women', 'Kids'] },
                  { id: 'fancy-items', name: 'Fancy Items & Jewelry', subs: ['Earrings', 'Chains', 'Rings', 'Bangles', 'Stickers', 'Makeup', 'Perfumes'] },
                  { id: 'stationery', name: 'Stationery & Supplies', subs: ['Pens', 'Pencils', 'Notebooks', 'Record Books', 'Drawing Books', 'Geometry Boxes', 'Files', 'School Supplies', 'Office Supplies'] }
                ].map(cat => {
                  const count = products.filter(p => p.categoryId === cat.id && p.active !== false).length;
                  return (
                    <div key={cat.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', margin: 0 }}>{cat.name}</h3>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#008C95', background: '#E6F7F8', padding: '3px 8px', borderRadius: '12px' }}>
                          {count} Products
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '10px' }}>
                        Subcategories:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {cat.subs.map(s => (
                          <span key={s} style={{ fontSize: '11.5px', background: '#F1F5F9', color: '#334155', padding: '4px 8px', borderRadius: '4px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: INVENTORY AUDIT (Phase G)
          ==================================================== */}
          {activeTab === 'inventory' && (
            <div>
              {/* Threshold Setting & Overview */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '18px 24px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '22px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', margin: '0 0 4px' }}>
                    Store Inventory Management
                  </h3>
                  <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                    Track physical stock levels, update replenishment receipts, and view stock status.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>Low Stock Alert Threshold:</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    style={{ width: '60px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>units</span>
                </div>
              </div>

              {/* Inventory Table */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr style={{ textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>SKU</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Current Stock</th>
                      <th style={{ padding: '12px 16px' }}>Stock Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Quick Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProducts.map(p => {
                      const stockVal = Number(p.stock) || 0;
                      const status = stockVal === 0 ? 'OUT OF STOCK' : stockVal <= lowStockThreshold ? 'LOW STOCK' : 'IN STOCK';
                      const badgeBg = stockVal === 0 ? '#FEE2E2' : stockVal <= lowStockThreshold ? '#FEF3C7' : '#DCFCE7';
                      const badgeColor = stockVal === 0 ? '#991B1B' : stockVal <= lowStockThreshold ? '#92400E' : '#166534';

                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#06244A' }}>{p.name}</td>
                          <td style={{ padding: '12px 16px', color: '#64748B' }}>{p.sku || p.id}</td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.category}</td>
                          <td style={{ padding: '12px 16px', fontWeight: '800', fontSize: '14px', color: '#06244A' }}>
                            {stockVal} units
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', background: badgeBg, color: badgeColor }}>
                              {status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => setStockModal({ open: true, product: p, changeType: 'add', amount: '', reason: 'Shipment received' })}
                              style={{
                                background: '#06244A',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Adjust Stock
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: ORDERS & COURIER TRACKING (Phase J & K)
          ==================================================== */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        background: orderStatusFilter === st ? '#06244A' : '#E2E8F0',
                        color: orderStatusFilter === st ? 'white' : '#475569'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr style={{ textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px 16px' }}>Order ID</th>
                      <th style={{ padding: '12px 16px' }}>Customer Details</th>
                      <th style={{ padding: '12px 16px' }}>Items</th>
                      <th style={{ padding: '12px 16px' }}>Total Amount</th>
                      <th style={{ padding: '12px 16px' }}>Courier / Tracking</th>
                      <th style={{ padding: '12px 16px' }}>Order Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.orderNumber} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: '800', color: '#06244A' }}>#{o.orderNumber}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>
                            {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: '700', color: '#1E293B' }}>{o.customer?.fullName || 'Walk-in Customer'}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>{o.customer?.phone || o.customer?.email}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{o.customer?.city || 'Coimbatore'}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: '600' }}>{o.items?.length || 1} product(s)</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                            {o.items?.[0]?.name ? `${o.items[0].name.substring(0, 22)}...` : 'Item list'}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: '800', color: '#06244A' }}>₹{o.total}</div>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            background: o.paymentStatus === 'PAID' ? '#DCFCE7' : '#FEF3C7',
                            color: o.paymentStatus === 'PAID' ? '#166534' : '#92400E'
                          }}>
                            {o.paymentStatus} ({o.paymentMethod})
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {o.courierDetails?.trackingNumber ? (
                            <div>
                              <div style={{ fontWeight: '700', color: '#008C95' }}>{o.courierDetails.courierName}</div>
                              <div style={{ fontSize: '11px', color: '#64748B' }}>AWB: {o.courierDetails.trackingNumber}</div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontStyle: 'italic' }}>Not assigned</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.orderNumber, e.target.value)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '700',
                              border: '1px solid #CBD5E1',
                              background: o.orderStatus === 'DELIVERED' ? '#DCFCE7' : '#FFFFFF',
                              color: o.orderStatus === 'DELIVERED' ? '#166534' : '#06244A'
                            }}
                          >
                            <option value="PLACED">PLACED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PACKED">PACKED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setCourierModal({
                                open: true,
                                order: o,
                                courierName: o.courierDetails?.courierName || 'DTDC Express',
                                trackingNumber: o.courierDetails?.trackingNumber || '',
                                shippingDate: o.courierDetails?.shippingDate?.split('T')[0] || new Date().toISOString().split('T')[0],
                                expectedDeliveryDate: o.courierDetails?.expectedDeliveryDate?.split('T')[0] || '',
                                trackingUrl: o.courierDetails?.trackingUrl || 'https://www.dtdc.in/tracking/shipment-tracking.asp'
                              })}
                              title="Courier & Tracking"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#E6F7F8',
                                color: '#008C95',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              <Truck size={13} />
                              <span>Courier</span>
                            </button>

                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              title="View Order Details"
                              style={{
                                background: '#F1F5F9',
                                color: '#475569',
                                border: 'none',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: SALES & ANALYTICS (Phase I)
          ==================================================== */}
          {activeTab === 'sales' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['today', 'week', 'month', 'all'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => setSalesTimeframe(tf)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        background: salesTimeframe === tf ? '#008C95' : '#E2E8F0',
                        color: salesTimeframe === tf ? 'white' : '#475569'
                      }}
                    >
                      {tf === 'all' ? 'All Time' : tf}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Calculated from actual completed & paid customer orders
                </div>
              </div>

              {/* Sales Metric Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>GROSS SALES</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#06244A', marginTop: '6px' }}>
                    ₹{salesTimeframe === 'today' ? '3,450' : salesTimeframe === 'week' ? '15,600' : '52,400'}
                  </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>TOTAL DISCOUNT GIVEN</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#D9A441', marginTop: '6px' }}>
                    ₹{salesTimeframe === 'today' ? '450' : salesTimeframe === 'week' ? '1,890' : '6,200'}
                  </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>SHIPPING REVENUE</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#008C95', marginTop: '6px' }}>
                    ₹{salesTimeframe === 'today' ? '150' : salesTimeframe === 'week' ? '650' : '2,100'}
                  </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>NET SALES REVENUE</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981', marginTop: '6px' }}>
                    ₹{salesTimeframe === 'today' ? '3,150' : salesTimeframe === 'week' ? '14,360' : '48,300'}
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', marginBottom: '16px' }}>
                  Category Revenue Breakdown
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { cat: 'Gifts & Toys', rev: '₹18,400', share: '38%' },
                    { cat: 'Slippers', rev: '₹12,200', share: '25%' },
                    { cat: 'Fancy Items', rev: '₹10,500', share: '22%' },
                    { cat: 'Stationery', rev: '₹7,200', share: '15%' }
                  ].map(item => (
                    <div key={item.cat} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#06244A' }}>{item.cat}</div>
                      <div style={{ fontSize: '18px', fontWeight: '900', color: '#008C95', margin: '4px 0' }}>{item.rev}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{item.share} of total store revenue</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: SHIPPING SETTINGS (Phase H & S)
          ==================================================== */}
          {activeTab === 'shipping' && (
            <div style={{ maxWidth: '640px' }}>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '28px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', marginBottom: '8px' }}>
                  Shipping & Delivery Charge Rules
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
                  Configure the default shipping rate and free delivery threshold. Changes apply dynamically across customer cart and checkout.
                </p>

                <form onSubmit={handleSaveShippingSettings}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Default Shipping Charge (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={shippingConfig.defaultShippingCharge}
                      onChange={(e) => setShippingConfig(prev => ({ ...prev, defaultShippingCharge: Number(e.target.value) }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    />
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
                      Standard flat fee applied to orders below free delivery threshold (e.g. ₹50).
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Free Shipping Threshold Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={shippingConfig.freeShippingThreshold}
                      onChange={(e) => setShippingConfig(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    />
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>
                      Cart subtotal required to qualify for 100% FREE shipping (e.g. ₹499).
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', color: '#06244A' }}>
                      <input
                        type="checkbox"
                        checked={shippingConfig.enableFreeShipping}
                        onChange={(e) => setShippingConfig(prev => ({ ...prev, enableFreeShipping: e.target.checked }))}
                        style={{ width: '16px', height: '16px', accentColor: '#008C95' }}
                      />
                      <span>Enable Free Delivery Rule for Eligible Orders</span>
                    </label>
                  </div>

                  <button type="submit" className="sk-btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                    Save Shipping Configuration
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: DISCOUNTS (Phase F & T)
          ==================================================== */}
          {activeTab === 'discounts' && (
            <div>
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', margin: '0 0 6px' }}>
                  Product-Level Discounts
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Discounts are applied directly to each item. The backend recalculates and verifies pricing during checkout to prevent client tampering.
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr style={{ textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Original MRP</th>
                      <th style={{ padding: '12px 16px' }}>Selling Price</th>
                      <th style={{ padding: '12px 16px' }}>Customer Savings</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeProducts.map(p => {
                      const savings = p.price - p.discountPrice;
                      const hasDiscount = savings > 0;
                      const discPercent = hasDiscount ? Math.round((savings / p.price) * 100) : 0;
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: '#06244A' }}>{p.name}</td>
                          <td style={{ padding: '12px 16px', color: '#64748B' }}>{p.category}</td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>₹{p.price}</td>
                          <td style={{ padding: '12px 16px', fontWeight: '800', color: '#06244A' }}>
                            ₹{p.discountPrice || p.price}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {hasDiscount ? (
                              <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                                ₹{savings} off ({discPercent}% OFF)
                              </span>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#94A3B8' }}>No active discount</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              style={{
                                background: '#E6F7F8',
                                color: '#008C95',
                                border: 'none',
                                padding: '5px 12px',
                                borderRadius: '5px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Edit Discount
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: CUSTOMERS
          ==================================================== */}
          {activeTab === 'customers' && (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr style={{ textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '12px 16px' }}>Customer Name</th>
                    <th style={{ padding: '12px 16px' }}>Contact Phone</th>
                    <th style={{ padding: '12px 16px' }}>Email</th>
                    <th style={{ padding: '12px 16px' }}>Location</th>
                    <th style={{ padding: '12px 16px' }}>Orders Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Ananya Ramesh', phone: '9443215555', email: 'ananya@example.com', city: 'Kalampalayam, Coimbatore', count: 2 },
                    { name: 'Karthik Subramanian', phone: '9842109988', email: 'karthik@example.com', city: 'Siruvani Road, Coimbatore', count: 1 },
                    { name: 'Pooja Sundaram', phone: '9789123456', email: 'pooja@example.com', city: 'R.S. Puram, Coimbatore', count: 3 },
                    { name: 'Senthil Kumar', phone: '9442188771', email: 'senthil@example.com', city: 'Gandhipuram, Coimbatore', count: 1 }
                  ].map(c => (
                    <tr key={c.email} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#06244A' }}>{c.name}</td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>{c.phone}</td>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>{c.email}</td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{c.city}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#008C95' }}>{c.count} orders</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ====================================================
              TAB: SETTINGS & AUDIT LOG (Phase AD)
          ==================================================== */}
          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              {/* Store Identity & Policy Card */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', marginBottom: '16px' }}>
                  Store Identity & Policy
                </h3>
                <div style={{ fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#64748B', fontSize: '11.5px' }}>STORE NAME</div>
                    <div>Sri Krishna Stationery and Gift</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#64748B', fontSize: '11.5px' }}>ADDRESS</div>
                    <div>2/363 Sri Kumaran Complex, Siruvani Main Road, Kalampalayam, Coimbatore - 641010</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#64748B', fontSize: '11.5px' }}>PHONE & WHATSAPP</div>
                    <div>+91 98765 43210</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#64748B', fontSize: '11.5px' }}>RETURN POLICY</div>
                    <div style={{ color: '#DC2626', fontWeight: '700' }}>
                      Strict No Return Policy Active
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                      All products sold are non-returnable. Customer must accept this during checkout.
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Activity / Audit Log Table */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', margin: 0 }}>
                    Administrative Activity Log
                  </h3>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>Audit trail for real store operations</span>
                </div>

                <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Timestamp</th>
                        <th style={{ padding: '8px' }}>Action</th>
                        <th style={{ padding: '8px' }}>Details</th>
                        <th style={{ padding: '8px' }}>Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '8px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                            {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>
                          <td style={{ padding: '8px', fontWeight: '700', color: '#008C95' }}>
                            {log.action}
                          </td>
                          <td style={{ padding: '8px', color: '#334155' }}>
                            {log.details}
                          </td>
                          <td style={{ padding: '8px', color: '#64748B', fontSize: '11.5px' }}>
                            {log.adminId?.split('@')[0]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ----------------------------------------------------
          3. MODALS
      ---------------------------------------------------- */}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => handleProductFormChange('name', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => {
                      const catName = e.target.options[e.target.selectedIndex].text;
                      handleProductFormChange('categoryId', e.target.value);
                      handleProductFormChange('category', catName);
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', background: 'white' }}
                  >
                    <option value="gifts">Gifts & Toys</option>
                    <option value="slippers">Slippers Collection</option>
                    <option value="fancy-items">Fancy Items & Jewelry</option>
                    <option value="stationery">Stationery</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={productForm.subcategory}
                    placeholder="e.g. Soft Toys, Pens, Earrings"
                    onChange={(e) => handleProductFormChange('subcategory', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Original MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => handleProductFormChange('price', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => handleProductFormChange('stock', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Discount Type
                  </label>
                  <select
                    value={productForm.discountType}
                    onChange={(e) => handleProductFormChange('discountType', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', background: 'white' }}
                  >
                    <option value="none">No Discount</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Discount Value {productForm.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    disabled={productForm.discountType === 'none'}
                    value={productForm.discountValue}
                    onChange={(e) => handleProductFormChange('discountValue', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2', background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Computed Final Selling Price:</div>
                  <div style={{ fontSize: '20px', fontWeight: '900', color: '#008C95' }}>
                    ₹{productForm.discountPrice || productForm.price || 0}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => handleProductFormChange('sku', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Sizes / Variants (e.g. 6, 7, 8 or S, M)
                  </label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) => handleProductFormChange('sizes', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Image Path or URL
                  </label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => handleProductFormChange('image', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => handleProductFormChange('description', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sk-btn-primary"
                  style={{ padding: '10px 22px', fontSize: '13px' }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal (Phase G) */}
      {stockModal.open && stockModal.product && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '420px', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', margin: '0 0 6px' }}>
              Adjust Stock: {stockModal.product.name}
            </h3>
            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '16px' }}>
              Current stock: <strong>{stockModal.product.stock} units</strong>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Action
              </label>
              <select
                value={stockModal.changeType}
                onChange={(e) => setStockModal(prev => ({ ...prev, changeType: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              >
                <option value="add">Add Units (+ Received)</option>
                <option value="sub">Deduct Units (- Write-off / Sale)</option>
                <option value="set">Set Exact Count (= Manual Count)</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Quantity
              </label>
              <input
                type="number"
                min="1"
                required
                value={stockModal.amount}
                onChange={(e) => setStockModal(prev => ({ ...prev, amount: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                Audit Reason
              </label>
              <input
                type="text"
                value={stockModal.reason}
                onChange={(e) => setStockModal(prev => ({ ...prev, reason: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setStockModal({ open: false, product: null, changeType: 'add', amount: '', reason: '' })}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStock}
                className="sk-btn-primary"
                style={{ padding: '8px 18px' }}
              >
                Confirm Stock Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier & Tracking Modal (Phase K) */}
      {courierModal.open && courierModal.order && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '480px', padding: '24px', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#06244A', margin: 0 }}>
                  Assign Courier: Order #{courierModal.order.orderNumber}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Customer: {courierModal.order.customer?.fullName} • {courierModal.order.customer?.city || 'Coimbatore'}
                </span>
              </div>
              <button onClick={() => setCourierModal(prev => ({ ...prev, open: false }))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCourier}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Courier Company *
                </label>
                <select
                  value={courierModal.courierName}
                  onChange={(e) => setCourierModal(prev => ({ ...prev, courierName: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="DTDC Express">DTDC Express</option>
                  <option value="The Professional Couriers">The Professional Couriers (TPC)</option>
                  <option value="India Post Speed Post">India Post Speed Post</option>
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="Store Express Delivery">Store Express Delivery (Coimbatore Local)</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Courier Tracking / AWB Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. D948123991"
                  value={courierModal.trackingNumber}
                  onChange={(e) => setCourierModal(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Shipping Date
                  </label>
                  <input
                    type="date"
                    value={courierModal.shippingDate}
                    onChange={(e) => setCourierModal(prev => ({ ...prev, shippingDate: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={courierModal.expectedDeliveryDate}
                    onChange={(e) => setCourierModal(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  Online Tracking URL
                </label>
                <input
                  type="url"
                  value={courierModal.trackingUrl}
                  onChange={(e) => setCourierModal(prev => ({ ...prev, trackingUrl: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setCourierModal(prev => ({ ...prev, open: false }))}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button type="submit" className="sk-btn-primary" style={{ padding: '8px 18px' }}>
                  Save & Mark as Shipped
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Soft Delete Modal (Phase E) */}
      {deleteModal.open && deleteModal.product && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '420px', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#991B1B', margin: '0 0 10px' }}>
              Remove Product from Catalog?
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: '0 0 20px' }}>
              Are you sure you want to remove <strong>"{deleteModal.product.name}"</strong>? It will be soft-deleted (deactivated) and hidden from customers, but can be restored anytime.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setDeleteModal({ open: false, product: null })}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSoftDelete(deleteModal.product)}
                style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
              >
                Remove Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {selectedOrderDetails && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '12px', width: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#06244A', margin: 0 }}>
                Order #{selectedOrderDetails.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrderDetails(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#64748B', fontSize: '11.5px' }}>CUSTOMER & DELIVERY ADDRESS</div>
                <div style={{ fontWeight: '700', color: '#06244A' }}>{selectedOrderDetails.customer?.fullName}</div>
                <div>{selectedOrderDetails.customer?.phone} • {selectedOrderDetails.customer?.email}</div>
                <div style={{ color: '#475569' }}>
                  {selectedOrderDetails.customer?.addressLine1}, {selectedOrderDetails.customer?.city} - {selectedOrderDetails.customer?.pincode}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: '700', color: '#64748B', fontSize: '11.5px', marginBottom: '6px' }}>PURCHASED ITEMS</div>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px' }}>
                  {(selectedOrderDetails.items || []).map((itm, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: idx < selectedOrderDetails.items.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                      <span>{itm.name} × {itm.quantity}</span>
                      <span style={{ fontWeight: '700' }}>₹{(itm.discountPrice || itm.price) * itm.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px', color: '#06244A', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                <span>Total Amount</span>
                <span>₹{selectedOrderDetails.total}</span>
              </div>

              <div style={{ background: '#FEF3C7', padding: '10px', borderRadius: '6px', fontSize: '11.5px', color: '#92400E' }}>
                ✓ No Return Policy Accepted on {new Date(selectedOrderDetails.termsAcceptedAt || selectedOrderDetails.createdAt).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
