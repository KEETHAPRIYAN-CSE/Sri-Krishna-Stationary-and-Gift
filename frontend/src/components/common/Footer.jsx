import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, MessageCircle, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#03152D',
      color: '#CBD5E1',
      padding: '50px 0 20px',
      borderTop: '3px solid #D9A441'
    }}>
      <div className="sk-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img 
                src="/assets/logo.png" 
                alt="Logo" 
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #D9A441' }} 
              />
              <div>
                <h4 style={{ color: '#FAD678', fontSize: '18px', fontWeight: '800', fontFamily: 'Cinzel, serif', margin: 0 }}>
                  SRI KRISHNA
                </h4>
                <p style={{ color: '#14A3A8', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', margin: 0 }}>
                  STATIONERY AND GIFT
                </p>
              </div>
            </div>
            <p style={{ fontStyle: 'italic', fontSize: '13px', color: '#E2E8F0', marginBottom: '16px' }}>
              "Everything You Need, All in One Place!"
            </p>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#94A3B8' }}>
              Your neighborhood destination in Coimbatore for school and office stationery, art supplies, plush toys, fancy jewelry, and comfortable footwear.
            </p>
          </div>

          {/* Store Location & Timings */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              Visit Our Store
            </h4>
            <div style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
              <MapPin size={22} color="#D9A441" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                2/363 Sri Kumaran Complex,<br />
                Siruvani Main Road, Kalampalayam,<br />
                Coimbatore - 641010
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', marginBottom: '10px' }}>
              <Clock size={16} color="#008C95" />
              <span>Everyday: <strong>9:00 AM - 9:00 PM</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
              <Phone size={16} color="#008C95" />
              <span>+91 98765 43210</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              Shop Departments
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/gifts" style={{ color: '#CBD5E1', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#D9A441'} onMouseLeave={e => e.target.style.color = '#CBD5E1'}>Soft & Metal Toys (Gifts)</Link></li>
              <li><Link to="/slippers" style={{ color: '#CBD5E1', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#D9A441'} onMouseLeave={e => e.target.style.color = '#CBD5E1'}>Men, Women & Kids Slippers</Link></li>
              <li><Link to="/fancy-items" style={{ color: '#CBD5E1', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#D9A441'} onMouseLeave={e => e.target.style.color = '#CBD5E1'}>Jewelry & Cosmetics (Fancy Items)</Link></li>
              <li><Link to="/stationery" style={{ color: '#CBD5E1', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#D9A441'} onMouseLeave={e => e.target.style.color = '#CBD5E1'}>School & Office Stationery</Link></li>
              <li><Link to="/offers" style={{ color: '#CBD5E1', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#D9A441'} onMouseLeave={e => e.target.style.color = '#CBD5E1'}>Special Offers & Combos</Link></li>
            </ul>
          </div>

          {/* Customer Support & WhatsApp */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
              Instant Assistance
            </h4>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#94A3B8', marginBottom: '16px' }}>
              Have questions about product availability or bulk orders for schools/offices? Chat directly with us!
            </p>
            <a 
              href="https://wa.me/919876543210?text=Hello%20Sri%20Krishna%20Stationery%20and%20Gift" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sk-btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            >
              <MessageCircle size={18} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} Sri Krishna Stationery and Gift. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ color: '#94A3B8' }}>Contact Us</Link>
            <Link to="/cart" style={{ color: '#94A3B8' }}>Shopping Cart</Link>
            <Link to="/account" style={{ color: '#94A3B8' }}>Track Orders</Link>
            <Link to="/terms" style={{ color: '#D9A441', fontWeight: 600 }}>Terms & No Return Policy</Link>
            <Link to="/admin/login" style={{ color: '#94A3B8' }}>Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
