import { createOrder as rzpCreateOrder, verifySignature } from '../config/razorpay.js';
import { db, isInitialized } from '../config/firebaseAdmin.js';
import { INITIAL_PRODUCTS } from '../utils/demoProductsData.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items required for order creation.' });
    }

    // SERVER-SIDE RE-CALCULATION OF EXACT ORDER TOTAL IN PAISA
    let subtotal = 0;
    for (const item of items) {
      const product = INITIAL_PRODUCTS.find(p => p.id === item.id);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.id} not found.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Item "${product.name}" out of stock.` });
      }
      const itemPrice = product.discountPrice || product.price;
      subtotal += itemPrice * item.quantity;
    }

    // Dynamic shipping configuration
    let defaultShipping = 50;
    let freeThreshold = 499;
    let enableFreeShipping = true;
    try {
      if (isInitialized && db) {
        const shipDoc = await db.collection('settings').doc('shipping').get();
        if (shipDoc.exists) {
          const s = shipDoc.data();
          defaultShipping = s.defaultShippingCharge ?? 50;
          freeThreshold = s.freeShippingThreshold ?? 499;
          enableFreeShipping = s.enableFreeShipping ?? true;
        }
      }
    } catch (e) {}

    const deliveryFee = (enableFreeShipping && subtotal >= freeThreshold) ? 0 : defaultShipping;
    const finalTotal = subtotal + deliveryFee;
    const amountInPaisa = finalTotal * 100; // Razorpay expects paisa

    const receipt = `sk_rcpt_${Date.now()}`;
    const rzpOrder = await rzpCreateOrder(amountInPaisa, receipt, 'INR');

    return res.json({
      success: true,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere',
      receipt
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create Razorpay order', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay signature verification parameters.' });
    }

    const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed. Tampered transaction.' });
    }

    // Update order in Firestore if connected
    if (isInitialized && db && orderId) {
      await db.collection('orders').doc(orderId).update({
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
        razorpayOrderId,
        razorpayPaymentId,
        updatedAt: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      message: 'Payment verified and captured successfully',
      paymentId: razorpayPaymentId,
      status: 'PAID'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const event = req.body.event;
    console.log('[Razorpay Webhook Received]:', event);

    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload.payment.entity;
      console.log(`[Razorpay Webhook] Payment captured: ${paymentEntity.id} for amount ${paymentEntity.amount / 100} INR`);
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
