require('dotenv').config();
const SatelliteInfo = require('../models/satelliteInfo');
const SatelliteTLE = require('../models/satelliteTLE');
const axios = require('axios');

exports.getSatelliteInfo = async (req, res) => {
  try {
    const { address, tokenId, isCrowdfunding } = req.query;

    let query = {};
    if (address) query.address = address;
    if (tokenId) query.tokenId = tokenId;
    if (isCrowdfunding) query.isCrowdfunding = Boolean(isCrowdfunding);
    const satelliteInfo = await SatelliteInfo.find(query);

    if (satelliteInfo.length === 0) {
      return res
        .status(404)
        .json({ message: 'No satellite information found' });
    }

    res.json(satelliteInfo);
  } catch (error) {
    console.error('Error fetching satellite info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add this new function
exports.getSatelliteTLE = async (req, res) => {
  try {
    const { noradId } = req.params;
    const satelliteId = noradId; // Using noradId as satelliteId

    // Check if we have recent data in the database
    const cachedData = await SatelliteTLE.findOne({ satelliteId });
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000); // 10 seconds ago

    if (cachedData && cachedData.lastSynced > tenSecondsAgo) {
      return res.json(cachedData.tleData);
    }

    // If no recent data, fetch from the API
    const apiKey = process.env.N2YO_API_KEY;
    const url = `https://api.n2yo.com/rest/v1/satellite/tle/${satelliteId}&apiKey=${apiKey}`;
    const response = await axios.get(url);
    // Update or insert the data in the database
    await SatelliteTLE.findOneAndUpdate(
      { satelliteId },
      { 
        satelliteId,
        tleData: response.data,
        lastSynced: now
      },
      { upsert: true, new: true }
    );

    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching satellite TLE:', error);
    res.status(500).json({ message: 'Error fetching satellite TLE' });
  }
};
