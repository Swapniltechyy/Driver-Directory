const API_BASE_URL = '/api';

async function adminRequest(path, options = {}) {
  const token = localStorage.getItem('driver-directory-admin-token');
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}/admin${path}`, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem('driver-directory-admin-auth');
    localStorage.removeItem('driver-directory-admin-token');
    window.location.assign('/admin');
    throw new Error('Admin session expired');
  }
  if (!response.ok) {
    let detail = `Admin request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body.error) detail = body.error;
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(detail);
  }
  return response.json();
}

export async function fetchAdminDrivers(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return adminRequest(`/drivers${query}`);
}

export function createAdminDriver(driver) {
  return adminRequest('/drivers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(driver)
  });
}

export function updateAdminDriver(id, driver) {
  return adminRequest(`/drivers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(driver)
  });
}

export function deleteAdminDriver(id) {
  return adminRequest(`/drivers/${id}`, { method: 'DELETE' });
}

export function importAdminDrivers(file) {
  const formData = new FormData();
  formData.append('file', file);
  return adminRequest('/import', { method: 'POST', body: formData });
}

export function downloadAdminFile(format) {
  const token = localStorage.getItem('driver-directory-admin-token');
  fetch(`${API_BASE_URL}/admin/export.${format}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(response => {
      if (response.status === 401) {
        localStorage.removeItem('driver-directory-admin-auth');
        localStorage.removeItem('driver-directory-admin-token');
        window.location.assign('/admin');
      }
      if (!response.ok) throw new Error('Export failed');
      return response.blob();
    })
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `driver-directory.${format}`;
      link.click();
      URL.revokeObjectURL(link.href);
    });
}

export async function fetchCities() {
  try {
    const res = await fetch(`${API_BASE_URL}/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return await res.json();
  } catch (error) {
    console.warn('API connection offline, using fallback cities data');
    return [
      { id: 1, name: 'Darjeeling' },
      { id: 2, name: 'Kalimpong' },
      { id: 3, name: 'Mirik' },
      { id: 4, name: 'Siliguri' }
    ];
  }
}

export async function fetchAreas(cityId) {
  try {
    let url = `${API_BASE_URL}/areas`;
    if (cityId && cityId !== 'all') {
      url += `?cityId=${cityId}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch areas');
    return await res.json();
  } catch (error) {
    console.warn('API connection offline, using fallback areas data');
    const ALL_AREAS = [
      { id: 101, cityId: 1, name: 'Mall Road Stand' },
      { id: 102, cityId: 1, name: 'Chowrasta Stand' },
      { id: 103, cityId: 1, name: 'Lloyds Stand' },
      { id: 201, cityId: 2, name: 'Taxi Stand' },
      { id: 301, cityId: 3, name: 'Bus Stand' },
      { id: 401, cityId: 4, name: 'SNT Stand' },
      { id: 402, cityId: 4, name: 'Junction Stand' }
    ];
    if (cityId && cityId !== 'all') {
      const cId = parseInt(cityId, 10);
      return ALL_AREAS.filter(a => a.cityId === cId);
    }
    return ALL_AREAS;
  }
}

export function matchesCarType(driver, carType) {
  if (!carType || carType === 'all') return true;
  const target = carType.toLowerCase().trim();
  const model = (driver.vehicleModel || '').toLowerCase().trim();
  const make = (driver.vehicleMake || '').toLowerCase().trim();
  const full = `${make} ${model}`.trim();

  if (model === target || full === target) return true;
  if (model.includes(target) || full.includes(target)) return true;

  if (target === 'swift dezire') {
    return model.includes('swift') || model.includes('dzire') || model.includes('dezire') || full.includes('swift');
  }
  if (target === 'innova') {
    return model.includes('innova');
  }
  if (target === 'innova crysta') {
    return model.includes('crysta') || full.includes('innova crysta');
  }
  if (target === 'scorpio') {
    return model.includes('scorpio');
  }
  if (target === 'scorpio n') {
    return (model.includes('scorpio') && model.includes('n')) || full.includes('scorpio n');
  }
  if (target === 'wagenor') {
    return model.includes('wagon') || model.includes('wagen') || full.includes('wagon');
  }
  if (target.startsWith('tempo traveller')) {
    const seatMatch = target.match(/\d+/);
    if (seatMatch && (model.includes(seatMatch[0]) || full.includes(seatMatch[0]))) {
      return true;
    }
    return model.includes('traveller') || full.includes('traveller');
  }
  if (target === 'winger') {
    return model.includes('winger') || full.includes('winger');
  }
  if (target === 'sumo') {
    return model.includes('sumo') || full.includes('sumo');
  }
  if (target === 'bolero') {
    return model.includes('bolero') || full.includes('bolero');
  }
  if (target === 'ertiga') {
    return model.includes('ertiga') || full.includes('ertiga');
  }
  if (target === 'rumion') {
    return model.includes('rumion') || full.includes('rumion');
  }

  return false;
}

export async function fetchDrivers({ searchQuery, selectedCity, selectedArea, selectedCarCategory, selectedCategories, sortOption }) {
  try {
    const params = new URLSearchParams();
    if (searchQuery && searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCity && selectedCity !== 'all') params.append('cityId', selectedCity);
    if (selectedArea && selectedArea !== 'all') params.append('areaId', selectedArea);
    if (selectedCarCategory && selectedCarCategory !== 'all') params.append('carCategory', selectedCarCategory);
    if (selectedCategories && selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));
    if (sortOption) params.append('sort', sortOption);

    const res = await fetch(`${API_BASE_URL}/drivers?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch drivers');
    return await res.json();
  } catch (error) {
    console.warn('API connection offline, using fallback drivers data');
    const MOCK_DRIVERS = [
      { id: 1, name: 'Ramesh Thapa', initials: 'RT', avatarBg: '#E0F2FE', avatarColor: '#0369A1', vehicleMake: 'Toyota', vehicleModel: 'Innova', phone: '+91 98765 43210', whatsapp: '919876543210', cityId: 1, cityName: 'Darjeeling', areaId: 101, areaName: 'Mall Road Stand', categories: ['Owner', 'Driver'] },
      { id: 2, name: 'Suresh Rai', initials: 'SR', avatarBg: '#DCFCE7', avatarColor: '#15803D', vehicleMake: 'Mahindra', vehicleModel: 'Bolero', phone: '+91 87654 32109', whatsapp: '918765432109', cityId: 1, cityName: 'Darjeeling', areaId: 101, areaName: 'Mall Road Stand', categories: ['Owner', 'Driver'] },
      { id: 3, name: 'Pawan Gurung', initials: 'PG', avatarBg: '#F3E8FF', avatarColor: '#7E22CE', vehicleMake: 'Mahindra', vehicleModel: 'Xylo', phone: '+91 94321 65432', whatsapp: '919432165432', cityId: 1, cityName: 'Darjeeling', areaId: 102, areaName: 'Chowrasta Stand', categories: ['Owner', 'Vendor'] },
      { id: 4, name: 'Karan Lama', initials: 'KL', avatarBg: '#FEF3C7', avatarColor: '#B45309', vehicleMake: 'Toyota', vehicleModel: 'Innova', phone: '+91 96543 21098', whatsapp: '919654321098', cityId: 2, cityName: 'Kalimpong', areaId: 201, areaName: 'Taxi Stand', categories: ['Driver'] },
      { id: 5, name: 'Anil Sharma', initials: 'AS', avatarBg: '#CCFBF1', avatarColor: '#0F766E', vehicleMake: 'Maruti Suzuki', vehicleModel: 'Swift', phone: '+91 91234 56789', whatsapp: '919123456789', cityId: 2, cityName: 'Kalimpong', areaId: 201, areaName: 'Taxi Stand', categories: ['Owner', 'Driver'] },
      { id: 6, name: 'Deepak Singh', initials: 'DS', avatarBg: '#FEE2E2', avatarColor: '#B91C1C', vehicleMake: 'Maruti Suzuki', vehicleModel: 'Ertiga', phone: '+91 98887 76655', whatsapp: '919888776655', cityId: 1, cityName: 'Darjeeling', areaId: 103, areaName: 'Lloyds Stand', categories: ['Driver', 'Vendor'] },
      { id: 7, name: 'Bikash Tamang', initials: 'BT', avatarBg: '#EDE9FE', avatarColor: '#6D28D9', vehicleMake: 'Toyota', vehicleModel: 'Fortuner', phone: '+91 90011 22334', whatsapp: '919001122334', cityId: 3, cityName: 'Mirik', areaId: 301, areaName: 'Bus Stand', categories: ['Owner', 'Driver'] },
      { id: 8, name: 'Sanjay Das', initials: 'SD', avatarBg: '#E0F2FE', avatarColor: '#0284C7', vehicleMake: 'Mahindra', vehicleModel: 'Scorpio', phone: '+91 88776 55443', whatsapp: '918877655443', cityId: 4, cityName: 'Siliguri', areaId: 401, areaName: 'SNT Stand', categories: ['Vendor', 'Driver'] }
      ,{ id: 9, name: 'Maya Rai', initials: 'MR', avatarBg: '#FCE7F3', avatarColor: '#BE185D', vehicleMake: 'Maruti Suzuki', vehicleModel: 'WagonR', phone: '+91 90123 45678', whatsapp: '919012345678', cityId: 4, cityName: 'Siliguri', areaId: 402, areaName: 'Junction Stand', categories: ['Owner'] }
      ,{ id: 10, name: 'Rita Chettri', initials: 'RC', avatarBg: '#FEF3C7', avatarColor: '#B45309', vehicleMake: 'Toyota', vehicleModel: 'Glanza', phone: '+91 90909 12121', whatsapp: '919090912121', cityId: 1, cityName: 'Darjeeling', areaId: 102, areaName: 'Chowrasta Stand', categories: ['Vendor'] }
      ,{ id: 11, name: 'Joseph Lepcha', initials: 'JL', avatarBg: '#DBEAFE', avatarColor: '#1D4ED8', vehicleMake: 'Mahindra', vehicleModel: 'Scorpio', phone: '+91 93333 44556', whatsapp: '919333344556', cityId: 2, cityName: 'Kalimpong', areaId: 201, areaName: 'Taxi Stand', categories: ['Owner', 'Vendor'] }
      ,{ id: 12, name: 'Nima Bhutia', initials: 'NB', avatarBg: '#DCFCE7', avatarColor: '#15803D', vehicleMake: 'Force', vehicleModel: 'Traveller', phone: '+91 94444 66778', whatsapp: '919444466778', cityId: 3, cityName: 'Mirik', areaId: 301, areaName: 'Bus Stand', categories: ['Owner', 'Driver', 'Vendor'] }
      ,{ id: 13, name: 'Tashi Dorjee', initials: 'TD', avatarBg: '#E0F2FE', avatarColor: '#0369A1', vehicleMake: 'Toyota', vehicleModel: 'Rumion', phone: '+91 95555 88990', whatsapp: '919555588990', cityId: 1, cityName: 'Darjeeling', areaId: 103, areaName: 'Lloyds Stand', categories: ['Driver'] }
      ,{ id: 14, name: 'Sunita Tamang', initials: 'ST', avatarBg: '#F3E8FF', avatarColor: '#7E22CE', vehicleMake: 'Maruti Suzuki', vehicleModel: 'Ertiga', phone: '+91 96666 11223', whatsapp: '919666611223', cityId: 4, cityName: 'Siliguri', areaId: 401, areaName: 'SNT Stand', categories: ['Driver', 'Vendor'] }
    ];

    let persistedDrivers = [];
    try {
      persistedDrivers = JSON.parse(localStorage.getItem('driver-directory-admin-records') || '[]');
    } catch {
      persistedDrivers = [];
    }
    const availableDrivers = (persistedDrivers.length ? persistedDrivers : MOCK_DRIVERS).filter(driver => !driver.hidden);
    let result = [...availableDrivers];
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q));
    }
    if (selectedCity && selectedCity !== 'all') {
      const cId = parseInt(selectedCity, 10);
      result = result.filter(d => d.cityId === cId);
    }
    if (selectedArea && selectedArea !== 'all') {
      const aId = parseInt(selectedArea, 10);
      result = result.filter(d => d.areaId === aId);
    }
    if (selectedCarCategory && selectedCarCategory !== 'all') {
      result = result.filter(d => matchesCarType(d, selectedCarCategory));
    }
    if (selectedCategories && selectedCategories.length > 0) {
      result = result.filter(d => selectedCategories.every(reqCat => d.categories.includes(reqCat)));
    }
    if (sortOption === 'name-asc') result.sort((a,b) => a.name.localeCompare(b.name));
    if (sortOption === 'name-desc') result.sort((a,b) => b.name.localeCompare(a.name));
    if (sortOption === 'city') result.sort((a,b) => a.cityName.localeCompare(b.cityName));

    return {
      count: result.length,
      total: availableDrivers.length,
      drivers: result
    };
  }
}
