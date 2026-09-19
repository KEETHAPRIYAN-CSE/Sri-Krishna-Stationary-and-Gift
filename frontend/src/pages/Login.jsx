import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { PageBanner } from '../components/common/PageBanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.displayName || 'Customer'}!`, 'success');
        navigate(from, { replace: true });
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBanner 
        title="CUSTOMER LOGIN" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Login" }]} 
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
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(0, 140, 149, 0.1)',
            color: '#008C95',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <LogIn size={28} />
          </div>

          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
            Sign In to Your Account
          </h2>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '24px' }}>
            Track orders, view past purchases, and manage delivery addresses
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: '12px', color: '#008C95', fontWeight: '600' }}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
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
              disabled={submitting}
              style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '10px' }}
            >
              <span>{submitting ? "Signing in..." : "LOG IN"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', fontSize: '13px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#008C95', fontWeight: '700' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
