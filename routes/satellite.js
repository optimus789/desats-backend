const express = require('express');
const router = express.Router();
const satelliteController = require('../controllers/satelliteController');

// GET /api/satellite
router.get('/', satelliteController.getSatelliteInfo);

module.exports = router;