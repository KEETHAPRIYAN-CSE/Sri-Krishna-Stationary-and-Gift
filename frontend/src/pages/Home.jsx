import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, ArrowRight, ShieldCheck, Truck, Sparkles, MapPin, Clock } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { DEMO_PRODUCTS, CATEGORIES } from '../utils/demoProducts';

export const Home = () => {
  const featuredGifts = DEMO_PRODUCTS.filter(p => p.categoryId === 'gifts').slice(0, 6);
  const featuredStationery = DEMO_PRODUCTS.filter(p => p.categoryId === 'stationery').slice(0, 6);
  const featuredFancy = DEMO_PRODUCTS.filter(p => p.categoryId === 'fancy-items').slice(0, 6);
  const featuredSlippers = DEMO_PRODUCTS.filter(p => p.categoryId === 'slippers').slice(0, 6);

  return (
    <div className="sk-home-page">
      {/* Hero Section inspired by the Flex Design Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0B3566 0%, #008C95 50%, #D9A441 100%)',
        color: 'white',
        padding: '60px 0 70px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="sk-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '40px'
          }}>
            {/* Left Content */}
            <div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(6, 36, 74, 0.85)',
                color: '#FFF8E8',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                border: '1px solid #D9A441',
                marginBottom: '18px'
              }}>
                SCHOOL | OFFICE | ART SUPPLIES
              </div>

              <h1 style={{
                fontFamily: 'Cinzel, serif',
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: '900',
                lineHeight: '1.15',
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                marginBottom: '10px'
              }}>
                SRI KRISHNA
                <span style={{ display: 'block', fontSize: 'clamp(20px, 3.5vw, 30px)', color: '#FFF8E8', fontWeight: '700' }}>
                  STATIONERY AND GIFT
                </span>
              </h1>

              <p style={{
                fontSize: 'clamp(16px, 2.2vw, 20px)',
                fontStyle: 'italic',
                color: '#FCE8B3',
                marginBottom: '28px',
                fontWeight: '500'
              }}>
                "Everything You Need, All in One Place!"
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '30px' }}>
                <Link to="/shop" className="sk-btn-gold" style={{ fontSize: '15px', padding: '12px 28px' }}>
                  <ShoppingBag size={18} />
                  <span>SHOP NOW</span>
                </Link>

                <a 
                  href="https://wa.me/919876543210?text=Hello%20Sri%20Krishna%20Stationery%20and%20Gift,%20I%20would%20like%20to%20order%20products." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="sk-btn-whatsapp"
                  style={{ fontSize: '15px', padding: '12px 24px', borderRadius: '8px' }}
                >
                  <MessageCircle size={18} />
                  <span>ORDER ON WHATSAPP</span>
                </a>
              </div>

              {/* Address Quick Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(3, 21, 45, 0.7)',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                color: '#E2E8F0'
              }}>
                <MapPin size={18} color="#D9A441" style={{ flexShrink: 0 }} />
                <span>2/363 Sri Kumaran Complex, Siruvani Main Rd, Kalampalayam, Coimbatore | <strong>Open 9 AM - 9 PM</strong></span>
              </div>
            </div>

            {/* Right Banner Collage Graphic */}
            <div style={{ textAlign: 'center' }}>
              <img 
                src="/assets/flex-banner.png" 
                alt="Sri Krishna Stationery and Gift Banner" 
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                  border: '3px solid rgba(255,255,255,0.4)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category Bar */}
      <section style={{ backgroundColor: 'white', padding: '40px 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="sk-container">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '24px', fontWeight: '800' }}>
              EXPLORE OUR DEPARTMENTS
            </h2>
            <div className="sk-ornament-divider">
              <div className="sk-ornament-line"></div>
              <span className="sk-ornament-symbol">✤</span>
              <div className="sk-ornament-line"></div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            {[
              { title: "Stationery", desc: "Pens, Books, Art Supplies", slug: "stationery", img: "/assets/products/spiral-notebook.png" },
              { title: "Gifts & Soft Toys", desc: "Plush Bears, Metal Bikes, Trains", slug: "gifts", img: "/assets/products/teddy-bear.png" },
              { title: "Slippers", desc: "Men, Women & Kids", slug: "slippers", img: "/assets/products/women-slipper.png" },
              { title: "Fancy Items", desc: "Jewelry, Chains, Makeup, Perfume", slug: "fancy-items", img: "/assets/products/fancy-earrings.png" },
            ].map(cat => (
              <Link 
                key={cat.slug} 
                to={`/shop?category=${cat.slug}`}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '20px 14px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#008C95';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,140,149,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '12px' }} 
                />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#06244A', marginBottom: '4px' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
                  {cat.desc}
                </p>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#008C95', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Browse All <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products (From Reference UI) */}
      <section style={{ padding: '50px 0', backgroundColor: '#F8FAFC' }}>
        <div className="sk-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <span style={{ color: '#008C95', fontWeight: '800', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                CUSTOMER FAVORITES
              </span>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '26px', fontWeight: '800', margin: '4px 0 0' }}>
                POPULAR PRODUCTS
              </h2>
            </div>
            <Link to="/shop" style={{ color: '#008C95', fontWeight: '700', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View Complete Catalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="sk-products-grid">
            {DEMO_PRODUCTS.slice(0, 12).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Gifts & Toys Spotlight */}
      <section style={{ padding: '50px 0', backgroundColor: 'white', borderTop: '1px solid #E2E8F0' }}>
        <div className="sk-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <span style={{ color: '#D9A441', fontWeight: '800', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                KIDS & OCCASIONS
              </span>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '26px', fontWeight: '800', margin: '4px 0 0' }}>
                GIFTS & TOYS COLLECTION
              </h2>
            </div>
            <Link to="/gifts" style={{ color: '#008C95', fontWeight: '700', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              See All Gifts <ArrowRight size={16} />
            </Link>
          </div>

          <div className="sk-products-grid">
            {featuredGifts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* School, Office & Art Stationery Spotlight */}
      <section style={{ padding: '50px 0', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="sk-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <span style={{ color: '#008C95', fontWeight: '800', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                SCHOOL & OFFICE ESSENTIALS
              </span>
              <h2 style={{ fontFamily: 'Cinzel, serif', color: '#06244A', fontSize: '26px', fontWeight: '800', margin: '4px 0 0' }}>
                STATIONERY & ART SUPPLIES
              </h2>
            </div>
            <Link to="/stationery" style={{ color: '#008C95', fontWeight: '700', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              See All Stationery <ArrowRight size={16} />
            </Link>
          </div>

          <div className="sk-products-grid">
            {featuredStationery.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ backgroundColor: '#06244A', color: 'white', padding: '50px 0' }}>
        <div className="sk-container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: '#FAD678', fontSize: '24px', fontWeight: '800' }}>
              WHY SHOP AT SRI KRISHNA?
            </h2>
            <p style={{ color: '#E2E8F0', fontSize: '14px', marginTop: '6px' }}>
              Serving Coimbatore with trustworthy quality and friendly local service.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            {[
              { icon: ShieldCheck, title: "100% Genuine Brands", desc: "Direct stock from trusted manufacturers like Camlin, Classmate, Reynolds, and top toy makers." },
              { icon: Truck, title: "Swift Local Delivery", desc: "Fast and reliable doorstep delivery across Coimbatore and Kalampalayam area." },
              { icon: MessageCircle, title: "Order on WhatsApp", desc: "Send us a quick photo or list of items and we will pack them ready for pickup or delivery." },
              { icon: Sparkles, title: "Best Pocket-Friendly Prices", desc: "Special combo packs, festive deals, and affordable school and office supplies everyday." }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(217, 164, 65, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <Icon size={26} color="#FAD678" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: '1.5' }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
