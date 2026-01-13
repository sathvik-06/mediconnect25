// config/redis.js
import redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 2000,
    reconnectStrategy: false
  }
});

client.on('error', (err) => {
  // Suppress connection refused errors to avoid console spam
  if (err.code === 'ECONNREFUSED' || err.message.includes('ECONNREFUSED')) {
    return;
  }
  console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log('Redis Client Connected');
  } catch (error) {
    console.error('Redis connection failed (continuing without Redis):', error.message);
    // We don't exit the process so the server can still run
  }
};

export default client;
export { connectRedis };