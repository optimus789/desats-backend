require('dotenv').config();
const { ethers } = require('ethers');
const CrowdfundingSatelliteABI = require('../lib/abis/CrowdfundingSatellite.json');
const constant = require('../constant');

const provider = new ethers.providers.JsonRpcProvider(
  constant.CHAINS.CHILLIZ_TESTNET.RPC_URL
);

const crowdfundingContract = new ethers.Contract(
  constant.CHAINS.CHILLIZ_TESTNET.TOKEN_ADDRESSES.CrowdfundingSatellite,
  CrowdfundingSatelliteABI,
  provider
);

exports.getCampaignDetails = async (req, res) => {
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
};

exports.createCampaign = async (req, res) => {
  try {
    const { tokenId, creator, goal, duration } = req.body;
    const wallet = new ethers.Wallet(process.env.KEY, provider);
    const connectedContract = crowdfundingContract.connect(wallet);

    const tx = await connectedContract.createCampaign(
      tokenId,
      creator,
      ethers.utils.parseEther(goal),
      duration,
      constant.CHAINS.CHILLIZ_TESTNET.TOKEN_ADDRESSES.SATFAN
    );
    await tx.wait();

    res.json({ message: 'Campaign created successfully', transactionHash: tx.hash });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'An error occurred while creating the campaign' });
  }
};

exports.endCampaign = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const wallet = new ethers.Wallet(process.env.KEY, provider);
    const connectedContract = crowdfundingContract.connect(wallet);

    const campaignDetails = await connectedContract.getCampaignDetails(tokenId);
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = campaignDetails[3].toNumber();
    const isGoalReached = campaignDetails[2].gte(campaignDetails[1]);

    if (currentTime < endTime && !isGoalReached) {
      return res.status(400).json({ error: 'Campaign cannot be ended yet' });
    }

    const tx = await connectedContract.endCampaign(tokenId);
    await tx.wait();

    res.json({ message: 'Campaign ended successfully', transactionHash: tx.hash });
  } catch (error) {
    console.error('Error ending campaign:', error);
    res.status(500).json({ error: 'An error occurred while ending the campaign' });
  }
};