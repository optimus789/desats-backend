const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  name: String,
  owner: String,
  price: Number,
  launchDate: Date
});

const NFT = mongoose.model('NFT', nftSchema);

module.exports = NFT;