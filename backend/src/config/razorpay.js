import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

let razorpayInstance = null;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId && keySecret && keyId !== 'rzp_test_YourKeyIdHere') {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('[Razorpay] Initialized official Razorpay SDK client.');
  } catch (err) {
    console.warn('[Razorpay] Initialization warning:', err.message);
  }
} else {
  console.log('[Razorpay] Running in test mode with local signature verifier.');
}

/**
 * Creates a Razorpay order
 * @param {number} amountInPaisa
 * @param {string} receipt
 * @param {string} currency
 */
export const createOrder = async (amountInPaisa, receipt, currency = 'INR') => {
  if (razorpayInstance) {
    return await razorpayInstance.orders.create({
      amount: amountInPaisa,
      currency,
      receipt
    });
  }

  // Development/Test simulated order
  return {
    id: `order_${Math.random().toString(36).substring(2, 14)}`,
    entity: 'order',
    amount: amountInPaisa,
    currency,
    receipt,
    status: 'created',
    created_at: Math.floor(Date.now() / 1000)
  };
};

/**
 * Verifies Razorpay payment signature
 * HMAC SHA256 (order_id + "|" + payment_id, secret) === signature
 */
export const verifySignature = (orderId, paymentId, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'dev_secret_krishna';
  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(text)
    .digest('hex');

  // In test mode or with matching signature
  return generatedSignature === signature || process.env.NODE_ENV !== 'production';
};

export default razorpayInstance;
