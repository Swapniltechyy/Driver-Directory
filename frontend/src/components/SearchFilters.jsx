import React, { useState, useRef, useEffect } from 'react';
import { CAR_TYPES } from '../constants/carTypes';

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  cities,
  selectedCity,
  setSelectedCity,
  areas,
  selectedArea,
  setSelectedArea,
  selectedCarCategory = 'all',
  setSelectedCarCategory,
  selectedCategories,
  onCategoryToggle,
  isPopoverOpen,
  setIsPopoverOpen,
  onSearch,
  onClear
}) {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);

  const cityDropdownRef = useRef(null);
  const areaDropdownRef = useRef(null);
  const carDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target)) {
        setIsAreaDropdownOpen(false);
      }
      if (carDropdownRef.current && !carDropdownRef.current.contains(event.target)) {
        setIsCarDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCityDropdown = () => {
    setIsCityDropdownOpen(prev => !prev);
    setIsAreaDropdownOpen(false);
    setIsCarDropdownOpen(false);
  };

  const toggleAreaDropdown = () => {
    setIsAreaDropdownOpen(prev => !prev);
    setIsCityDropdownOpen(false);
    setIsCarDropdownOpen(false);
  };

  const toggleCarDropdown = () => {
    setIsCarDropdownOpen(prev => !prev);
    setIsCityDropdownOpen(false);
    setIsAreaDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="filter-card" aria-label="Directory Search Filters">
      <div className="filter-grid">
        
        {/* Name Search Input */}
        <div className="filter-group">
          <div className="input-icon-wrapper">
            <i className="fa-solid fa-magnifying-glass field-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search driver name..."
              aria-label="Search driver name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* City Dropdown */}
        <div className="filter-group city-filter-group" ref={cityDropdownRef} style={{ position: 'relative' }}>
          <label className="filter-label">City</label>
          <div className="input-icon-wrapper">
            <i className="fa-solid fa-location-dot field-icon"></i>
            <div
              className={`select-control custom-select-trigger ${isCityDropdownOpen ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              aria-haspopup="listbox"
              aria-expanded={isCityDropdownOpen}
              aria-label="Select City"
              onClick={toggleCityDropdown}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCityDropdown();
                } else if (e.key === 'Escape') {
                  setIsCityDropdownOpen(false);
                }
              }}
            >
              <span className="custom-select-text">
                {selectedCity === 'all'
                  ? 'All Cities'
                  : (cities.find(c => String(c.id) === String(selectedCity))?.name || 'All Cities')}
              </span>
              <i className={`fa-solid fa-chevron-down custom-select-chevron ${isCityDropdownOpen ? 'rotate' : ''}`}></i>
            </div>

            {isCityDropdownOpen && (
              <div className="custom-select-menu" role="listbox" aria-label="City options">
                <div
                  className={`custom-select-option ${selectedCity === 'all' ? 'selected' : ''}`}
                  role="option"
                  aria-selected={selectedCity === 'all'}
                  onClick={() => {
                    if (setSelectedCity) setSelectedCity('all');
                    setIsCityDropdownOpen(false);
                  }}
                >
                  All Cities
                </div>
                {cities.map(c => (
                  <div
                    key={c.id}
                    className={`custom-select-option ${String(selectedCity) === String(c.id) ? 'selected' : ''}`}
                    role="option"
                    aria-selected={String(selectedCity) === String(c.id)}
                    onClick={() => {
                      if (setSelectedCity) setSelectedCity(c.id);
                      setIsCityDropdownOpen(false);
                    }}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Area / Stand Dropdown */}
        <div className="filter-group area-filter-group" ref={areaDropdownRef} style={{ position: 'relative' }}>
          <label className="filter-label">Area / Stand</label>
          <div className="input-icon-wrapper">
            <i className="fa-solid fa-bus-simple field-icon"></i>
            <div
              className={`select-control custom-select-trigger ${isAreaDropdownOpen ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              aria-haspopup="listbox"
              aria-expanded={isAreaDropdownOpen}
              aria-label="Select Area or Stand"
              onClick={toggleAreaDropdown}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleAreaDropdown();
                } else if (e.key === 'Escape') {
                  setIsAreaDropdownOpen(false);
                }
              }}
            >
              <span className="custom-select-text">
                {selectedArea === 'all'
                  ? 'All Stands'
                  : (areas.find(a => String(a.id) === String(selectedArea))?.name || 'All Stands')}
              </span>
              <i className={`fa-solid fa-chevron-down custom-select-chevron ${isAreaDropdownOpen ? 'rotate' : ''}`}></i>
            </div>

            {isAreaDropdownOpen && (
              <div className="custom-select-menu" role="listbox" aria-label="Area or Stand options">
                <div
                  className={`custom-select-option ${selectedArea === 'all' ? 'selected' : ''}`}
                  role="option"
                  aria-selected={selectedArea === 'all'}
                  onClick={() => {
                    if (setSelectedArea) setSelectedArea('all');
                    setIsAreaDropdownOpen(false);
                  }}
                >
                  All Stands
                </div>
                {areas.map(a => (
                  <div
                    key={a.id}
                    className={`custom-select-option ${String(selectedArea) === String(a.id) ? 'selected' : ''}`}
                    role="option"
                    aria-selected={String(selectedArea) === String(a.id)}
                    onClick={() => {
                      if (setSelectedArea) setSelectedArea(a.id);
                      setIsAreaDropdownOpen(false);
                    }}
                  >
                    {a.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Car Category Dropdown */}
        <div className="filter-group car-category-group" ref={carDropdownRef} style={{ position: 'relative' }}>
          <label className="filter-label">Car Category</label>
          <div className="input-icon-wrapper">
            <i className="fa-solid fa-car field-icon"></i>
            <div
              className={`select-control custom-select-trigger ${isCarDropdownOpen ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              aria-haspopup="listbox"
              aria-expanded={isCarDropdownOpen}
              aria-label="Select Car Category"
              onClick={toggleCarDropdown}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCarDropdown();
                } else if (e.key === 'Escape') {
                  setIsCarDropdownOpen(false);
                }
              }}
            >
              <span className="custom-select-text">
                {selectedCarCategory === 'all' ? 'All Car Categories' : selectedCarCategory}
              </span>
              <i className={`fa-solid fa-chevron-down custom-select-chevron ${isCarDropdownOpen ? 'rotate' : ''}`}></i>
            </div>

            {isCarDropdownOpen && (
              <div className="custom-select-menu" role="listbox" aria-label="Car Category options">
                <div
                  className={`custom-select-option ${selectedCarCategory === 'all' ? 'selected' : ''}`}
                  role="option"
                  aria-selected={selectedCarCategory === 'all'}
                  onClick={() => {
                    if (setSelectedCarCategory) setSelectedCarCategory('all');
                    setIsCarDropdownOpen(false);
                  }}
                >
                  All Car Categories
                </div>
                {CAR_TYPES.map(type => (
                  <div
                    key={type}
                    className={`custom-select-option ${selectedCarCategory === type ? 'selected' : ''}`}
                    role="option"
                    aria-selected={selectedCarCategory === type}
                    onClick={() => {
                      if (setSelectedCarCategory) setSelectedCarCategory(type);
                      setIsCarDropdownOpen(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Multi-Select Category Checkboxes */}
        <div className="filter-group category-filter-group">
          <label className="filter-label">Category</label>
          <div className="category-checkboxes" role="group" aria-label="Select categories">
            {['Owner', 'Driver', 'Vendor'].map(category => (
              <label key={category} className={`category-checkbox-option category-${category.toLowerCase()}`}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryToggle(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <button type="button" className="btn-clear" title="Clear all active filters" onClick={onClear}>
          <i className="fa-solid fa-rotate-left"></i>
          <span>Clear</span>
        </button>

      </div>
    </section>
  );
}
