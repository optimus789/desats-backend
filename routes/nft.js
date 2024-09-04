const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');

// List NFTs
router.get('/nfts', nftController.listNFTs);

// Bid on an NFT
router.post('/nfts/:id/bid', nftController.bidOnNFT);

module.exports = router;