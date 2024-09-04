const mongoose = require('mongoose');

const globalTokenIdSchema = new mongoose.Schema({
  currentTokenId: {
    type: Number,
    required: true,
    default: 0
  }
});

const GlobalTokenId = mongoose.model('GlobalTokenId', globalTokenIdSchema);

module.exports = GlobalTokenId;