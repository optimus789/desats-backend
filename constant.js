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
    CHILLIZ_TESTNET: {
      RPC_URL: 'https://spicy-rpc.chiliz.com',
      CHAIN_ID: 88882,
      TOKEN_ADDRESSES: {
        CrowdfundingSatellite: '0x443393eB7108258b6a3394c7b79728E0353B4Bff',
        SATFAN: '0x11FbbFae0739461037Be6D28C52C35D13476514d'
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
