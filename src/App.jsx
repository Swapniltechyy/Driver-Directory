const { useState, useEffect, useCallback } = React;

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('all');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedCarCategory, setSelectedCarCategory] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState(['Owner', 'Driver']);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [sortOption, setSortOption] = useState('name-asc');
  
  const [drivers, setDrivers] = useState([]);
  const [totalCount, setTotalCount] = useState(8);
  const [loading, setLoading] = useState(true);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Cities on Mount
  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => setCities(data))
      .catch(() => {
        // Fallback seed data if API offline
        setCities([
          { id: 1, name: 'Darjeeling' },
          { id: 2, name: 'Kalimpong' },
          { id: 3, name: 'Mirik' },
          { id: 4, name: 'Siliguri' }
        ]);
      });
  }, []);

  // 2. Fetch Areas whenever Selected City changes
  useEffect(() => {
    let url = '/api/areas';
    if (selectedCity !== 'all') {
      url += `?cityId=${selectedCity}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAreas(data);
        setSelectedArea('all');
      })
      .catch(() => {
        const ALL_AREAS = [
          { id: 101, cityId: 1, name: 'Mall Road Stand' },
          { id: 102, cityId: 1, name: 'Chowrasta Stand' },
          { id: 103, cityId: 1, name: 'Lloyds Stand' },
          { id: 201, cityId: 2, name: 'Taxi Stand' },
          { id: 301, cityId: 3, name: 'Bus Stand' },
          { id: 401, cityId: 4, name: 'SNT Stand' },
          { id: 402, cityId: 4, name: 'Junction Stand' }
        ];
        if (selectedCity !== 'all') {
          const cId = parseInt(selectedCity, 10);
          setAreas(ALL_AREAS.filter(a => a.cityId === cId));
        } else {
          setAreas(ALL_AREAS);
        }
        setSelectedArea('all');
      });
  }, [selectedCity]);

  // 3. Fetch Drivers with filters
  const fetchDrivers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCity && selectedCity !== 'all') params.append('cityId', selectedCity);
    if (selectedArea && selectedArea !== 'all') params.append('areaId', selectedArea);
    if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));
    if (sortOption) params.append('sort', sortOption);

    fetch(`/api/drivers?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setDrivers(data.drivers || []);
        setTotalCount(data.total || (data.drivers ? data.drivers.length : 0));
        setLoading(false);
      })
      .catch(() => {
        // Fallback local filtering logic
        const SEED_DRIVERS = [
          { id: 1, name: 'Ramesh Thapa', initials: 'RT', avatarBg: '#E0F2FE', avatarColor: '#0369A1', vehicleMake: 'Toyota', vehicleModel: 'Innova', phone: '+91 98765 43210', whatsapp: '919876543210', cityId: 1, cityName: 'Darjeeling', areaId: 101, areaName: 'Mall Road Stand', categories: ['Owner', 'Driver'] },
          { id: 2, name: 'Suresh Rai', initials: 'SR', avatarBg: '#DCFCE7', avatarColor: '#15803D', vehicleMake: 'Mahindra', vehicleModel: 'Bolero', phone: '+91 87654 32109', whatsapp: '918765432109', cityId: 1, cityName: 'Darjeeling', areaId: 101, areaName: 'Mall Road Stand', categories: ['Owner', 'Driver'] },
          { id: 3, name: 'Pawan Gurung', initials: 'PG', avatarBg: '#F3E8FF', avatarColor: '#7E22CE', vehicleMake: 'Mahindra', vehicleModel: 'Xylo', phone: '+91 94321 65432', whatsapp: '919432165432', cityId: 1, cityName: 'Darjeeling', areaId: 102, areaName: 'Chowrasta Stand', categories: ['Owner', 'Vendor'] },
          { id: 4, name: 'Karan Lama', initials: 'KL', avatarBg: '#FEF3C7', avatarColor: '#B45309', vehicleMake: 'Toyota', vehicleModel: 'Innova', phone: '+91 96543 21098', whatsapp: '919654321098', cityId: 2, cityName: 'Kalimpong', areaId: 201, areaName: 'Taxi Stand', categories: ['Driver'] },
          { id: 5, name: 'Anil Sharma', initials: 'AS', avatarBg: '#CCFBF1', avatarColor: '#0F766E', vehicleMake: 'Maruti Suzuki', vehicleModel: 'Swift', phone: '+91 91234 56789', whatsapp: '919123456789', cityId: 2, cityName: 'Kalimpong', areaId: 201, areaName: 'Taxi Stand', categories: ['Owner', 'Driver'] },
          { id: 6, name: 'Deepak Singh', initials: 'DS', avatarBg: '#FEE2E2', avatarColor: '#B91C1C', vehicleMake: 'Maruti Suzuki', vehicleModel: 'Ertiga', phone: '+91 98887 76655', whatsapp: '919888776655', cityId: 1, cityName: 'Darjeeling', areaId: 103, areaName: 'Lloyds Stand', categories: ['Driver', 'Vendor'] },
          { id: 7, name: 'Bikash Tamang', initials: 'BT', avatarBg: '#EDE9FE', avatarColor: '#6D28D9', vehicleMake: 'Toyota', vehicleModel: 'Fortuner', phone: '+91 90011 22334', whatsapp: '919001122334', cityId: 3, cityName: 'Mirik', areaId: 301, areaName: 'Bus Stand', categories: ['Owner', 'Driver'] },
          { id: 8, name: 'Sanjay Das', initials: 'SD', avatarBg: '#E0F2FE', avatarColor: '#0284C7', vehicleMake: 'Mahindra', vehicleModel: 'Scorpio', phone: '+91 88776 55443', whatsapp: '918877655443', cityId: 4, cityName: 'Siliguri', areaId: 401, areaName: 'SNT Stand', categories: ['Vendor', 'Driver'] }
        ];

        let result = [...SEED_DRIVERS];
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          result = result.filter(d => d.name.toLowerCase().includes(q));
        }
        if (selectedCity !== 'all') {
          const cId = parseInt(selectedCity, 10);
          result = result.filter(d => d.cityId === cId);
        }
        if (selectedArea !== 'all') {
          const aId = parseInt(selectedArea, 10);
          result = result.filter(d => d.areaId === aId);
        }
        if (selectedCarCategory !== 'all') {
          const target = selectedCarCategory.toLowerCase();
          result = result.filter(d => {
            const m = (d.vehicleModel || '').toLowerCase();
            const f = `${d.vehicleMake || ''} ${d.vehicleModel || ''}`.toLowerCase();
            if (m.includes(target) || f.includes(target)) return true;
            if (target === 'swift dezire') return m.includes('swift') || m.includes('dzire') || m.includes('dezire');
            if (target === 'innova') return m.includes('innova');
            if (target === 'innova crysta') return m.includes('crysta') || f.includes('innova crysta');
            if (target === 'scorpio') return m.includes('scorpio');
            if (target === 'scorpio n') return m.includes('scorpio') && m.includes('n');
            if (target === 'wagenor') return m.includes('wagon') || m.includes('wagen');
            if (target.startsWith('tempo traveller')) return m.includes('traveller') || f.includes('traveller');
            return false;
          });
        }
        if (selectedCategories.length > 0) {
          result = result.filter(d => selectedCategories.every(reqCat => d.categories.includes(reqCat)));
        }
        if (sortOption === 'name-asc') result.sort((a,b) => a.name.localeCompare(b.name));
        if (sortOption === 'name-desc') result.sort((a,b) => b.name.localeCompare(a.name));
        if (sortOption === 'city') result.sort((a,b) => a.cityName.localeCompare(b.cityName));

        setDrivers(result);
        setTotalCount(SEED_DRIVERS.length);
        setLoading(false);
      });
  }, [searchQuery, selectedCity, selectedArea, selectedCarCategory, selectedCategories, sortOption]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

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

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedArea('all');
    setSelectedCarCategory('all');
    setSelectedCategories(['Owner', 'Driver']);
    setSortOption('name-asc');
    setIsPopoverOpen(false);
  };

  // Select Driver Modal Trigger
  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Header Banner */}
      <window.Header />

      {/* Filter Card Section */}
      <window.SearchFilters
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
        onSearch={fetchDrivers}
        onClear={handleClearFilters}
      />

      {/* Results Count & Sort Selection */}
      <section className="results-bar">
        <span className="results-count">
          {drivers.length} {drivers.length === 1 ? 'driver found' : 'drivers found'}
        </span>
        
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
            <window.DriverCard
              key={driver.id}
              driver={driver}
              onSelectDriver={handleSelectDriver}
            />
          ))}
        </main>
      ) : (
        <window.EmptyState onReset={handleClearFilters} />
      )}

      {/* Footer Summary */}
      <footer className="footer-bar">
        <span>Showing {drivers.length} of {totalCount} drivers</span>
      </footer>

      {/* Driver Profile Detail Modal */}
      <window.DriverModal
        driver={selectedDriver}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

window.App = App;
