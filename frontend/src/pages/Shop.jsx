import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageBanner } from '../components/common/PageBanner';
import { FilterSidebar } from '../components/product/FilterSidebar';
import { ProductCard } from '../components/product/ProductCard';
import { DEMO_PRODUCTS } from '../utils/demoProducts';

export const Shop = ({ initialCategory = 'all', pageTitle = 'ALL PRODUCTS' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('popularity');

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (searchParams.get('search')) {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  const handleApplyFilter = () => {
    setAppliedMaxPrice(maxPrice);
  };

  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      // Price filter
      const effectivePrice = item.discountPrice || item.price;
      if (effectivePrice > appliedMaxPrice) {
        return false;
      }
      // Search filter
      if (querySearch.trim()) {
        const query = querySearch.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        const matchSub = item.subcategory && item.subcategory.toLowerCase().includes(query);
        if (!matchName && !matchCat && !matchSub) return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.rating - a.rating; // default: popularity
    });
  }, [selectedCategory, appliedMaxPrice, querySearch, sortBy]);

  const categoryTitles = {
    all: "ALL PRODUCTS",
    gifts: "GIFTS & TOYS",
    slippers: "SLIPPERS COLLECTION",
    "fancy-items": "FANCY ITEMS & JEWELRY",
    stationery: "STATIONERY & ART SUPPLIES"
  };

  const currentTitle = querySearch 
    ? `SEARCH: "${querySearch}"` 
    : (categoryTitles[selectedCategory] || pageTitle);

  return (
    <div className="sk-shop-page">
      {/* Page Banner strictly matching the Reference UI */}
      <PageBanner 
        title={currentTitle}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Shop", path: "/shop" },
          { label: selectedCategory === 'all' ? 'All Products' : categoryTitles[selectedCategory] }
        ]}
      />

      {/* Main Content Area */}
      <div className="sk-container">
        <div className="sk-shop-layout">
          {/* Left Sidebar */}
          <FilterSidebar 
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onApplyFilter={handleApplyFilter}
          />

          {/* Right Product Grid Area */}
          <main className="sk-shop-main">
            <div className="sk-shop-toolbar">
              <div className="sk-results-count">
                Showing 1-{filteredProducts.length} of {filteredProducts.length} products
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="sort-select" style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                  Sort by:
                </label>
                <select 
                  id="sort-select"
                  className="sk-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price Low → High</option>
                  <option value="price-high">Price High → Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="sk-products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #E2E8F0'
              }}>
                <h3 style={{ color: '#06244A', fontSize: '18px', marginBottom: '8px' }}>No Products Found</h3>
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>
                  Try adjusting your price filter or selecting another category.
                </p>
                <button 
                  className="sk-btn-teal"
                  onClick={() => {
                    setSelectedCategory('all');
                    setAppliedMaxPrice(2000);
                    setMaxPrice(2000);
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
