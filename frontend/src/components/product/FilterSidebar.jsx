import React from 'react';
import { LayoutGrid, Gift, Footprints, Gem, PenTool } from 'lucide-react';

export const FilterSidebar = ({
  selectedCategory,
  onSelectCategory,
  maxPrice,
  setMaxPrice,
  onApplyFilter
}) => {
  const categories = [
    { id: "all", name: "All Products", icon: LayoutGrid },
    { id: "gifts", name: "Gifts", icon: Gift },
    { id: "slippers", name: "Slippers", icon: Footprints },
    { id: "fancy-items", name: "Fancy Items", icon: Gem },
    { id: "stationery", name: "Stationery", icon: PenTool },
  ];

  return (
    <aside className="sk-sidebar">
      {/* Categories Card */}
      <div className="sk-sidebar-card">
        <h3 className="sk-sidebar-title">CATEGORIES</h3>
        <div className="sk-category-list">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`sk-category-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <Icon size={17} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by Price Card */}
      <div className="sk-sidebar-card">
        <h3 className="sk-sidebar-title">FILTER BY PRICE</h3>
        <div style={{ padding: '8px 0' }}>
          <input 
            type="range" 
            min="0" 
            max="2000" 
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#008C95',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', marginTop: '6px', fontWeight: 600 }}>
            <span>₹0</span>
            <span style={{ color: '#008C95', fontWeight: 700 }}>Up to ₹{maxPrice}</span>
            <span>₹2000+</span>
          </div>

          <button 
            className="sk-btn-teal" 
            style={{ width: '100%', marginTop: '16px', fontSize: '13px' }}
            onClick={onApplyFilter}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </aside>
  );
};
