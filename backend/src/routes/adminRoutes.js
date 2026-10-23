const express = require('express');
const multer = require('multer');
const adminController = require('../controllers/adminController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/login', adminController.login);
router.use(adminController.requireAuth);
router.get('/drivers', adminController.listDrivers);
router.post('/drivers', adminController.createDriver);
router.patch('/drivers/:id', adminController.updateDriver);
router.delete('/drivers/:id', adminController.deleteDriver);
router.post('/import', upload.single('file'), adminController.importDrivers);
router.get('/export.xlsx', adminController.exportSpreadsheet);
router.get('/export.csv', adminController.exportCsv);
router.get('/export.pdf', adminController.exportPdf);

module.exports = router;
