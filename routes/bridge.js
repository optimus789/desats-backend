const express = require('express');
const router = express.Router();
const bridgeController = require('../controllers/bridgeController');

// Existing routes
router.post('/mint', bridgeController.mintToken);
router.post('/burn', bridgeController.burnToken);
router.get('/nextTokenId', bridgeController.getNextTokenId);

// New route for image generation
router.post('/generateImage', bridgeController.generateImage);

module.exports = router;