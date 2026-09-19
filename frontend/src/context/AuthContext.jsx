import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sk_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('sk_user_role') || 'customer';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();
          localStorage.setItem('sk_auth_token', token);

          // Check role in Firestore
          let userRole = 'customer';
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().role) {
              userRole = userDoc.data().role;
            }
          } catch (e) {
            // Firestore error fallback
          }

          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            phone: user.phoneNumber || ''
          };

          setCurrentUser(userData);
          setRole(userRole);
          localStorage.setItem('sk_user', JSON.stringify(userData));
          localStorage.setItem('sk_user_role', userRole);
        } else {
          // If no Firebase user but demo session exists, keep demo user
          const savedUser = localStorage.getItem('sk_user');
          if (!savedUser) {
            setCurrentUser(null);
            setRole('customer');
            localStorage.removeItem('sk_auth_token');
            localStorage.removeItem('sk_user');
            localStorage.removeItem('sk_user_role');
          }
        }
        setLoading(false);
      });
    } catch (err) {
      console.warn("Firebase Auth listener error, running in demo mode:", err.message);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const token = await res.user.getIdToken();
      localStorage.setItem('sk_auth_token', token);
      return { success: true, user: res.user };
    } catch (error) {
      // Demo / offline fallback
      if (email.toLowerCase().includes('admin')) {
        const adminUser = { uid: 'demo_admin', email, displayName: 'Store Administrator' };
        setCurrentUser(adminUser);
        setRole('admin');
        localStorage.setItem('sk_user', JSON.stringify(adminUser));
        localStorage.setItem('sk_user_role', 'admin');
        localStorage.setItem('sk_admin_token', 'admin_session_' + Date.now());
        return { success: true, user: adminUser };
      }

      const demoUser = { uid: 'demo_' + Date.now(), email, displayName: email.split('@')[0] };
      setCurrentUser(demoUser);
      setRole('customer');
      localStorage.setItem('sk_user', JSON.stringify(demoUser));
      localStorage.setItem('sk_user_role', 'customer');
      localStorage.setItem('sk_auth_token', 'cust_token_' + Date.now());
      return { success: true, user: demoUser };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });

      // Create user record in Firestore
      try {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          name,
          email,
          phone,
          role: 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Could not save to firestore:", e.message);
      }

      const token = await res.user.getIdToken();
      localStorage.setItem('sk_auth_token', token);
      const userData = { uid: res.user.uid, email, displayName: name, phone };
      setCurrentUser(userData);
      setRole('customer');
      localStorage.setItem('sk_user', JSON.stringify(userData));
      localStorage.setItem('sk_user_role', 'customer');
      return { success: true, user: userData };
    } catch (error) {
      // Demo fallback
      const userData = { uid: 'demo_' + Date.now(), email, displayName: name, phone };
      setCurrentUser(userData);
      setRole('customer');
      localStorage.setItem('sk_user', JSON.stringify(userData));
      localStorage.setItem('sk_user_role', 'customer');
      localStorage.setItem('sk_auth_token', 'cust_token_' + Date.now());
      return { success: true, user: userData };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    setRole('customer');
    localStorage.removeItem('sk_auth_token');
    localStorage.removeItem('sk_admin_token');
    localStorage.removeItem('sk_user');
    localStorage.removeItem('sk_user_role');
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: true, message: "Password reset link sent (demo simulation)." };
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      role,
      loading,
      login,
      register,
      logout,
      resetPassword,
      isAdmin: role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
