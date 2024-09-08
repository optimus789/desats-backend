require('dotenv').config();
const { run } = require('@xmtp/message-kit');
const { getRedisClient } = require('./lib/redis.js');
const { ethers } = require('ethers');
const DeSatsImgABI = require('./lib/abis/DeSatsImg.json');
const constant = require('./constant.js');
const SatelliteInfo = require('./models/satelliteInfo');
const CrowdfundingSatelliteABI = require('./lib/abis/CrowdfundingSatellite.json');

let redisClient;

const provider = new ethers.providers.JsonRpcProvider(
  constant.CHAINS.GALADRIEL_TESTNET.RPC_URL
);

const chillizProvider = new ethers.providers.JsonRpcProvider(
  constant.CHAINS.CHILLIZ_TESTNET.RPC_URL
);

const wallet = new ethers.Wallet(process.env.KEY, provider);

const chillizWallet = new ethers.Wallet(process.env.KEY, chillizProvider);

const deSatsImgContract = new ethers.Contract(
  constant.CHAINS.GALADRIEL_TESTNET.TOKEN_ADDRESSES.DeSatsImg,
  DeSatsImgABI,
  wallet
);

const crowdfundingContract = new ethers.Contract(
  constant.CHAINS.CHILLIZ_TESTNET.TOKEN_ADDRESSES.CrowdfundingSatellite,
  CrowdfundingSatelliteABI,
  chillizWallet
);

const inMemoryCacheStep = new Map();
const userData = new Map();

const appConfig = {
  commands: [],
  commandHandlers: {},
};

async function initializeRedisClient() {
  redisClient = await getRedisClient();
}

async function handleMessage(context) {
  if (!redisClient) {
    await initializeRedisClient();
  }

  const {
    message: {
      content: { content: text },
      typeId,
      sender,
    },
  } = context;
  console.log(text, sender.address);

  if (text.toLowerCase() === 'stop' || text.toLowerCase() === 'reset') {
    inMemoryCacheStep.delete(sender.address);
    userData.delete(sender.address);
    await redisClient.del(sender.address);
    await context.send(
      "Your progress has been reset. You can start over whenever you're ready."
    );
    return;
  }

  if (typeId !== 'text') {
    return;
  }

  const step = inMemoryCacheStep.get(sender.address) || 0;
  const user = userData.get(sender.address) || {};

  // Check if this is the first message or a greeting
  if (step === 0 && ['hi', 'hello', 'hey'].includes(text.toLowerCase())) {
    await context.send(
      'Hello! Welcome to the DeSats Bot. You can share information about your satellite mission with me.'
    );
    await context.send(
      'Note: You can stop or reset this questionnaire at any time by typing "reset" or "stop".'
    );
    await context.send('What is your name?');
    inMemoryCacheStep.set(sender.address, 1);
    return;
  }

  switch (step) {
    case 0:
      await context.send(
        'Welcome to the DeSats Bot. You can share information about your satellite mission with me.'
      );
      await context.send(
        'Note: You can stop or reset this questionnaire at any time by typing "reset" or "stop".'
      );
      await context.send('What is your name?');
      inMemoryCacheStep.set(sender.address, 1);
      break;
    case 1:
      user.name = text;
      userData.set(sender.address, user);
      await context.send('What is your Satellite Name?');
      inMemoryCacheStep.set(sender.address, 2);
      break;
    case 2:
      user.satelliteName = text;
      userData.set(sender.address, user);
      await context.send('What is your organization Name?');
      inMemoryCacheStep.set(sender.address, 3);
      break;
    case 3:
      user.organizationName = text;
      userData.set(sender.address, user);
      await context.send('Please enter your whitepaper link:');
      inMemoryCacheStep.set(sender.address, 4);
      break;
    case 4: {
      const urlRegex =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (urlRegex.test(text)) {
        user.whitepaperLink = text;
        userData.set(sender.address, user);
        await context.send('Apply for Crowdfunding? (Please answer YES or NO)');
        inMemoryCacheStep.set(sender.address, 5);
      } else {
        await context.send(
          'Invalid URL. Please provide a valid whitepaper link.'
        );
      }
      break;
    }
    case 5:
      if (['yes', 'no'].includes(text.toLowerCase())) {
        user.isCrowdfunding = text.toLowerCase() === 'yes';
        userData.set(sender.address, user);
        if (user.isCrowdfunding) {
          await context.send(
            'Enter the duration of the crowdfunding campaign in days:'
          );
          inMemoryCacheStep.set(sender.address, 6);
        } else {
          await context.send('Enter Mission Launch Date in format: DD-MM-YYYY');
          inMemoryCacheStep.set(sender.address, 7);
        }
      } else {
        await context.send('Please answer YES or NO.');
      }
      break;
    case 6: {
      const duration = Number.parseInt(text, 10);
      if (!Number.isNaN(duration) && duration > 0) {
        user.crowdfundingDuration = duration * 24 * 60 * 60; // Convert days to seconds
        userData.set(sender.address, user);
        await context.send('Enter Mission Launch Date in format: DD-MM-YYYY');
        inMemoryCacheStep.set(sender.address, 7);
      } else {
        await context.send(
          'Invalid duration. Please enter a valid number of days.'
        );
      }
      break;
    }
    case 7: {
      const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
      if (dateRegex.test(text)) {
        const [, day, month, year] = text.match(dateRegex);
        const date = new Date(`${year}-${month}-${day}`);
        if (!Number.isNaN(date.getTime())) {
          user.missionLaunchDate = date;
          userData.set(sender.address, user);
          await context.send(
            'Description of the Satellite for the image generation:'
          );
          inMemoryCacheStep.set(sender.address, 8);
        } else {
          await context.send(
            'Invalid date. Please enter a valid date in the format DD-MM-YYYY.'
          );
        }
      } else {
        await context.send('Invalid date format. Please use DD-MM-YYYY.');
      }
      break;
    }
    case 8:
      user.satelliteDescription = text;
      userData.set(sender.address, user);

      // Save user data to MongoDB
      try {
        const satelliteInfo = new SatelliteInfo({
          address: sender.address,
          name: user.name,
          satelliteName: user.satelliteName,
          organizationName: user.organizationName,
          whitepaperLink: user.whitepaperLink,
          isCrowdfunding: user.isCrowdfunding,
          missionLaunchDate: user.missionLaunchDate,
          satelliteDescription: user.satelliteDescription,
          crowdfundingDuration: user.crowdfundingDuration,
        });
        await satelliteInfo.save();
      } catch (error) {
        console.error('Error saving satellite info to MongoDB:', error);
      }

      // Call Galadriel smart contract to initialize image generation
      try {
        const tx = await deSatsImgContract.initializeImageGeneration(
          user.satelliteDescription
        );
        const receipt = await tx.wait();

        const event = receipt.events.find(
          (e) => e.event === 'ImageInputCreated'
        );
        const tokenId = event.args.tokenId.toString();
        user.tokenId = tokenId;

        // Update the tokenId in MongoDB
        SatelliteInfo.findOneAndUpdate(
          { address: sender.address },
          { tokenId: tokenId, txHash: tx.hash }
        ).then(() => {});

        await context.send(
          `Thank you for providing the information. Your image generation has been initialized with token ID ${tokenId}. Please wait for the image to be generated.`
        );

        // Set up an event listener for the ImageGenerated event
        deSatsImgContract.once(
          'ImageGenerated',
          async (generatedTokenId, imageUrl) => {
            if (generatedTokenId.toString() === tokenId) {
              try {
                // Update the imageUrl in MongoDB
                await SatelliteInfo.findOneAndUpdate(
                  { tokenId: tokenId, txHash: tx.hash },
                  { imageUrl: imageUrl }
                );
                await context.send('Your satellite image has been generated:');
                await context.send(imageUrl);
              } catch (error) {
                console.error('Error updating image URL in MongoDB:', error);
              }
            }
          }
        );
      } catch (error) {
        console.error('Error initializing satellite image generation:', error);
        await context.send(
          'There was an error initializing the satellite image generation. Please try again later.'
        );
      }

      // Create crowdfunding campaign if user indicated they want to apply for crowdfunding
      if (user.isCrowdfunding) {
        try {
          const goal = ethers.utils.parseEther('100'); // Set an appropriate goal
          const duration = user.crowdfundingDuration; // Use the duration provided by the user
          const tokenAddress =
            constant.CHAINS.CHILLIZ_TESTNET.TOKEN_ADDRESSES.SATFAN; // Use appropriate token address

          const tx = await crowdfundingContract.createCampaign(
            Number(user.tokenId),
            sender.address, // Use the sender's address as the creator
            goal,
            duration,
            tokenAddress
          );
          const receipt = await tx.wait();
          console.log(receipt);
          await context.send(
            `A crowdfunding campaign has been created for your satellite project with token ID ${user.tokenId}. View the transaction on the explorer: https://testnet.chiliscan.com/tx/${receipt.transactionHash}`
          );
        } catch (error) {
          a;
          console.error('Error creating crowdfunding campaign:', error);
          await context.send(
            'There was an error creating the crowdfunding campaign. Please try again later.'
          );
        }
      }

      inMemoryCacheStep.delete(sender.address);
      userData.delete(sender.address);
      break;
  }
}

run(handleMessage, appConfig);

// Initialize Redis client when the bot starts
initializeRedisClient().catch(console.error);
