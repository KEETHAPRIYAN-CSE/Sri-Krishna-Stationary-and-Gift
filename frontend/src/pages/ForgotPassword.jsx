import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PageBanner } from '../components/common/PageBanner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      addToast('Password reset link has been sent to your email!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to send reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBanner 
        title="RESET PASSWORD" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Forgot Password" }]} 
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
            <KeyRound size={28} />
          </div>

          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
            Recover Your Password
          </h2>
          <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '24px' }}>
            Enter your registered email and we'll send you instructions to reset your password.
          </p>

          {submitted ? (
            <div style={{ padding: '20px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
              <CheckCircle2 size={32} color="#16A34A" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '13.5px', color: '#166534', fontWeight: '600' }}>
                Password reset instructions sent to <strong>{email}</strong>.
              </p>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '13px', color: '#008C95', fontWeight: '700' }}>
                <ArrowLeft size={16} /> Return to Login
              </Link>
            </div>
          ) : (
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

              <button 
                type="submit" 
                className="sk-btn-primary" 
                disabled={loading}
                style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '10px' }}
              >
                <span>{loading ? "Sending..." : "SEND RESET LINK"}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Link to="/login" style={{ fontSize: '12.5px', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
