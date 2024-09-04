require('dotenv').config();
const { ethers } = require('ethers');
const DeSatsImgABI = require('../lib/abis/DeSatsImg.json');
const constants = require('../constant');

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

exports.initializeImageGeneration = async (req, res) => {
  const { prompt, chain } = req.body;

  try {
    const provider = getProvider(chain);
    const signer = await getSigner(provider);
    const deSatsImgContract = new ethers.Contract(constants.CHAINS[chain.toUpperCase()].TOKEN_ADDRESSES.DeSatsImg, DeSatsImgABI, signer);

    const tx = await deSatsImgContract.initializeImageGeneration(prompt);
    const receipt = await tx.wait();

    const event = receipt.events.find(e => e.event === 'ImageInputCreated');
    const tokenId = event.args.tokenId.toString();

    // Set up an event listener for the ImageGenerated event
    deSatsImgContract.once('ImageGenerated', async (generatedTokenId, imageUrl) => {
      if (generatedTokenId.toString() === tokenId) {
        console.log(`Image generated for token ID ${tokenId}: ${imageUrl}`);
        // Here you could implement additional logic, such as storing the imageUrl in a database
      }
    });

    res.json({ message: `Image generation initialized with token ID ${tokenId} on ${chain}`, tokenId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getImageUrl = async (req, res) => {
  const { tokenId, chain } = req.params;

  try {
    const provider = getProvider(chain);
    const deSatsImgContract = new ethers.Contract(constants.CHAINS[chain.toUpperCase()].TOKEN_ADDRESSES.DeSatsImg, DeSatsImgABI, provider);

    // Assuming there's a function to get the image URL for a given tokenId
    // If not, you might need to implement a different way to retrieve this information
    const imageUrl = await deSatsImgContract.getImageUrl(tokenId);

    res.json({ tokenId, imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};