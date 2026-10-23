const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.get('/drivers', driverController.getDrivers);
router.get('/drivers/:id', driverController.getDriverById);

module.exports = router;
