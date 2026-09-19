import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  adjustStock,
  getProducts,
  getAuditLogs
} from '../controllers/productController.js';
import {
  updateOrderStatus,
  updateCourierTracking,
  getAllAdminOrders
} from '../controllers/orderController.js';
import { INITIAL_PRODUCTS } from '../utils/demoProductsData.js';
import { db, isInitialized } from '../config/firebaseAdmin.js';

const router = express.Router();

// Apply Auth and Admin checks to all admin routes
router.use(authMiddleware, adminMiddleware);

// Admin Product Management
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id/restore', restoreProduct);
router.put('/products/:id/stock', adjustStock);

// Admin Audit & Activity Logs
router.get('/audit-logs', getAuditLogs);

// Admin Order Management
router.get('/orders', getAllAdminOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/courier', updateCourierTracking);

// Admin Analytics KPIs (Phase 18)
router.get('/analytics', async (req, res) => {
  try {
    const totalProducts = INITIAL_PRODUCTS.length;
    const lowStock = INITIAL_PRODUCTS.filter(p => p.stock < 15).length;
    const revenue = 24890;
    const totalOrders = 52;
    const pendingOrders = 7;
    const totalCustomers = 38;

    return res.json({
      success: true,
      analytics: {
        totalProducts,
        totalOrders,
        pendingOrders,
        totalCustomers,
        revenue,
        lowStock
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Session Verify
router.get('/verify', (req, res) => {
  res.json({ success: true, user: req.user, message: 'Admin verified.' });
});

export default router;
