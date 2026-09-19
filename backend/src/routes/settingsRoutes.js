import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
  getShippingSettings,
  updateShippingSettings,
  getStoreSettings
} from '../controllers/settingsController.js';

const router = express.Router();

// Publicly readable for customer checkout calculation
router.get('/shipping', getShippingSettings);
router.get('/store', getStoreSettings);

// Admin-only updates
router.put('/shipping', authMiddleware, adminMiddleware, updateShippingSettings);

export default router;
