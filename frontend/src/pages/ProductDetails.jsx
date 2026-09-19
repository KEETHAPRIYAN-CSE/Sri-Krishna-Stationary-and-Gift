import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, MessageCircle, Star, ShieldCheck, ArrowLeft, Check } from 'lucide-react';
import { DEMO_PRODUCTS } from '../utils/demoProducts';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const product = DEMO_PRODUCTS.find(p => p.id === id || p.slug === id) || DEMO_PRODUCTS[0];
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [added, setAdded] = useState(false);

  const relatedProducts = DEMO_PRODUCTS.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 6);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAdded(true);
    addToast(`${product.name} (${quantity}) added to cart!`, 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    navigate('/checkout');
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={{ padding: '30px 0 60px', backgroundColor: '#F8FAFC' }}>
      <div className="sk-container">
        {/* Back Link */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#008C95' }}>
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>

        {/* Main Product Box */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '48px'
        }}>
          {/* Left: Image Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #F1F5F9',
            padding: '24px',
            minHeight: '380px'
          }}>
            <img 
              src={product.image || '/assets/logo.png'} 
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }}
            />
          </div>

          {/* Right: Info Box */}
          <div>
            <div style={{ display: 'inline-block', background: '#E6F7F8', color: '#008C95', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '10px' }}>
              {product.category} &gt; {product.subcategory || 'General'}
            </div>

            <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '26px', fontWeight: '800', color: '#06244A', marginBottom: '12px' }}>
              {product.name}
            </h1>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '4px', fontSize: '12.5px', fontWeight: '700' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>{product.rating || 4.8}</span>
              </div>
              <span style={{ fontSize: '13px', color: '#64748B' }}>({product.reviewCount || 40} verified reviews)</span>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '32px', fontWeight: '900', color: '#06244A' }}>
                ₹{product.discountPrice || product.price}
              </span>
              {product.price > product.discountPrice && (
                <>
                  <span style={{ fontSize: '18px', color: '#94A3B8', textDecoration: 'line-through' }}>
                    ₹{product.price}
                  </span>
                  <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '800' }}>
                    Save ₹{product.price - product.discountPrice}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Sizes Selection (if applicable) */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                  Select Size:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: selectedSize === size ? '2px solid #008C95' : '1px solid #CBD5E1',
                        background: selectedSize === size ? '#E6F7F8' : 'white',
                        color: selectedSize === size ? '#008C95' : '#1E293B',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '26px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
                  Quantity:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ padding: '6px 14px', background: '#F1F5F9', fontSize: '16px', fontWeight: 'bold' }}
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span style={{ padding: '6px 16px', fontWeight: '700', fontSize: '14px' }}>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock || 20, q + 1))}
                    style={{ padding: '6px 14px', background: '#F1F5F9', fontSize: '16px', fontWeight: 'bold' }}
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
                  Availability:
                </label>
                {isOutOfStock ? (
                  <span style={{ color: '#EF4444', fontWeight: '700', fontSize: '13px' }}>Out of Stock</span>
                ) : (
                  <span style={{ color: '#10B981', fontWeight: '700', fontSize: '13px' }}>
                    In Stock ({product.stock} units left)
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <button 
                className="sk-btn-primary" 
                style={{ flex: 1, minWidth: '160px', padding: '12px 20px', fontSize: '14px' }}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {added ? <Check size={18} color="#10B981" /> : <ShoppingCart size={18} />}
                <span>{added ? "Added to Cart" : "ADD TO CART"}</span>
              </button>

              <button 
                className="sk-btn-gold" 
                style={{ flex: 1, minWidth: '160px', padding: '12px 20px', fontSize: '14px' }}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                <Zap size={18} />
                <span>BUY NOW</span>
              </button>
            </div>

            {/* WhatsApp Ordering (Phase N) */}
            <a 
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello Sri Krishna Stationery & Gift,\n\nI am interested in:\n\nProduct:\n${product.name}\n\nProduct ID:\n${product.sku || product.id}\n\nQuantity:\n${quantity}${selectedSize ? `\n\nSize:\n${selectedSize}` : ''}\n\nPrice:\n₹${product.discountPrice || product.price}\n\nPlease provide availability and order details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#25D366',
                color: 'white',
                fontWeight: '700',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                boxShadow: 'var(--shadow-sm)',
                width: '100%'
              }}
            >
              <MessageCircle size={18} />
              <span>ORDER ON WHATSAPP</span>
            </a>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '22px', fontWeight: '800', marginBottom: '20px' }}>
              YOU MAY ALSO LIKE
            </h2>
            <div className="sk-products-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
