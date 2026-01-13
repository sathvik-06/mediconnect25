import redisClient from './config/redis.js';

const clearCache = async () => {
    console.log('Starting cache clear...');

    // Check if we need to connect or if it's already connecting/connected
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    try {
        await redisClient.flushAll();
        console.log('Redis cache cleared successfully');
    } catch (err) {
        console.error('Error clearing cache:', err);
    } finally {
        if (redisClient.isOpen) {
            await redisClient.quit();
        }
    }
};

clearCache();
