import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    addToast(`${product.name} added to your cart!`, 'success');
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const finalPrice = product.discountPrice || product.price;
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
    const message = `Hello Sri Krishna Stationery & Gift,\n\nI am interested in:\n\nProduct:\n${product.name}\n\nProduct ID / SKU:\n${product.sku || product.id}\n\nQuantity:\n1\n\nPrice:\n₹${finalPrice}\n\nPlease provide availability and order details.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.price > (product.discountPrice || product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="sk-product-card">
      <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div className="sk-card-image-wrap">
          <img 
            src={product.image || (product.images && product.images[0]) || '/assets/logo.png'} 
            alt={product.name}
            className="sk-card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/logo.png';
            }}
          />

          {/* Out of stock badge */}
          {isOutOfStock && (
            <span style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: '#EF4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              OUT OF STOCK
            </span>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#D9A441',
              color: '#06244A',
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 6px',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}>
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <h3 className="sk-card-title" title={product.name}>
          {product.name}
        </h3>

        <div className="sk-card-price" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>₹{product.discountPrice || product.price}</span>
          {hasDiscount && (
            <span style={{ fontSize: '11.5px', color: '#94A3B8', textDecoration: 'line-through', fontWeight: 'normal' }}>
              ₹{product.price}
            </span>
          )}
          {hasDiscount && (
            <span style={{ fontSize: '11px', color: '#166534', fontWeight: '800' }}>
              ({discountPercent}% OFF)
            </span>
          )}
        </div>

        <div className="sk-card-category">
          {product.category || product.categoryName}
        </div>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto', paddingTop: '8px' }}>
        <button 
          className="sk-card-btn" 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          title={isOutOfStock ? "Item currently out of stock" : "Add to Cart"}
          style={{ width: '100%' }}
        >
          {added ? (
            <>
              <Check size={14} color="#10B981" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </>
          )}
        </button>

        <button 
          onClick={handleWhatsAppOrder}
          title="Inquire or Order directly through WhatsApp"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: '#25D366',
            color: 'white',
            border: 'none',
            padding: '7px 10px',
            borderRadius: '4px',
            fontSize: '11.5px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
            width: '100%'
          }}
        >
          <MessageCircle size={13} />
          <span>Order on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
