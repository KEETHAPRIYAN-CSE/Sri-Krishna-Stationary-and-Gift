import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP', path: '/shop' },
    { label: 'GIFTS', path: '/gifts' },
    { label: 'SLIPPERS', path: '/slippers' },
    { label: 'FANCY ITEMS', path: '/fancy-items' },
    { label: 'STATIONERY', path: '/stationery' },
    { label: 'OFFERS', path: '/offers' },
    { label: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="sk-navbar">
      <div className="sk-container">
        <ul className="sk-nav-links">
          {navItems.map((item) => (
            <li key={item.path} className="sk-nav-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => (isActive ? 'active' : '')}
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
