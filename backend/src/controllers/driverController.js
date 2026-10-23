const { DRIVERS_DATA } = require('../data/seedData');

function matchesCarType(driver, carType) {
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

exports.getDrivers = (req, res) => {
  try {
    let { search, cityId, areaId, carCategory, categories, sort } = req.query;

    let filtered = DRIVERS_DATA.filter(driver => !driver.hidden);

    // 1. Partial Name Search
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

    // 4. Car Category Filter
    if (carCategory && carCategory !== 'all' && carCategory !== '') {
      filtered = filtered.filter(driver => matchesCarType(driver, carCategory));
    }

    // 5. Strict AND-based Category Filter
    if (categories) {
      let catArray = Array.isArray(categories) ? categories : categories.split(',');
      catArray = catArray.map(c => c.trim()).filter(Boolean);

      if (catArray.length > 0) {
        filtered = filtered.filter(driver => {
          return catArray.every(reqCat => driver.categories.includes(reqCat));
        });
      }
    }

    // 5. Sorting Logic
    if (sort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'city') {
      filtered.sort((a, b) => a.cityName.localeCompare(b.cityName));
    }

    res.json({
      count: filtered.length,
      total: filtered.length,
      drivers: filtered
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

exports.getDriverById = (req, res) => {
  try {
    const driverId = parseInt(req.params.id, 10);
    const driver = DRIVERS_DATA.find(d => d.id === driverId && !d.hidden);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver details' });
  }
};
