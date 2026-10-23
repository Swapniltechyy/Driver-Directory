import React from 'react';

export default function Header({ onLogout }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <h1 className="app-title"><span>Driver</span> <em>Directory</em></h1>

        <div className="header-actions">
          <a className="admin-link" href="/admin" title="Open admin panel">
            <i className="fa-solid fa-sliders"></i>
            <span>Admin</span>
          </a>

          <button type="button" className="logout-button" onClick={onLogout} title="Sign out">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Sign out</span>
          </button>
        </div>
      </div>

      <div className="header-illustration" aria-hidden="true">
        <svg viewBox="0 0 320 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Mountain Peaks */}
          <path d="M140 110 L230 20 L270 70 L320 110 Z" fill="#E2E8F0" opacity="0.6"/>
          <path d="M210 110 L270 30 L320 110 Z" fill="#CBD5E1" opacity="0.7"/>
          <path d="M230 20 L242 35 L252 28 L270 70 L230 20 Z" fill="#FFFFFF"/>
          <path d="M270 30 L280 44 L288 38 L320 110 L270 30 Z" fill="#FFFFFF"/>
          
          {/* Trees */}
          <path d="M135 110 L140 90 L145 110 Z" fill="#0F766E" opacity="0.8"/>
          <path d="M145 110 L150 85 L155 110 Z" fill="#0F766E" opacity="0.9"/>
          <path d="M295 110 L300 92 L305 110 Z" fill="#0F766E" opacity="0.8"/>
          <path d="M305 110 L310 84 L315 110 Z" fill="#0F766E" opacity="0.9"/>

          {/* Winding Road */}
          <path d="M120 110 C180 110, 200 90, 240 70 C270 55, 275 40, 280 30" stroke="#94A3B8" strokeWidth="24" strokeLinecap="round" fill="none"/>
          <path d="M120 110 C180 110, 200 90, 240 70 C270 55, 275 40, 280 30" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" fill="none"/>

          {/* Location Pin */}
          <g transform="translate(280, 20)">
            <circle cx="0" cy="0" r="10" fill="#0F172A"/>
            <circle cx="0" cy="0" r="4" fill="#FFFFFF"/>
          </g>
        </svg>
      </div>
    </header>
  );
}
