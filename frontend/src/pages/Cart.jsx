import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PageBanner } from '../components/common/PageBanner';

export const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();
  const navigate = useNavigate();

  const handleWhatsAppCartOrder = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
    const itemsText = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} × ${item.quantity} - ₹${item.discountPrice * item.quantity}`
    ).join('\n');
    const message = `Hello Sri Krishna Stationery & Gift,\n\nI would like to order:\n\n${itemsText}\n\nSubtotal: ₹${subtotal}\nDelivery: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\nTotal: ₹${total}\n\nPlease confirm availability and order details.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <PageBanner 
          title="SHOPPING CART" 
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Cart" }]} 
        />
        <div className="sk-container" style={{ padding: '80px 16px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#FFF8E8',
            color: '#D9A441',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Looks like you haven't added any stationery, toys, slippers, or gifts to your bag yet.
          </p>
          <Link to="/shop" className="sk-btn-primary" style={{ padding: '12px 28px' }}>
            Explore Our Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBanner 
        title="SHOPPING CART" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Cart" }]} 
      />

      <div className="sk-container" style={{ padding: '40px 16px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Cart Items List */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1.5px solid #F1F5F9' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A' }}>
                Cart Items ({cartItems.length})
              </h2>
              <button 
                onClick={clearCart}
                style={{ fontSize: '12.5px', color: '#EF4444', fontWeight: '600' }}
              >
                Clear Cart
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedSize || 'default'}`}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #F1F5F9'
                  }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '70px', height: '70px', objectFit: 'contain', background: '#F8FAFC', borderRadius: '8px', padding: '6px', border: '1px solid #E2E8F0' }} 
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>
                      {item.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
                      {item.category} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#06244A' }}>
                      ₹{item.discountPrice}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                      style={{ padding: '4px 10px', background: '#F8FAFC', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '4px 12px', fontSize: '13px', fontWeight: '700' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                      style={{ padding: '4px 10px', background: '#F8FAFC', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ width: '80px', textAlign: 'right', fontWeight: '800', fontSize: '14px', color: '#06244A' }}>
                    ₹{item.discountPrice * item.quantity}
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    style={{ color: '#94A3B8', padding: '6px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px' }}>
              <Link to="/shop" style={{ fontSize: '13px', color: '#008C95', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Card */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#06244A', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1.5px solid #F1F5F9' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: '700', color: '#1E293B' }}>₹{subtotal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: '700', color: deliveryFee === 0 ? '#10B981' : '#1E293B' }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              {deliveryFee > 0 && (
                <div style={{ fontSize: '12px', color: '#008C95', background: '#E6F7F8', padding: '6px 10px', borderRadius: '6px' }}>
                  Add items worth ₹{499 - subtotal} more for <strong>FREE Delivery</strong>!
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', color: '#06244A', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button 
              className="sk-btn-gold" 
              style={{ width: '100%', padding: '14px', fontSize: '15px', marginBottom: '10px' }}
              onClick={() => navigate('/checkout')}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={18} />
            </button>

            <button 
              onClick={handleWhatsAppCartOrder}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                background: '#25D366',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <MessageCircle size={17} />
              <span>ORDER ON WHATSAPP</span>
            </button>

            {/* No Return Policy reminder */}
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              background: '#FFFDF7',
              border: '1px solid #D9A441',
              borderRadius: '6px',
              fontSize: '11.5px',
              color: '#06244A',
              lineHeight: '1.4'
            }}>
              <strong>Store Policy Notice:</strong> All products are non-returnable. Please read our <Link to="/terms" style={{ color: '#008C95', fontWeight: '700', textDecoration: 'underline' }}>Terms and Conditions</Link> before proceeding.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
              <ShieldCheck size={16} color="#10B981" />
              <span>100% Secure Razorpay & UPI Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
