import React, { useState } from 'react';
import { MapPin, Clock, Phone, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { PageBanner } from '../components/common/PageBanner';
import { useToast } from '../context/ToastContext';

export const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    addToast('Thank you! Your message has been sent to Sri Krishna team.', 'success');
  };

  return (
    <div>
      <PageBanner 
        title="VISIT & CONTACT US" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Contact" }]} 
      />

      <div className="sk-container" style={{ padding: '50px 16px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Store Details Card */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>
              Sri Krishna Stationery & Gift
            </h2>
            <p style={{ fontStyle: 'italic', color: '#008C95', fontWeight: '600', marginBottom: '24px', fontSize: '13px' }}>
              "Everything You Need, All in One Place!"
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px', color: '#334155' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <MapPin size={24} color="#D9A441" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#06244A', display: 'block', marginBottom: '2px' }}>Store Address:</strong>
                  2/363 Sri Kumaran Complex,<br />
                  Siruvani Main Road, Kalampalayam,<br />
                  Coimbatore - 641010, Tamil Nadu
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <Clock size={20} color="#008C95" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#06244A', display: 'block', marginBottom: '2px' }}>Operating Hours:</strong>
                  Monday to Sunday: <strong>9:00 AM - 9:00 PM</strong><br />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Open all 7 days for students and families</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <Phone size={20} color="#008C95" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#06244A', display: 'block', marginBottom: '2px' }}>Call Us:</strong>
                  +91 98765 43210
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <MessageCircle size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#06244A', display: 'block', marginBottom: '2px' }}>WhatsApp Orders:</strong>
                  +91 98765 43210 (Instant response during store hours)
                </div>
              </div>
            </div>

            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
              <a 
                href="https://wa.me/919876543210?text=Hello%20Sri%20Krishna%20Stationery%20and%20Gift"
                target="_blank"
                rel="noopener noreferrer"
                className="sk-btn-whatsapp"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '8px' }}
              >
                <MessageCircle size={20} />
                <span>Chat with Store Manager on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Send Message Form */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#06244A', marginBottom: '16px' }}>
              Send an Inquiry or Feedback
            </h2>

            {sent ? (
              <div style={{ padding: '30px', textAlign: 'center', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                <CheckCircle2 size={40} color="#16A34A" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#166534', fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>Message Received!</h3>
                <p style={{ color: '#15803D', fontSize: '13.5px' }}>We will contact you shortly regarding your inquiry.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Your Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Message or Inquiry *</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={formData.message} 
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ask about school supplies, bulk discounts, toy availability..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }} 
                  />
                </div>

                <button type="submit" className="sk-btn-primary" style={{ padding: '12px 20px' }}>
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
