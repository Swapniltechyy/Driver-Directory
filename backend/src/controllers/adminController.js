const XLSX = require('xlsx');
const pdfParse = require('pdf-parse');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');
const { CITIES_DATA, AREAS_DATA, DRIVERS_DATA } = require('../data/seedData');

const ROLE_NAMES = ['Owner', 'Driver', 'Vendor'];
const activeAdminTokens = new Set();

exports.login = (req, res) => {
  const username = text(req.body?.username);
  const password = text(req.body?.password);
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin@driverhub.com';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  if (username !== expectedUsername || password !== expectedPassword) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }
  const token = crypto.randomBytes(24).toString('hex');
  activeAdminTokens.add(token);
  res.json({ token, user: { username, role: 'admin' } });
};

exports.requireAuth = (req, res, next) => {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!activeAdminTokens.has(token)) return res.status(401).json({ error: 'Admin authentication required' });
  next();
};

function nextId() {
  return DRIVERS_DATA.reduce((highest, driver) => Math.max(highest, driver.id), 0) + 1;
}

function text(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function findCity(cityValue) {
  const value = text(cityValue);
  const byId = CITIES_DATA.find(city => String(city.id) === value);
  const byName = CITIES_DATA.find(city => city.name.toLowerCase() === value.toLowerCase());
  return byId || byName || CITIES_DATA[0];
}

function findArea(areaValue, cityId) {
  const value = text(areaValue);
  return AREAS_DATA.find(area => String(area.id) === value)
    || AREAS_DATA.find(area => area.cityId === cityId && area.name.toLowerCase() === value.toLowerCase())
    || AREAS_DATA.find(area => area.cityId === cityId)
    || AREAS_DATA[0];
}

function parseCategories(value) {
  const raw = Array.isArray(value) ? value : text(value).split(/[,|+]/);
  return [...new Set(raw.map(item => text(item)).filter(item => ROLE_NAMES.includes(item)))];
}

function normalizeDriver(input, existing = {}) {
  const city = findCity(input.cityId || input.city || input.cityName || existing.cityId || existing.cityName);
  const area = findArea(input.areaId || input.area || input.areaName || existing.areaId || existing.areaName, city.id);
  const name = text(input.name || input.driverName || existing.name);
  const categories = parseCategories(input.categories || input.category || existing.categories);
  const ratingValue = Number(input.rating ?? existing.rating ?? 0);
  const rating = Number.isFinite(ratingValue) ? Math.min(5, Math.max(0, Math.round(ratingValue))) : 0;

  return {
    ...existing,
    id: existing.id || nextId(),
    name,
    initials: name.split(/\s+/).filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'DR',
    avatarBg: existing.avatarBg || '#E0F2FE',
    avatarColor: existing.avatarColor || '#0369A1',
    vehicleMake: text(input.vehicleMake || input.make || existing.vehicleMake || 'Toyota'),
    vehicleModel: text(input.vehicleModel || input.model || existing.vehicleModel || 'Innova'),
    phone: text(input.phone || existing.phone),
    whatsapp: text(input.whatsapp || existing.whatsapp || input.phone).replace(/\D/g, ''),
    cityId: city.id,
    cityName: city.name,
    areaId: area.id,
    areaName: area.name,
    categories: categories.length ? categories : (existing.categories || ['Driver']),
    rating,
    hidden: input.hidden !== undefined ? Boolean(input.hidden) : Boolean(existing.hidden)
  };
}

exports.listDrivers = (req, res) => {
  const query = text(req.query.search).toLowerCase();
  const drivers = query
    ? DRIVERS_DATA.filter(driver => [driver.name, driver.phone, driver.cityName, driver.areaName].some(value => text(value).toLowerCase().includes(query)))
    : DRIVERS_DATA;
  res.json({ count: drivers.length, total: DRIVERS_DATA.length, drivers });
};

exports.createDriver = (req, res) => {
  const driver = normalizeDriver(req.body);
  if (!driver.name) return res.status(400).json({ error: 'Name is required' });
  DRIVERS_DATA.push(driver);
  res.status(201).json(driver);
};

exports.updateDriver = (req, res) => {
  const id = Number(req.params.id);
  const index = DRIVERS_DATA.findIndex(driver => driver.id === id);
  if (index < 0) return res.status(404).json({ error: 'Driver not found' });
  DRIVERS_DATA[index] = normalizeDriver(req.body, DRIVERS_DATA[index]);
  res.json(DRIVERS_DATA[index]);
};

exports.deleteDriver = (req, res) => {
  const id = Number(req.params.id);
  const index = DRIVERS_DATA.findIndex(driver => driver.id === id);
  if (index < 0) return res.status(404).json({ error: 'Driver not found' });
  const [deleted] = DRIVERS_DATA.splice(index, 1);
  res.json({ deleted });
};

exports.importDrivers = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Upload an Excel, CSV, or PDF file' });
  const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
  try {
    if (isPdf) {
      return pdfParse(req.file.buffer).then(result => {
        const rows = result.text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        const imported = rows
          .filter(line => !/^name\s*[|,\t]/i.test(line))
          .map(line => {
            const columns = line.split(/\s*\|\s*|\t|\s{2,}/).map(item => item.trim());
            return normalizeDriver({
              name: columns[0], phone: columns[1], city: columns[2], area: columns[3],
              categories: columns[4], vehicleMake: columns[5], vehicleModel: columns[6], rating: columns[7]
            });
          })
          .filter(driver => driver.name);
        if (!imported.length) {
          return res.status(422).json({ error: 'No selectable driver text found. Use a text-based PDF or upload Excel/CSV.' });
        }
        DRIVERS_DATA.push(...imported);
        return res.status(201).json({ imported: imported.length, skipped: rows.length - imported.length, drivers: imported, format: 'pdf' });
      }).catch(() => res.status(400).json({ error: 'Could not read this PDF' }));
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const imported = rows.map(row => normalizeDriver({
      name: row.Name || row.name || row['Driver Name'],
      phone: row.Phone || row.phone || row.Mobile,
      whatsapp: row.WhatsApp || row.whatsapp,
      city: row.City || row.city,
      area: row.Area || row.area || row.Stand,
      categories: row.Categories || row.categories || row.Category,
      vehicleMake: row['Vehicle Make'] || row.vehicleMake || row.Make,
      vehicleModel: row['Vehicle Model'] || row.vehicleModel || row.Model,
      rating: row.Rating || row.rating
    }));
    const valid = imported.filter(driver => driver.name);
    DRIVERS_DATA.push(...valid);
    res.status(201).json({ imported: valid.length, skipped: rows.length - valid.length, drivers: valid, format: 'spreadsheet' });
  } catch (error) {
    res.status(400).json({ error: 'Could not read this spreadsheet' });
  }
};

exports.exportSpreadsheet = (req, res) => {
  const worksheet = XLSX.utils.json_to_sheet(DRIVERS_DATA.map(driver => ({
    Name: driver.name,
    Phone: driver.phone,
    City: driver.cityName,
    Area: driver.areaName,
    Categories: driver.categories.join(', '),
    'Vehicle Make': driver.vehicleMake,
    'Vehicle Model': driver.vehicleModel,
    Rating: driver.rating || 0
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Drivers');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="driver-directory.xlsx"');
  res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').send(buffer);
};

exports.exportCsv = (req, res) => {
  const worksheet = XLSX.utils.json_to_sheet(DRIVERS_DATA);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  res.setHeader('Content-Disposition', 'attachment; filename="driver-directory.csv"');
  res.type('text/csv').send(csv);
};

exports.exportPdf = (req, res) => {
  const document = new PDFDocument({ margin: 42, size: 'A4' });
  res.setHeader('Content-Disposition', 'attachment; filename="driver-directory.pdf"');
  res.type('application/pdf');
  document.pipe(res);
  document.fontSize(18).fillColor('#0F172A').text('Driver Directory', { continued: false });
  document.fontSize(9).fillColor('#64748B').text(`Exported records: ${DRIVERS_DATA.length}`);
  document.moveDown();
  DRIVERS_DATA.forEach((driver, index) => {
    if (index > 0) document.moveDown(0.4);
    document.fontSize(11).fillColor('#0F172A').text(`${index + 1}. ${driver.name}`);
    document.fontSize(9).fillColor('#334155').text(`${driver.phone || 'No phone'}  |  ${driver.cityName}, ${driver.areaName}`);
    document.text(`Roles: ${driver.categories.join(', ')}  |  Rating: ${driver.rating || 'Not rated'}/5`);
    document.text(`Vehicle: ${driver.vehicleMake} ${driver.vehicleModel}`);
  });
  document.end();
};
