import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', handleWebhook);

export default router;
