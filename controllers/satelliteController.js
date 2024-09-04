const SatelliteInfo = require('../models/satelliteInfo');

exports.getSatelliteInfo = async (req, res) => {
  try {
    const { address, tokenId } = req.query;

    let query = {};
    if (address) query.address = address;
    if (tokenId) query.tokenId = tokenId;

    const satelliteInfo = await SatelliteInfo.find(query);

    if (satelliteInfo.length === 0) {
      return res.status(404).json({ message: 'No satellite information found' });
    }

    res.json(satelliteInfo);
  } catch (error) {
    console.error('Error fetching satellite info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
