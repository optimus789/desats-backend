# DeSats Satellite Information Bot

DeSats is a decentralized satellite information management system that leverages blockchain technology, XMTP messaging, and AI-generated imagery. This project combines various cutting-edge technologies to create a unique platform for satellite mission information collection and visualization.

## Technologies Used

### Galadriel
Galadriel is a blockchain network specifically designed for space-related applications. In this project, we use Galadriel for:
- Storing satellite information on-chain
- Generating unique tokenIDs for each satellite
- Initializing and managing AI image generation for satellite visualizations

### XMTP (Extensible Message Transport Protocol)
XMTP is a secure, decentralized messaging protocol. We utilize XMTP for:
- Creating an interactive bot interface for users to input satellite information
- Enabling real-time communication between users and the DeSats system
- Ensuring secure and private data transmission

### Other Key Technologies
- **Node.js & Express**: Backend server and API
- **MongoDB**: Database for storing satellite information
- **Redis**: Caching and temporary data storage
- **Ethers.js**: Interacting with Ethereum-compatible blockchains (Galadriel)

## Features

1. **Interactive Bot Interface**: Users can input satellite information through a conversational interface powered by XMTP.

2. **Blockchain Integration**: Satellite data is securely stored on the Galadriel blockchain, ensuring transparency and immutability.

3. **AI-Generated Satellite Imagery**: The system generates unique visual representations of satellites based on user descriptions.

4. **Crowdfunding Option**: Users can indicate if their satellite project is open for crowdfunding.

5. **Data Validation**: The bot validates user inputs, ensuring data integrity (e.g., date formats, URL validation).

6. **RESTful API**: Provides endpoints to retrieve satellite information.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env` file (see `.env.example`)
4. Run the server: `npm start`

## API Endpoints

- `GET /api/satellite`: Retrieve satellite information
  - Query parameters:
    - `address`: Ethereum address of the satellite owner
    - `tokenId`: Unique token ID of the satellite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
