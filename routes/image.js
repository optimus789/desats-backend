const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.post('/generate', imageController.initializeImageGeneration);
router.get('/:chain/:tokenId', imageController.getImageUrl);

module.exports = router;