import { auth, isInitialized } from '../config/firebaseAdmin.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required.'
    });
  }

  const token = authHeader.split('Bearer ')[1].trim();

  try {
    if (isInitialized && auth) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || 'customer'
      };
      return next();
    }

    // Dev/Test Mode Token Verification
    if (token.startsWith('admin_session_') || token === 'demo_admin_token') {
      req.user = {
        uid: 'admin_demo_id',
        email: process.env.ADMIN_EMAIL || 'admin@srikrishnastationery.com',
        role: 'admin'
      };
      return next();
    }

    req.user = {
      uid: 'customer_demo_id',
      email: 'customer@srikrishnastationery.com',
      role: 'customer'
    };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      error: error.message
    });
  }
};
