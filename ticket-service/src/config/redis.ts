import Redis from 'ioredis';
import config from './config';
import logger from './logger';

const redisClient = new Redis(config.redisUrl);

redisClient.on('connect', () => {
  logger.info('Redis connected');
});

redisClient.on('error', (error) => {
  logger.error(`Redis error: ${error}`);
});

export default redisClient;
