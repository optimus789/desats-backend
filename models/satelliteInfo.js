const mongoose = require('mongoose');

const satelliteInfoSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  satelliteName: {
    type: String,
    required: true,
  },
  organizationName: {
    type: String,
    required: true,
  },
  whitepaperLink: {
    type: String,
    required: true,
  },
  isCrowdfunding: {
    type: Boolean,
    required: true,
  },
  missionLaunchDate: {
    type: Date,
    required: true,
  },
  satelliteDescription: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    default: null,
  },
  txHash: {
    type: String,
    default: null,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const SatelliteInfo = mongoose.model('SatelliteInfo', satelliteInfoSchema);

module.exports = SatelliteInfo;
