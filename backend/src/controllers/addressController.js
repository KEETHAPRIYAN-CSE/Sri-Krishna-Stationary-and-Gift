import { db, isInitialized } from '../config/firebaseAdmin.js';

let localAddresses = [
  {
    id: "addr-1",
    userId: "customer_demo_id",
    fullName: "Keethapriyan M",
    phone: "9876543210",
    addressLine1: "Flat 4A, Green Meadows Apartments",
    addressLine2: "Near Siruvani Main Road",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641010",
    landmark: "Opposite Sri Kumaran Complex",
    instructions: "Please call before delivery",
    isDefault: true,
    createdAt: new Date().toISOString()
  }
];

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user ? req.user.uid : 'customer_demo_id';

    if (isInitialized && db) {
      const snapshot = await db.collection('addresses').where('userId', '==', userId).get();
      const addresses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, addresses });
    }

    const addresses = localAddresses.filter(a => a.userId === userId || userId === 'customer_demo_id');
    return res.json({ success: true, addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch addresses', error: error.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const userId = req.user ? req.user.uid : 'customer_demo_id';
    const data = req.body;

    const newAddress = {
      ...data,
      id: 'addr-' + Date.now(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isInitialized && db) {
      const docRef = await db.collection('addresses').add(newAddress);
      newAddress.id = docRef.id;
    }

    localAddresses.push(newAddress);

    return res.status(201).json({ success: true, message: 'Address created', address: newAddress });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save address', error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isInitialized && db) {
      await db.collection('addresses').doc(id).update({ ...data, updatedAt: new Date().toISOString() });
    }

    localAddresses = localAddresses.map(a => a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a);

    return res.json({ success: true, message: 'Address updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update address', error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInitialized && db) {
      await db.collection('addresses').doc(id).delete();
    }

    localAddresses = localAddresses.filter(a => a.id !== id);

    return res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete address', error: error.message });
  }
};
