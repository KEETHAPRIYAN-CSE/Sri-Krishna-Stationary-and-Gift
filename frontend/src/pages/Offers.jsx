import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, BookOpen, Gift, Percent, ArrowRight } from 'lucide-react';
import { PageBanner } from '../components/common/PageBanner';
import { ProductCard } from '../components/product/ProductCard';
import { DEMO_PRODUCTS } from '../utils/demoProducts';

export const Offers = () => {
  const stationeryCombos = DEMO_PRODUCTS.filter(p => p.categoryId === 'stationery').slice(0, 6);
  const giftCombos = DEMO_PRODUCTS.filter(p => p.categoryId === 'gifts').slice(0, 6);

  return (
    <div>
      <PageBanner 
        title="SPECIAL OFFERS & COMBOS" 
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Offers" }]} 
      />

      <div className="sk-container" style={{ padding: '40px 16px 80px' }}>
        {/* Banner Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '50px'
        }}>
          {/* Back to School */}
          <div style={{
            background: 'linear-gradient(135deg, #06244A 0%, #008C95 100%)',
            color: 'white',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <span style={{ background: '#D9A441', color: '#03152D', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
              MEGA SAVINGS
            </span>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: '800', marginTop: '12px', marginBottom: '8px' }}>
              Back To School Kit
            </h3>
            <p style={{ fontSize: '13px', color: '#E2E8F0', marginBottom: '18px' }}>
              Get notebooks, drawing sets, geometry boxes, and erasers bundled with up to 30% OFF.
            </p>
            <Link to="/stationery" className="sk-btn-gold" style={{ fontSize: '12.5px', padding: '8px 16px' }}>
              Browse School Supplies &rarr;
            </Link>
          </div>

          {/* Birthday Gifts Special */}
          <div style={{
            background: 'linear-gradient(135deg, #7C2D12 0%, #D9A441 100%)',
            color: 'white',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <span style={{ background: '#008C95', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
              BIRTHDAY SPECIAL
            </span>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: '800', marginTop: '12px', marginBottom: '8px' }}>
              Birthday Gift Hampers
            </h3>
            <p style={{ fontSize: '13px', color: '#FFF8E8', marginBottom: '18px' }}>
              Plush teddy bears, vintage metal bike models, and wooden train toys with complimentary gift wrapping.
            </p>
            <Link to="/gifts" className="sk-btn-primary" style={{ fontSize: '12.5px', padding: '8px 16px', backgroundColor: '#06244A' }}>
              Explore Gifts &rarr;
            </Link>
          </div>

          {/* Festival Offers */}
          <div style={{
            background: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
            color: 'white',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <span style={{ background: '#FAD678', color: '#06244A', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
              FESTIVE TREAT
            </span>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: '800', marginTop: '12px', marginBottom: '8px' }}>
              Festive Deals
            </h3>
            <p style={{ fontSize: '13px', color: '#F0FDF4', marginBottom: '18px' }}>
              Special discounts across fancy jewelry, long-lasting perfumes, and traditional gifts.
            </p>
            <Link to="/fancy-items" className="sk-btn-gold" style={{ fontSize: '12.5px', padding: '8px 16px' }}>
              Shop Festive Jewelry &rarr;
            </Link>
          </div>
        </div>

        {/* Stationery Combos */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '22px', fontWeight: '800' }}>
              STATIONERY VALUE COMBOS
            </h2>
            <Link to="/stationery" style={{ color: '#008C95', fontWeight: '700', fontSize: '13px' }}>View All &rarr;</Link>
          </div>
          <div className="sk-products-grid">
            {stationeryCombos.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Gift Packs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '22px', fontWeight: '800' }}>
              FEATURED GIFT PACKS
            </h2>
            <Link to="/gifts" style={{ color: '#008C95', fontWeight: '700', fontSize: '13px' }}>View All &rarr;</Link>
          </div>
          <div className="sk-products-grid">
            {giftCombos.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
