import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import SearchFilters from '../components/SearchFilters';
import DriverCard from '../components/DriverCard';
import DriverModal from '../components/DriverModal';
import EmptyState from '../components/EmptyState';
import { fetchCities, fetchAreas, fetchDrivers } from '../services/api';

export default function DriverDirectoryPage({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedCarCategory, setSelectedCarCategory] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [sortOption, setSortOption] = useState('name-asc');
  
  const [drivers, setDrivers] = useState([]);
  const [totalCount, setTotalCount] = useState(8);
  const [loading, setLoading] = useState(true);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Cities on Mount
  useEffect(() => {
    fetchCities().then(data => setCities(data));
  }, []);

  // 2. Fetch Areas whenever Selected City changes
  useEffect(() => {
    fetchAreas(selectedCity).then(data => {
      setAreas(data);
      setSelectedArea('all');
    });
  }, [selectedCity]);

  // 3. Fetch Drivers with current filters
  const loadDrivers = useCallback(async () => {
    setLoading(true);
    const data = await fetchDrivers({
      searchQuery,
      selectedCity,
      selectedArea,
      selectedCarCategory,
      selectedCategories,
      sortOption
    });
    setDrivers(data.drivers || []);
    setTotalCount(data.total || (data.drivers ? data.drivers.length : 0));
    setLoading(false);
  }, [searchQuery, selectedCity, selectedArea, selectedCarCategory, selectedCategories, sortOption]);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  // Category Checkbox Toggle
  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(c => c !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  // Clear All Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedArea('all');
    setSelectedCarCategory('all');
    setSelectedCategories([]);
    setSortOption('name-asc');
    setIsPopoverOpen(false);
  };

  // Open Driver Modal
  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Header Banner */}
      <Header onLogout={onLogout} />

      {/* Filter Card Section */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cities={cities}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        areas={areas}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        selectedCarCategory={selectedCarCategory}
        setSelectedCarCategory={setSelectedCarCategory}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        isPopoverOpen={isPopoverOpen}
        setIsPopoverOpen={setIsPopoverOpen}
        onSearch={loadDrivers}
        onClear={handleClearFilters}
      />

      {/* Results Count & Sort Selection */}
      <section className="results-bar">
        <div className="results-heading">
          <i className="fa-solid fa-users"></i>
          <div>
            <span className="results-count">
              {drivers.length} {drivers.length === 1 ? 'driver found' : 'drivers found'}
            </span>
            <small>Showing all available drivers</small>
          </div>
        </div>
        
        <div className="sort-wrapper">
          <select
            className="sort-select-btn"
            aria-label="Sort drivers list"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name-asc">Sort by: Name (A-Z)</option>
            <option value="name-desc">Sort by: Name (Z-A)</option>
            <option value="city">Sort by: City</option>
          </select>
        </div>
      </section>

      {/* Driver Cards List Container */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
          <p style={{ marginTop: '12px', fontWeight: '500' }}>Loading drivers directory...</p>
        </div>
      ) : drivers.length > 0 ? (
        <main className="driver-list" aria-live="polite">
          {drivers.map(driver => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onSelectDriver={handleSelectDriver}
            />
          ))}
        </main>
      ) : (
        <EmptyState onReset={handleClearFilters} />
      )}

      {/* Footer Summary */}
      <footer className="footer-bar">
        <span>Showing {drivers.length} of {totalCount} drivers</span>
      </footer>

      {/* Driver Profile Detail Modal */}
      <DriverModal
        driver={selectedDriver}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
