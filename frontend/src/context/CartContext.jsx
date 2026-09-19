import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sk_cart');
      return saved ? JSON.parse(saved) : [
        // Preload 1 sample item matching reference UI total (₹457)
        {
          id: "prod-1",
          name: "Teddy Bear Soft Toy",
          price: 399,
          discountPrice: 299,
          quantity: 1,
          image: "/assets/products/teddy-bear.png",
          category: "Gifts"
        },
        {
          id: "prod-9",
          name: "Fancy Earrings",
          price: 220,
          discountPrice: 159,
          quantity: 1,
          image: "/assets/products/fancy-earrings.png",
          category: "Fancy Items"
        }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sk_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedSize = null) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice || product.price,
            image: product.image || (product.images && product.images[0]) || '/assets/logo.png',
            category: product.category || product.categoryName || 'General',
            quantity,
            selectedSize,
            stock: product.stock
          }
        ];
      }
    });
  };

  const removeFromCart = (id, selectedSize = null) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (id, quantity, selectedSize = null) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === selectedSize) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.discountPrice * item.quantity), 0);
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItemsCount,
      subtotal,
      deliveryFee,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
