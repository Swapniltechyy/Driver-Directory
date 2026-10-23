const { CITIES_DATA, AREAS_DATA } = require('../data/seedData');

exports.getCities = (req, res) => {
  try {
    res.json(CITIES_DATA);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

exports.getAreas = (req, res) => {
  try {
    const { cityId } = req.query;
    if (cityId && cityId !== 'all') {
      const parsedCityId = parseInt(cityId, 10);
      const filteredAreas = AREAS_DATA.filter(area => area.cityId === parsedCityId);
      return res.json(filteredAreas);
    }
    res.json(AREAS_DATA);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch areas' });
  }
};
