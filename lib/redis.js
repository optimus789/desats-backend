const { createClient } = require('@redis/client');

exports.getRedisClient = async () => {
  const client = createClient({
    password: process.env.REDIS_CONNECTION_PASSWORD,
    socket: {
      host: process.env.REDIS_CONNECTION_HOST,
      port: process.env.REDIS_CONNECTION_PORT,
    },
  });

  client.on('connect', () => {
    console.log('Redis client connected');
  });

  client.on('error', (err) => {
    console.log('Redis client error', err);
  });

    await client.connect();
  return client;
};
