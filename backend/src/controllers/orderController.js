import { db, isInitialized } from '../config/firebaseAdmin.js';
import { INITIAL_PRODUCTS } from '../utils/demoProductsData.js';

let localOrders = [];

export const createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod = 'RAZORPAY' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to create an order.' });
    }

    if (!address || !address.fullName || !address.phone || !address.pincode) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
    }

    // SERVER-SIDE PRICE AND STOCK VALIDATION (Never trust frontend prices!)
    let validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      let product = null;

      if (isInitialized && db) {
        const doc = await db.collection('products').doc(item.id).get();
        if (doc.exists) product = doc.data();
      }

      if (!product) {
        product = INITIAL_PRODUCTS.find(p => p.id === item.id);
      }

      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.id} not found in store catalog.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
      }

      const verifiedPrice = product.discountPrice || product.price;
      subtotal += verifiedPrice * item.quantity;

      validatedItems.push({
        productId: item.id,
        name: product.name,
        price: verifiedPrice,
        quantity: item.quantity,
        thumbnail: product.image || product.thumbnail,
        selectedSize: item.selectedSize || null
      });
    }

    // Dynamic shipping calculation
    let defaultShipping = 50;
    let freeThreshold = 499;
    let enableFreeShipping = true;

    try {
      if (isInitialized && db) {
        const shipDoc = await db.collection('settings').doc('shipping').get();
        if (shipDoc.exists) {
          const shipData = shipDoc.data();
          defaultShipping = shipData.defaultShippingCharge ?? 50;
          freeThreshold = shipData.freeShippingThreshold ?? 499;
          enableFreeShipping = shipData.enableFreeShipping ?? true;
        }
      }
    } catch (e) {}

    const deliveryFee = (enableFreeShipping && subtotal >= freeThreshold) ? 0 : defaultShipping;
    const total = subtotal + deliveryFee;

    const orderNumber = 'SK-' + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toISOString();

    const newOrder = {
      orderNumber,
      userId: req.user ? req.user.uid : 'guest_customer',
      items: validatedItems,
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
      orderStatus: 'PLACED',
      termsAccepted: Boolean(req.body.termsAccepted),
      termsAcceptedAt: req.body.termsAcceptedAt || timestamp,
      courierDetails: {
        courierName: '',
        trackingNumber: '',
        shippingDate: '',
        expectedDeliveryDate: '',
        trackingUrl: ''
      },
      statusHistory: [
        { status: 'PLACED', timestamp, note: 'Order placed by customer with No Return Policy acceptance', updatedBy: 'System' }
      ],
      createdAt: timestamp,
      updatedAt: timestamp
    };

    if (isInitialized && db) {
      const docRef = await db.collection('orders').add(newOrder);
      newOrder.id = docRef.id;
    } else {
      newOrder.id = orderNumber;
    }

    localOrders.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user.uid : 'customer_demo_id';

    if (isInitialized && db) {
      const snapshot = await db.collection('orders').where('userId', '==', userId).get();
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, orders });
    }

    const orders = localOrders.filter(o => o.userId === userId || userId === 'customer_demo_id');
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInitialized && db) {
      const doc = await db.collection('orders').doc(id).get();
      if (doc.exists) return res.json({ success: true, order: { id: doc.id, ...doc.data() } });
    }

    const order = localOrders.find(o => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving order', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const allowedStatuses = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status specified.' });
    }

    const historyEntry = {
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`,
      updatedBy: req.user ? req.user.email : 'Admin'
    };

    if (isInitialized && db) {
      await db.collection('orders').doc(id).update({
        orderStatus: status,
        statusHistory: admin.firestore.FieldValue.arrayUnion(historyEntry),
        updatedAt: new Date().toISOString()
      });
    }

    localOrders = localOrders.map(o => {
      if (o.id === id || o.orderNumber === id) {
        return {
          ...o,
          orderStatus: status,
          statusHistory: [...(o.statusHistory || []), historyEntry],
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });

    return res.json({ success: true, message: `Order status updated to ${status}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
};

// Admin: Update Courier Tracking Information
export const updateCourierTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      courierName,
      trackingNumber,
      shippingDate,
      expectedDeliveryDate,
      trackingUrl
    } = req.body;

    const courierDetails = {
      courierName: courierName || '',
      trackingNumber: trackingNumber || '',
      shippingDate: shippingDate || new Date().toISOString(),
      expectedDeliveryDate: expectedDeliveryDate || '',
      trackingUrl: trackingUrl || (courierName?.toLowerCase().includes('dtdc') ? `https://www.dtdc.in/tracking/shipment-tracking.asp` : '')
    };

    const historyEntry = {
      status: 'SHIPPED',
      timestamp: new Date().toISOString(),
      note: `Courier dispatched via ${courierName || 'Partner'} - AWB/Tracking #${trackingNumber || 'N/A'}`,
      updatedBy: req.user ? req.user.email : 'Admin'
    };

    if (isInitialized && db) {
      await db.collection('orders').doc(id).update({
        courierDetails,
        orderStatus: 'SHIPPED',
        statusHistory: admin.firestore.FieldValue.arrayUnion(historyEntry),
        updatedAt: new Date().toISOString()
      });
    }

    localOrders = localOrders.map(o => {
      if (o.id === id || o.orderNumber === id) {
        return {
          ...o,
          orderStatus: 'SHIPPED',
          courierDetails,
          statusHistory: [...(o.statusHistory || []), historyEntry],
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });

    return res.json({
      success: true,
      message: 'Courier tracking details updated successfully',
      courierDetails
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update courier tracking', error: error.message });
  }
};

// Admin: Get All Orders with Filters
export const getAllAdminOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let orders = [];

    if (isInitialized && db) {
      const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
      orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      orders = [...localOrders];
    }

    if (status && status !== 'ALL') {
      orders = orders.filter(o => o.orderStatus?.toUpperCase() === status.toUpperCase());
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.address?.fullName?.toLowerCase().includes(q) ||
        o.address?.phone?.toLowerCase().includes(q) ||
        o.courierDetails?.trackingNumber?.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, orders, total: orders.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch admin orders', error: error.message });
  }
};

