const express = require('express');
const router = express.Router();
const satelliteController = require('../controllers/satelliteController');

// GET /api/satellite
router.
get('/', satelliteController.getSatelliteInfo);

// Add this new route
router.get('/tle/:noradId', satelliteController.getSatelliteTLE);

module.exports = router;