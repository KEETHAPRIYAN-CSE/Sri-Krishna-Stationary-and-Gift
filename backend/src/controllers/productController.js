import { db, isInitialized } from '../config/firebaseAdmin.js';
import { INITIAL_PRODUCTS } from '../utils/demoProductsData.js';

let localProducts = [...INITIAL_PRODUCTS];

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      search,
      sort = 'popularity',
      page = 1,
      limit = 24
    } = req.query;

    let products = [];

    if (isInitialized && db) {
      let query = db.collection('products').where('active', '==', true);

      if (category && category !== 'all') {
        query = query.where('categoryId', '==', category);
      }

      const snapshot = await query.get();
      products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      products = [...localProducts];
    }

    // Filter by Category
    if (category && category !== 'all') {
      products = products.filter(p => p.categoryId === category);
    }

    // Filter by Subcategory
    if (subcategory) {
      products = products.filter(p => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
    }

    // Filter by Price
    if (minPrice) {
      products = products.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
    }

    // Search query
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Sorting
    products.sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sort === 'price-low') return priceA - priceB;
      if (sort === 'price-high') return priceB - priceA;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return (b.rating || 0) - (a.rating || 0); // default: popularity
    });

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      total: products.length,
      page: pageNum,
      totalPages: Math.ceil(products.length / limitNum),
      products: paginatedProducts
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInitialized && db) {
      const doc = await db.collection('products').doc(id).get();
      if (doc.exists) {
        return res.json({ success: true, product: { id: doc.id, ...doc.data() } });
      }
    }

    const found = localProducts.find(p => p.id === id || p.slug === id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, product: found });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  req.query.category = req.params.category;
  return getProducts(req, res);
};

export const searchProducts = async (req, res) => {
  req.query.search = req.query.q;
  return getProducts(req, res);
};


// Activity & Audit log store
export let auditLogs = [
  {
    id: 'log-1',
    adminId: 'admin@srikrishnastationery.com',
    action: 'SYSTEM_STARTUP',
    entity: 'SYSTEM',
    entityId: 'SYS',
    details: 'Sri Krishna Stationery & Gift E-commerce Engine running',
    timestamp: new Date().toISOString()
  }
];

export const addAuditLog = (adminId, action, entity, entityId, details) => {
  const entry = {
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    adminId: adminId || 'admin@srikrishnastationery.com',
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString()
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 200) auditLogs.pop();
  return entry;
};

export const getAuditLogs = async (req, res) => {
  return res.json({ success: true, logs: auditLogs });
};

// --- ADMIN MUTATIONS ---
export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const price = Number(data.price) || 0;
    let discountPrice = price;

    if (data.discountType === 'percentage' && data.discountValue > 0) {
      discountPrice = Math.max(0, Math.round(price - (price * Number(data.discountValue)) / 100));
    } else if (data.discountType === 'fixed' && data.discountValue > 0) {
      discountPrice = Math.max(0, price - Number(data.discountValue));
    } else if (data.discountPrice) {
      discountPrice = Number(data.discountPrice);
    }

    const newProduct = {
      ...data,
      id: 'prod-' + Date.now(),
      price,
      discountPrice,
      stock: Number(data.stock) || 0,
      active: true,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    if (isInitialized && db) {
      const ref = await db.collection('products').add(newProduct);
      newProduct.id = ref.id;
    }

    localProducts.unshift(newProduct);
    addAuditLog(req.user?.email, 'PRODUCT_ADDED', 'PRODUCT', newProduct.id, `Added product: ${newProduct.name}`);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = localProducts.find(p => p.id === id);
    const price = data.price !== undefined ? Number(data.price) : (existing?.price || 0);
    let discountPrice = price;

    if (data.discountType === 'percentage' && data.discountValue > 0) {
      discountPrice = Math.max(0, Math.round(price - (price * Number(data.discountValue)) / 100));
    } else if (data.discountType === 'fixed' && data.discountValue > 0) {
      discountPrice = Math.max(0, price - Number(data.discountValue));
    } else if (data.discountPrice !== undefined) {
      discountPrice = Number(data.discountPrice);
    }

    const updateData = {
      ...data,
      price,
      discountPrice,
      stock: data.stock !== undefined ? Number(data.stock) : existing?.stock,
      updatedAt: new Date().toISOString()
    };

    if (isInitialized && db) {
      await db.collection('products').doc(id).update(updateData);
    }

    localProducts = localProducts.map(p => p.id === id ? { ...p, ...updateData } : p);
    addAuditLog(req.user?.email, 'PRODUCT_EDITED', 'PRODUCT', id, `Updated product details: ${data.name || id}`);

    return res.json({ success: true, message: 'Product updated successfully', product: updateData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// Soft Delete (Deactivate)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInitialized && db) {
      await db.collection('products').doc(id).update({ active: false, updatedAt: new Date().toISOString() });
    }

    localProducts = localProducts.map(p => p.id === id ? { ...p, active: false } : p);
    addAuditLog(req.user?.email, 'PRODUCT_DEACTIVATED', 'PRODUCT', id, `Soft-deleted product ID: ${id}`);

    return res.json({ success: true, message: 'Product removed from store catalog (soft deleted).' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};

// Restore Soft-Deleted Product
export const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isInitialized && db) {
      await db.collection('products').doc(id).update({ active: true, updatedAt: new Date().toISOString() });
    }

    localProducts = localProducts.map(p => p.id === id ? { ...p, active: true } : p);
    addAuditLog(req.user?.email, 'PRODUCT_RESTORED', 'PRODUCT', id, `Restored product ID: ${id}`);

    return res.json({ success: true, message: 'Product restored successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error restoring product', error: error.message });
  }
};

// Inventory Stock Adjustment with Audit
export const adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStock, change, reason } = req.body;

    const prod = localProducts.find(p => p.id === id);
    if (!prod) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const previousStock = prod.stock || 0;
    const targetStock = newStock !== undefined ? Number(newStock) : Math.max(0, previousStock + Number(change || 0));

    if (targetStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock quantity cannot be negative.' });
    }

    if (isInitialized && db) {
      await db.collection('products').doc(id).update({
        stock: targetStock,
        updatedAt: new Date().toISOString()
      });
    }

    localProducts = localProducts.map(p => p.id === id ? { ...p, stock: targetStock } : p);

    const logDetails = `Stock changed from ${previousStock} to ${targetStock} (${targetStock - previousStock >= 0 ? '+' : ''}${targetStock - previousStock}). Reason: ${reason || 'Inventory adjustment'}`;
    addAuditLog(req.user?.email, 'STOCK_CHANGED', 'INVENTORY', id, logDetails);

    return res.json({
      success: true,
      message: 'Stock updated successfully',
      stock: targetStock,
      previousStock,
      reason
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating stock', error: error.message });
  }
};

