module.exports = {
  CHAINS: {
    NETHERMIND: {
      RPC_URL: 'https://nethermind.io/rpc',
      CHAIN_ID: 1234, // Example chain ID
      TOKEN_ADDRESSES: {
        DeSatsImg: '0xYourNethermindDeSatsImgContractAddress'
      }
    },
    POLYGON_AMOY: {
      RPC_URL: 'https://polygon-amoy.io/rpc',
      CHAIN_ID: 137, // Example chain ID
      TOKEN_ADDRESSES: {
        DeSatsImg: '0xYourPolygonAmoyDeSatsImgContractAddress'
      }
    },
    GALADRIEL_TESTNET: {
      RPC_URL: 'https://devnet.galadriel.com/',
      CHAIN_ID: 5678, // Example chain ID
      TOKEN_ADDRESSES: {
        DeSatsImg: '0x7f258C6159caD4C86D693Bb42f474a5e9fFa3023'
      }
    },
    MAINNET: {
      RPC_URL: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
      CHAIN_ID: 1, // Mainnet
      TOKEN_ADDRESSES: {
        DeSatsImg: '0xYourMainnetDeSatsImgContractAddress'
      }
    }
  }
};
