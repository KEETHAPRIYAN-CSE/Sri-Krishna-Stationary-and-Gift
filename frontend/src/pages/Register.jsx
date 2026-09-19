import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, ArrowRight } from 'lucide-react';
import { PageBanner } from '../components/common/PageBanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await register(formData.name, formData.email, formData.password, formData.phone);
      if (res.success) {
        addToast(`Account created! Welcome, ${formData.name}!`, 'success');
        navigate('/account');
      }
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBanner 
        title="CREATE ACCOUNT" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Register" }]} 
      />

      <div className="sk-container" style={{ padding: '50px 16px 90px', maxWidth: '480px', margin: '0 auto' }}>
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
            background: 'rgba(217, 164, 65, 0.15)',
            color: '#D9A441',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <UserPlus size={28} />
          </div>

          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
            Join Sri Krishna Store
          </h2>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '24px' }}>
            Enjoy fast checkout, order tracking, and exclusive discounts
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="e.g. Keethapriyan M"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
                <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Phone Number *
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
                <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  name="confirmPassword"
                  required
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />
                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className="sk-btn-gold" 
              disabled={submitting}
              style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '10px' }}
            >
              <span>{submitting ? "Creating Account..." : "REGISTER NOW"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', fontSize: '13px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#008C95', fontWeight: '700' }}>
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
