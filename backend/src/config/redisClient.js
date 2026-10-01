const { createClient } = require('redis');

const redisUrl = process.env.REDIS_CONNECTION;

const client = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 2) return false; // Stop retrying after 2 attempts when offline
      return 1000;
    }
  }
});

client.on('error', (err) => console.log('❌ Redis Error:', err.message));
client.on('connect', () => console.log('🔄 Redis connecting...'));
client.on('ready', () => console.log('✅ Redis ready'));

module.exports = client;