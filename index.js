require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./utils/db');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['*'],
  maxAge: 86400,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
const nftRoutes = require('./routes/nft');
const imageRoutes = require('./routes/image');
const satelliteRoutes = require('./routes/satellite');
const crowdfundingRoutes = require('./routes/crowdfunding'); // Add this line

app.use('/api/nft', nftRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/satellite', satelliteRoutes);
app.use('/api/crowdfunding', crowdfundingRoutes); // Add this line

app.get('/', (req, res) => {
  res.send('Welcome to DeSats API');
});

// Error handler middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Start the bot
require('./bot');
