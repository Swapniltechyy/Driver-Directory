import React from 'react';

export default function DriverCard({ driver, onSelectDriver }) {
  const getBadgeClass = (category) => {
    switch (category) {
      case 'Owner': return 'badge-owner';
      case 'Driver': return 'badge-driver';
      case 'Vendor': return 'badge-vendor';
      default: return '';
    }
  };

  return (
    <article className="driver-card" onClick={() => onSelectDriver(driver)}>
      {/* Avatar */}
      <div className="card-col-avatar">
        <div
          className="avatar-circle"
          style={{ backgroundColor: driver.avatarBg, color: driver.avatarColor }}
        >
          {driver.initials}
        </div>
      </div>

      {/* Driver Info */}
      <div className="card-col-info">
        <h3 className="driver-name">
          {driver.name}
          {driver.vehicleModel && (
            <span className="driver-vehicle-model"> | {driver.vehicleModel}</span>
          )}
        </h3>
        <div className="driver-rating-stars" aria-label={`${driver.rating || 5} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`fa-solid fa-star ${star <= (driver.rating || 5) ? 'star-filled' : 'star-empty'}`}
            ></i>
          ))}
        </div>
      </div>

      {/* Phone & WhatsApp */}
      <div className="card-col-contact">
        <a
          href={`tel:${driver.phone.replace(/\s+/g, '')}`}
          className="phone-link"
          onClick={(e) => e.stopPropagation()}
        >
          <i className="fa-solid fa-phone"></i>
          <span>{driver.phone}</span>
        </a>
        <a
          href={`https://wa.me/${driver.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-btn"
          title="Chat on WhatsApp"
          onClick={(e) => e.stopPropagation()}
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>
      </div>

      {/* Location */}
      <div className="card-col-location">
        <div className="location-city">
          <i className="fa-solid fa-location-dot"></i>
          <span>{driver.cityName}</span>
        </div>
        <div className="location-stand">{driver.areaName}</div>
      </div>

      {/* Categories Badges */}
      <div className="card-col-categories">
        <div className="driver-categories">
          {driver.categories.map(cat => (
            <span key={cat} className={`badge ${getBadgeClass(cat)}`}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow Action */}
      <div className="card-col-action">
        <button className="btn-details-arrow" aria-label={`View details for ${driver.name}`}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </article>
  );
}
