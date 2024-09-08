const express = require('express');
const router = express.Router();
const crowdfundingController = require('../controllers/crowdfundingController');

router.post('/create', crowdfundingController.createCampaign);
router.get('/campaign/:tokenId', crowdfundingController.getCampaignDetails);
router.post('/end', crowdfundingController.endCampaign);

module.exports = router;