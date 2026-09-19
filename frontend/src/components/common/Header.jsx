import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, MessageCircle, User, ShieldCheck, LogIn } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItemsCount, subtotal } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <header className="sk-top-header">
      <div className="sk-container">
        <div className="sk-top-header-inner">
          {/* Logo & Brand Identity */}
          <Link to="/" className="sk-brand-wrapper">
            <img 
              src="/assets/logo.png" 
              alt="Sri Krishna Stationery and Gift Logo" 
              className="sk-brand-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/nav-logo.png';
              }}
            />
            <div className="sk-brand-text">
              <span className="sk-brand-title">SRI KRISHNA</span>
              <span className="sk-brand-sub">STATIONERY AND GIFT</span>
              <span className="sk-brand-tagline">Everything You Need, All in One Place!</span>
            </div>
          </Link>

          {/* Centered Search Bar */}
          <form className="sk-search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="sk-search-input"
              placeholder="Search stationery, gifts, toys, slippers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="sk-search-btn" title="Search">
              <Search size={18} />
            </button>
          </form>

          {/* Header Right Actions */}
          <div className="sk-header-actions">
            {/* WhatsApp Direct Order Button */}
            <a 
              href="https://wa.me/919876543210?text=Hello%20Sri%20Krishna%20Stationery%20and%20Gift,%20I%20would%20like%20to%20place%20an%20order." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sk-btn-whatsapp"
              title="Order directly via WhatsApp"
            >
              <MessageCircle size={17} />
              <span>Order on WhatsApp</span>
            </a>

            {/* Cart Button */}
            <Link to="/cart" className="sk-cart-btn" title="View Shopping Cart">
              <div className="sk-cart-icon-wrapper">
                <ShoppingCart size={22} />
                <span className="sk-cart-badge">{totalItemsCount}</span>
              </div>
              <div className="sk-cart-text">
                <span className="sk-cart-label">Cart</span>
                <span className="sk-cart-total">₹{subtotal}</span>
              </div>
            </Link>

            {/* Account / Login Link */}
            {currentUser ? (
              <Link 
                to="/account" 
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '6px' }} 
                title="My Account"
              >
                <User size={18} color="#D9A441" />
                <span>{currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Account'}</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '6px' }} 
                title="Sign In"
              >
                <LogIn size={16} color="#D9A441" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Admin Quick Link */}
            <Link to="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center' }} title="Admin Dashboard">
              <ShieldCheck size={18} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
