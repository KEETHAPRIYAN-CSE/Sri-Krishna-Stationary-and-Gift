import React from 'react';
import { Link } from 'react-router-dom';

export const PageBanner = ({ title = "ALL PRODUCTS", breadcrumbs = [{ label: "Home", path: "/" }, { label: "Shop", path: "/shop" }, { label: "All Products" }] }) => {
  return (
    <section className="sk-page-banner">
      <div className="sk-container">
        <div className="sk-banner-flex">
          {/* Left: Peacock Feather Flourish Motif */}
          <div className="sk-banner-art-left">
            <img 
              src="/assets/peacock-flourish.png" 
              alt="Peacock Feather Decorative Flourish" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>

          {/* Center: Title & Filigree Ornamental Dividers */}
          <div className="sk-banner-center">
            {/* Top Filigree */}
            <div className="sk-ornament-divider">
              <div className="sk-ornament-line"></div>
              <span className="sk-ornament-symbol">✤ ❦ ✤</span>
              <div className="sk-ornament-line"></div>
            </div>

            <h1 className="sk-banner-title">{title}</h1>

            {/* Bottom Filigree */}
            <div className="sk-ornament-divider">
              <div className="sk-ornament-line"></div>
              <span className="sk-ornament-symbol">✤ ❦ ✤</span>
              <div className="sk-ornament-line"></div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="sk-banner-breadcrumb">
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx}>
                  {crumb.path ? (
                    <Link to={crumb.path}>{crumb.label}</Link>
                  ) : (
                    <span style={{ color: '#64748B', fontWeight: 600 }}>{crumb.label}</span>
                  )}
                  {idx < breadcrumbs.length - 1 && <span style={{ margin: '0 8px', color: '#94A3B8' }}>&gt;</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Stationery & Gifts Collage Illustration */}
          <div className="sk-banner-art-right">
            <img 
              src="/assets/banner-illustration.png" 
              alt="Stationery and Gifts Collage" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
