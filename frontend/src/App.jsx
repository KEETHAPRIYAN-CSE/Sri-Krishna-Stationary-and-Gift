import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Account } from './pages/Account';
import { Offers } from './pages/Offers';
import { Contact } from './pages/Contact';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';

import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Main Storefront Header & Navbar */}
            <Header />
            {!isAdminPath && <Navbar />}

            {/* Route Outlet */}
            <div style={{ flex: 1 }}>
              <Routes>
                {/* Storefront Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop initialCategory="all" pageTitle="ALL PRODUCTS" />} />
                <Route path="/gifts" element={<Shop initialCategory="gifts" pageTitle="GIFTS & TOYS" />} />
                <Route path="/slippers" element={<Shop initialCategory="slippers" pageTitle="SLIPPERS COLLECTION" />} />
                <Route path="/fancy-items" element={<Shop initialCategory="fancy-items" pageTitle="FANCY ITEMS & JEWELRY" />} />
                <Route path="/stationery" element={<Shop initialCategory="stationery" pageTitle="STATIONERY & ART SUPPLIES" />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<TermsAndConditions />} />

                {/* Customer Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Product & Shopping Flows */}
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/order-success/:orderId" element={<OrderConfirmation />} />
                
                {/* Customer Account (Protected) */}
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/account/orders" 
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Backoffice Flows */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/inventory" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/sales" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/shipping" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/discounts" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/customers" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/settings" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
            </div>

            {/* Floating WhatsApp Launcher */}
            <FloatingWhatsApp />

            {/* Footer */}
            <Footer />
          </div>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
