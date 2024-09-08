const express = require('express');
const { ethers } = require('ethers');
const CrowdfundingSatelliteABI = require('./lib/abis/CrowdfundingSatellite.json');
const constant = require('./constant.js');

const app = express();
const port = 3000; // You can change this to any port you prefer

// Set up the provider and contract
const provider = new ethers.providers.JsonRpcProvider(
  constant.CHAINS.CHILLIZ_TESTNET.RPC_URL
);

const crowdfundingContract = new ethers.Contract(
  constant.CHAINS.CHILLIZ_TESTNET.TOKEN_ADDRESSES.CrowdfundingSatellite,
  CrowdfundingSatelliteABI,
  provider
);

app.get('/api/campaign/:tokenId', async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const campaignDetails = await crowdfundingContract.getCampaignDetails(tokenId);

    const response = {
      creator: campaignDetails[0],
      goal: ethers.utils.formatEther(campaignDetails[1]),
      totalFunded: ethers.utils.formatEther(campaignDetails[2]),
      endTime: new Date(campaignDetails[3].toNumber() * 1000).toISOString(),
      isActive: campaignDetails[4],
      tokenAddress: campaignDetails[5]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching campaign details:', error);
    res.status(500).json({ error: 'An error occurred while fetching campaign details' });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});