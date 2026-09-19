import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminRoute = ({ children }) => {
  const { role, loading } = useAuth();
  const [backendVerified, setBackendVerified] = useState(null);

  useEffect(() => {
    const verifyWithBackend = async () => {
      try {
        const res = await api.get('/admin/verify');
        if (res.data?.success) {
          setBackendVerified(true);
        } else {
          setBackendVerified(false);
        }
      } catch (err) {
        // If token in localStorage is admin_session, allow
        const token = localStorage.getItem('sk_admin_token');
        if (token && token.startsWith('admin_session_')) {
          setBackendVerified(true);
        } else {
          setBackendVerified(false);
        }
      }
    };

    verifyWithBackend();
  }, []);

  if (loading || backendVerified === null) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#06244A', fontWeight: 600 }}>
        Verifying administrator privileges...
      </div>
    );
  }

  if (role !== 'admin' && !backendVerified) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
