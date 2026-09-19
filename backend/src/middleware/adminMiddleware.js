import { db, isInitialized } from '../config/firebaseAdmin.js';

export const adminMiddleware = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required before admin verification.'
    });
  }

  // If token already has admin role
  if (req.user.role === 'admin') {
    return next();
  }

  // Check email against ADMIN_EMAIL env
  if (process.env.ADMIN_EMAIL && req.user.email === process.env.ADMIN_EMAIL) {
    req.user.role = 'admin';
    return next();
  }

  // If live Firestore is available, check users collection
  if (isInitialized && db) {
    try {
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      if (userDoc.exists && userDoc.data().role === 'admin') {
        req.user.role = 'admin';
        return next();
      }
    } catch (e) {
      console.warn('[AdminMiddleware] Error checking Firestore user role:', e.message);
    }
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. Administrator privileges required.'
  });
};
