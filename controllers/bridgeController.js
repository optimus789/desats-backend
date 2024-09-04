const { ethers } = require('ethers');
const path = require('path');
const DeSatsABI = require('../lib/abis/DeSats.json');
const DeSatsImgABI = require('../lib/abis/DeSatsImg.json');
const constants = require('../constant');
const GlobalTokenId = require('../models/globalTokenId');

const getProvider = (chain) => {
  const chainDetails = constants.CHAINS[chain.toUpperCase()];
  if (!chainDetails) {
    throw new Error('Invalid chain specified');
  }
  return new ethers.providers.JsonRpcProvider(chainDetails.RPC_URL);
};

const getSigner = async (provider) => {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return wallet;
};

exports.mintToken = async (req, res) => {
  const { to, chain, tokenId } = req.body;

  try {
    const provider = getProvider(chain);
    const signer = await getSigner(provider);
    const deSatsContract = new ethers.Contract(constants.CHAINS[chain.toUpperCase()].TOKEN_ADDRESSES.DeSats, DeSatsABI, signer);

    const tx = await deSatsContract.mintToken(to, tokenId);
    await tx.wait();

    res.send(`Token with ID ${tokenId} minted to ${to} on ${chain}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.burnToken = async (req, res) => {
  const { from, chain, tokenId } = req.body;

  try {
    const provider = getProvider(chain);
    const signer = await getSigner(provider);
    const deSatsContract = new ethers.Contract(constants.CHAINS[chain.toUpperCase()].TOKEN_ADDRESSES.DeSats, DeSatsABI, signer);

    const tx = await deSatsContract.burnToken(tokenId);
    await tx.wait();

    res.send(`Token with ID ${tokenId} burned from ${from} on ${chain}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getNextTokenId = async (req, res) => {
  try {
    let globalTokenId = await GlobalTokenId.findOne();
    if (!globalTokenId) {
      globalTokenId = new GlobalTokenId();
      await globalTokenId.save();
    }

    const nextTokenId = globalTokenId.currentTokenId + 1;
    globalTokenId.currentTokenId = nextTokenId;
    await globalTokenId.save();

    res.json({ nextTokenId });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Add a new function for image generation
exports.generateImage = async (req, res) => {
  const { prompt, chain } = req.body;

  try {
    const provider = getProvider(chain);
    const signer = await getSigner(provider);
    const deSatsImgContract = new ethers.Contract(constants.CHAINS[chain.toUpperCase()].TOKEN_ADDRESSES.DeSatsImg, DeSatsImgABI, signer);

    const tx = await deSatsImgContract.initializeImageGeneration(prompt);
    const receipt = await tx.wait();

    // Assuming the event ImageInputCreated is emitted with the tokenId
    const event = receipt.events.find(e => e.event === 'ImageInputCreated');
    const tokenId = event.args.tokenId.toString();

    res.send(`Image generation initialized with token ID ${tokenId} on ${chain}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};