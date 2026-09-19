import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, ArrowRight, Clock } from 'lucide-react';
import { PageBanner } from '../components/common/PageBanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Account = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const orders = JSON.parse(localStorage.getItem('sk_orders') || '[]');

  const handleLogout = async () => {
    await logout();
    addToast('You have been logged out.', 'info');
    navigate('/');
  };

  const displayName = currentUser?.displayName || 'Customer';
  const displayEmail = currentUser?.email || 'customer@srikrishnastationery.com';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div>
      <PageBanner 
        title="MY ACCOUNT" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Account" }]} 
      />

      <div className="sk-container" style={{ padding: '40px 16px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Sidebar Nav */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#008C95', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                {initial}
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#06244A', margin: 0 }}>{displayName}</h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{displayEmail}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`sk-category-btn ${activeTab === 'orders' ? 'active' : ''}`}
              >
                <Package size={18} />
                <span>My Orders ({orders.length})</span>
              </button>

              <button 
                onClick={() => setActiveTab('profile')}
                className={`sk-category-btn ${activeTab === 'profile' ? 'active' : ''}`}
              >
                <User size={18} />
                <span>Profile Settings</span>
              </button>

              <button 
                onClick={() => setActiveTab('addresses')}
                className={`sk-category-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              >
                <MapPin size={18} />
                <span>Saved Addresses</span>
              </button>

              <button 
                onClick={handleLogout}
                className="sk-category-btn"
                style={{ color: '#EF4444', marginTop: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Main Tab Content */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '28px', minHeight: '350px' }}>
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1.5px solid #F1F5F9' }}>
                  Recent Orders
                </h2>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Package size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: '#64748B', fontSize: '14px' }}>You haven't placed any orders yet.</p>
                    <Link to="/shop" className="sk-btn-primary" style={{ marginTop: '16px' }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((ord, idx) => (
                      <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#06244A' }}>Order #{ord.orderNumber}</span>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>Placed on {new Date(ord.createdAt).toLocaleDateString()}</div>
                          </div>
                          <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '4px' }}>
                            {ord.orderStatus || 'CONFIRMED'}
                          </span>
                        </div>

                        <div style={{ fontSize: '13px', color: '#334155', marginBottom: '8px' }}>
                          {ord.items && ord.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                        </div>

                        {ord.courierDetails?.trackingNumber && (
                          <div style={{ marginBottom: '10px', fontSize: '12px', background: '#E6F7F8', color: '#008C95', padding: '6px 10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <span>Dispatched via <strong>{ord.courierDetails.courierName}</strong> (AWB: {ord.courierDetails.trackingNumber})</span>
                            {ord.courierDetails.trackingUrl && (
                              <a href={ord.courierDetails.trackingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#008C95', fontWeight: '700', textDecoration: 'underline' }}>
                                Track Online &rarr;
                              </a>
                            )}
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#06244A' }}>Total: ₹{ord.total}</span>
                          <Link to={`/order-confirmation/${ord.orderNumber}`} style={{ fontSize: '13px', color: '#008C95', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Track Order Details <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1.5px solid #F1F5F9' }}>
                  Profile Information
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '400px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>Full Name</label>
                    <input type="text" readOnly value="Keethapriyan M" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#F8FAFC' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>Phone</label>
                    <input type="text" readOnly value="+91 98765 43210" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#F8FAFC' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>Email</label>
                    <input type="text" readOnly value="customer@srikrishnastationery.com" style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#F8FAFC' }} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1.5px solid #F1F5F9' }}>
                  Saved Addresses
                </h2>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', background: '#F8FAFC' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', background: '#008C95', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>DEFAULT</span>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginTop: '8px', marginBottom: '4px' }}>Keethapriyan M</h4>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                    Flat 4A, Green Meadows Apartments, Near Siruvani Main Road, Kalampalayam, Coimbatore - 641010
                  </p>
                  <p style={{ fontSize: '13px', color: '#1E293B', fontWeight: '600', marginTop: '6px' }}>Phone: +91 98765 43210</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
