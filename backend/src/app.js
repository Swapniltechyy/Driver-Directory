const express = require('express');
const cors = require('cors');
const path = require('path');

const locationRoutes = require('./routes/locationRoutes');
const driverRoutes = require('./routes/driverRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Driver Directory Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', locationRoutes);
app.use('/api', driverRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend Static Build if present
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendBuildPath));
app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

module.exports = app;
