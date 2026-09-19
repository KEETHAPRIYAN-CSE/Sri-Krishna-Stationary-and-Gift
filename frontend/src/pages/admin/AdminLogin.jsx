import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { PageBanner } from '../../components/common/PageBanner';
import { useToast } from '../../context/ToastContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@srikrishnastationery.com');
  const [password, setPassword] = useState('KrishnaAdmin2026!');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend verification
    setTimeout(() => {
      localStorage.setItem('sk_admin_token', 'admin_session_' + Date.now());
      setLoading(false);
      addToast('Welcome back, Store Administrator!', 'success');
      navigate('/admin/dashboard');
    }, 800);
  };

  return (
    <div>
      <PageBanner 
        title="STAFF & ADMIN ACCESS" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Admin Login" }]} 
      />

      <div className="sk-container" style={{ padding: '60px 16px 100px', maxWidth: '440px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '36px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(6, 36, 74, 0.08)',
            color: '#06244A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <ShieldCheck size={32} color="#008C95" />
          </div>

          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
            Store Management Portal
          </h2>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '24px' }}>
            Sri Krishna Stationery and Gift Backoffice
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className="sk-btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '10px' }}
            >
              <span>{loading ? "Authenticating..." : "LOGIN TO DASHBOARD"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
            Demo mode active: Pre-filled with secure demo admin credentials.
          </div>
        </div>
      </div>
    </div>
  );
};
