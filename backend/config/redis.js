// config/redis.js
import redis from 'redis';

let redisUrl = process.env.REDIS_URL;

// Sanitize URL: Remove common command-line prefixes if user accidentally pasted them
if (redisUrl && redisUrl.includes('-u ')) {
  redisUrl = redisUrl.split('-u ')[1].split(' ')[0];
}

// Support for rediss:// protocol and ensuring TLS for cloud providers
const isSecure = redisUrl && (redisUrl.startsWith('rediss://') || process.env.NODE_ENV === 'production');

const client = redis.createClient({
  url: redisUrl,
  socket: {
    tls: isSecure,
    rejectUnauthorized: false, // Often needed for cloud providers
    connectTimeout: 5000,
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
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