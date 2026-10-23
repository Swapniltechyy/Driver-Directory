function DriverModal({ driver, isOpen, onClose }) {
  if (!isOpen || !driver) return null;

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
              {driver.categories.map(cat => (
                <span key={cat} className={`badge ${getBadgeClass(cat)}`}>
                  {cat}
                </span>
              ))}
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

window.DriverModal = DriverModal;
