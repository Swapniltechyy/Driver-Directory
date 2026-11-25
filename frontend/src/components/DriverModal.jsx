import React, { useState } from 'react';

export default function DriverModal({ driver, selectedCategories = [], isOpen, onClose, onUpdateRating }) {
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen || !driver) return null;

  const displayedCategories = (selectedCategories && selectedCategories.length > 0)
    ? driver.categories.filter(cat => selectedCategories.includes(cat))
    : driver.categories;

  const getBadgeClass = (category) => {
    switch (category) {
      case 'Owner': return 'badge-owner';
      case 'Driver': return 'badge-driver';
      case 'Vendor': return 'badge-vendor';
      default: return '';
    }
  };

  const cleanPhone = driver.phone.replace(/\s+/g, '');

  return (
    <div
      className={`modal-overlay ${isOpen ? 'show' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalName"
      onClick={onClose}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" aria-label="Close detail modal" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="modal-header-profile">
          <div
            className="avatar-circle modal-avatar"
            style={{ backgroundColor: driver.avatarBg, color: driver.avatarColor }}
          >
            {driver.initials}
          </div>
          <div className="modal-name-box">
            <h2 id="modalName" className="modal-name">{driver.name}</h2>
            <div className="modal-subtitle">
              <i className="fa-solid fa-car-side"></i>
              <span>{driver.vehicleMake} {driver.vehicleModel}</span>
            </div>
          </div>
        </div>

        <div className="modal-body-section">
          <div className="detail-row">
            <span className="detail-label"><i className="fa-solid fa-phone"></i> Contact Phone</span>
            <span className="detail-value">{driver.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label"><i className="fa-solid fa-location-dot"></i> City</span>
            <span className="detail-value">{driver.cityName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label"><i className="fa-solid fa-bus-simple"></i> Area / Stand</span>
            <span className="detail-value">{driver.areaName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label"><i className="fa-solid fa-users"></i> Categories</span>
            <div className="driver-categories">
              {displayedCategories.map(cat => (
                <span key={cat} className={`badge ${getBadgeClass(cat)}`}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div className="detail-row">
            <span className="detail-label"><i className="fa-solid fa-star"></i> Rating</span>
            <div
              className="detail-value modal-rating-stars"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`modal-star-btn ${star <= (hoverRating || Number(driver.rating) || 0) ? 'star-filled' : 'star-empty'}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onClick={() => {
                    const current = Number(driver.rating) || 0;
                    const nextRating = current === star ? 0 : star;
                    if (onUpdateRating) onUpdateRating(driver.id, nextRating);
                    setHoverRating(0);
                  }}
                  title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  aria-label={`Rate ${star} star`}
                >
                  <i className="fa-solid fa-star"></i>
                </button>
              ))}
              <span className="modal-rating-score">
                {driver.rating ? `${driver.rating}/5` : 'Not rated'}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <a href={`tel:${cleanPhone}`} className="btn-call">
            <i className="fa-solid fa-phone"></i> Call Driver
          </a>
          <a
            href={`https://wa.me/${driver.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
          >
            <i className="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
