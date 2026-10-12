import { useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/tasks', label: 'All Tasks', icon: '✅', end: false },
  { to: '/tasks/new', label: 'Add Task', icon: '➕', end: false },
];

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className={`sidebar-overlay open`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`} aria-label="Sidebar navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">T</div>
          <span className="sidebar-logo-text">
            Task<span>Flow</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="sidebar-section-label">Navigation</p>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              onClick={onClose}
              aria-label={link.label}
            >
              <span className="sidebar-link-icon" aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p className="sidebar-footer-note">
            TaskFlow v1.0.0<br />
            Single-user demo — no authentication.
          </p>
        </div>
      </aside>
    </>
  );
}
