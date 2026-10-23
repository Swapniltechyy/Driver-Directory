const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-Memory Relational Seed Data
const CITIES_DATA = [
  { id: 1, name: 'Darjeeling' },
  { id: 2, name: 'Kalimpong' },
  { id: 3, name: 'Mirik' },
  { id: 4, name: 'Siliguri' }
];

const AREAS_DATA = [
  { id: 101, cityId: 1, name: 'Mall Road Stand' },
  { id: 102, cityId: 1, name: 'Chowrasta Stand' },
  { id: 103, cityId: 1, name: 'Lloyds Stand' },
  { id: 201, cityId: 2, name: 'Taxi Stand' },
  { id: 301, cityId: 3, name: 'Bus Stand' },
  { id: 401, cityId: 4, name: 'SNT Stand' },
  { id: 402, cityId: 4, name: 'Junction Stand' }
];

const DRIVERS_DATA = [
  {
    id: 1,
    name: 'Ramesh Thapa',
    initials: 'RT',
    avatarBg: '#E0F2FE',
    avatarColor: '#0369A1',
    vehicleMake: 'Toyota',
    vehicleModel: 'Innova',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    cityId: 1,
    cityName: 'Darjeeling',
    areaId: 101,
    areaName: 'Mall Road Stand',
    categories: ['Owner', 'Driver']
  },
  {
    id: 2,
    name: 'Suresh Rai',
    initials: 'SR',
    avatarBg: '#DCFCE7',
    avatarColor: '#15803D',
    vehicleMake: 'Mahindra',
    vehicleModel: 'Bolero',
    phone: '+91 87654 32109',
    whatsapp: '918765432109',
    cityId: 1,
    cityName: 'Darjeeling',
    areaId: 101,
    areaName: 'Mall Road Stand',
    categories: ['Owner', 'Driver']
  },
  {
    id: 3,
    name: 'Pawan Gurung',
    initials: 'PG',
    avatarBg: '#F3E8FF',
    avatarColor: '#7E22CE',
    vehicleMake: 'Mahindra',
    vehicleModel: 'Xylo',
    phone: '+91 94321 65432',
    whatsapp: '919432165432',
    cityId: 1,
    cityName: 'Darjeeling',
    areaId: 102,
    areaName: 'Chowrasta Stand',
    categories: ['Owner', 'Vendor']
  },
  {
    id: 4,
    name: 'Karan Lama',
    initials: 'KL',
    avatarBg: '#FEF3C7',
    avatarColor: '#B45309',
    vehicleMake: 'Toyota',
    vehicleModel: 'Innova',
    phone: '+91 96543 21098',
    whatsapp: '919654321098',
    cityId: 2,
    cityName: 'Kalimpong',
    areaId: 201,
    areaName: 'Taxi Stand',
    categories: ['Driver']
  },
  {
    id: 5,
    name: 'Anil Sharma',
    initials: 'AS',
    avatarBg: '#CCFBF1',
    avatarColor: '#0F766E',
    vehicleMake: 'Maruti Suzuki',
    vehicleModel: 'Swift',
    phone: '+91 91234 56789',
    whatsapp: '919123456789',
    cityId: 2,
    cityName: 'Kalimpong',
    areaId: 201,
    areaName: 'Taxi Stand',
    categories: ['Owner', 'Driver']
  },
  {
    id: 6,
    name: 'Deepak Singh',
    initials: 'DS',
    avatarBg: '#FEE2E2',
    avatarColor: '#B91C1C',
    vehicleMake: 'Maruti Suzuki',
    vehicleModel: 'Ertiga',
    phone: '+91 98887 76655',
    whatsapp: '919888776655',
    cityId: 1,
    cityName: 'Darjeeling',
    areaId: 103,
    areaName: 'Lloyds Stand',
    categories: ['Driver', 'Vendor']
  },
  {
    id: 7,
    name: 'Bikash Tamang',
    initials: 'BT',
    avatarBg: '#EDE9FE',
    avatarColor: '#6D28D9',
    vehicleMake: 'Toyota',
    vehicleModel: 'Fortuner',
    phone: '+91 90011 22334',
    whatsapp: '919001122334',
    cityId: 3,
    cityName: 'Mirik',
    areaId: 301,
    areaName: 'Bus Stand',
    categories: ['Owner', 'Driver']
  },
  {
    id: 8,
    name: 'Sanjay Das',
    initials: 'SD',
    avatarBg: '#E0F2FE',
    avatarColor: '#0284C7',
    vehicleMake: 'Mahindra',
    vehicleModel: 'Scorpio',
    phone: '+91 88776 55443',
    whatsapp: '918877655443',
    cityId: 4,
    cityName: 'Siliguri',
    areaId: 401,
    areaName: 'SNT Stand',
    categories: ['Vendor', 'Driver']
  }
];

// --- API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Driver Directory Node.js API', timestamp: new Date().toISOString() });
});

// Get Cities
app.get('/api/cities', (req, res) => {
  res.json(CITIES_DATA);
});

// Get Areas (Filtered by City)
app.get('/api/areas', (req, res) => {
  const cityId = req.query.cityId ? parseInt(req.query.cityId, 10) : null;
  if (cityId) {
    const filteredAreas = AREAS_DATA.filter(area => area.cityId === cityId);
    return res.json(filteredAreas);
  }
  res.json(AREAS_DATA);
});

// Get Drivers with filtering & sorting
app.get('/api/drivers', (req, res) => {
  let { search, cityId, areaId, categories, sort } = req.query;

  let filtered = [...DRIVERS_DATA];

  // 1. Search Query
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(driver => driver.name.toLowerCase().includes(q));
  }

  // 2. City Filter
  if (cityId && cityId !== 'all' && cityId !== '') {
    const cId = parseInt(cityId, 10);
    filtered = filtered.filter(driver => driver.cityId === cId);
  }

  // 3. Area Filter
  if (areaId && areaId !== 'all' && areaId !== '') {
    const aId = parseInt(areaId, 10);
    filtered = filtered.filter(driver => driver.areaId === aId);
  }

  // 4. Category Filter (Strict AND matching)
  if (categories) {
    let catArray = Array.isArray(categories) ? categories : categories.split(',');
    catArray = catArray.map(c => c.trim()).filter(Boolean);

    if (catArray.length > 0) {
      filtered = filtered.filter(driver => {
        return catArray.every(reqCat => driver.categories.includes(reqCat));
      });
    }
  }

  // 5. Sorting
  if (sort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === 'city') {
    filtered.sort((a, b) => a.cityName.localeCompare(b.cityName));
  }

  res.json({
    count: filtered.length,
    total: DRIVERS_DATA.length,
    drivers: filtered
  });
});

// Get Driver by ID
app.get('/api/drivers/:id', (req, res) => {
  const driverId = parseInt(req.params.id, 10);
  const driver = DRIVERS_DATA.find(d => d.id === driverId);
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.json(driver);
});

// Serve Static React Client App
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Driver Directory Backend] Express server running on port ${PORT}`);
});
