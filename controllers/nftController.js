const NFT = require('../models/nft');

// List NFTs
exports.listNFTs = async (req, res) => {
  try {
    const nfts = await NFT.find();
    res.json(nfts);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Bid on an NFT
exports.bidOnNFT = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    if (!nft) {
      return res.status(404).send('NFT not found');
    }
    // Logic to place a bid
    res.send(`Bid placed on NFT with ID ${req.params.id}`);
  } catch (err) {
    res.status(500).send(err);
  }
};