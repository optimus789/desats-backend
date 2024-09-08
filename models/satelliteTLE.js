const mongoose = require('mongoose');

const satelliteTLESchema = new mongoose.Schema({
  satelliteId: {
    type: String,
    required: true,
    index: true
  },
  tleData: {
    type: Object,
    required: true
  },
  lastSynced: {
    type: Date,
    default: Date.now
  }
});

const SatelliteTLE = mongoose.model('SatelliteTLE', satelliteTLESchema);

module.exports = SatelliteTLE;