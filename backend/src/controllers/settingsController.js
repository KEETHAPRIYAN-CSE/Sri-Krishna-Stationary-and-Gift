import { db, isInitialized } from '../config/firebaseAdmin.js';

// Default store shipping settings
let storeSettings = {
  shipping: {
    defaultShippingCharge: 50,
    freeShippingThreshold: 499,
    enableFreeShipping: true,
    lastUpdated: new Date().toISOString()
  },
  store: {
    name: "Sri Krishna Stationery and Gift",
    address: "2/363 Sri Kumaran Complex, Siruvani Main Road, Kalampalayam, Coimbatore - 641010",
    phone: "+91 98765 43210",
    openingHours: "9:00 AM - 9:00 PM",
    noReturnPolicy: true
  }
};

export const getShippingSettings = async (req, res) => {
  try {
    if (isInitialized && db) {
      const doc = await db.collection('settings').doc('shipping').get();
      if (doc.exists) {
        return res.json({ success: true, shipping: doc.data() });
      }
    }
    return res.json({ success: true, shipping: storeSettings.shipping });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch shipping settings', error: error.message });
  }
};

export const updateShippingSettings = async (req, res) => {
  try {
    const { defaultShippingCharge, freeShippingThreshold, enableFreeShipping } = req.body;

    const updated = {
      defaultShippingCharge: Number(defaultShippingCharge) || 50,
      freeShippingThreshold: Number(freeShippingThreshold) || 499,
      enableFreeShipping: Boolean(enableFreeShipping),
      lastUpdated: new Date().toISOString(),
      updatedBy: req.user?.email || 'Admin'
    };

    if (isInitialized && db) {
      await db.collection('settings').doc('shipping').set(updated, { merge: true });
    }

    storeSettings.shipping = updated;

    return res.json({
      success: true,
      message: 'Shipping settings updated successfully',
      shipping: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update shipping settings', error: error.message });
  }
};

export const getStoreSettings = async (req, res) => {
  return res.json({ success: true, settings: storeSettings });
};
