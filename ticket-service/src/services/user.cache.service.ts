import redisClient from '../config/redis';
import logger from '../config/logger';

const USER_CACHE_PREFIX = 'user:';
const USER_CACHE_TTL = 3600; // 1 hour in seconds

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

export async function cacheUserData(
  userId: string,
  userData: UserData,
): Promise<void> {
  try {
    const key = `${USER_CACHE_PREFIX}${userId}`;
    await redisClient.setex(key, USER_CACHE_TTL, JSON.stringify(userData));
    logger.info(`Cached user data for user ${userId}`);
  } catch (error) {
    logger.error('Error caching user data:', error);
    throw error;
  }
}

export async function getCachedUser(userId: string): Promise<UserData | null> {
  try {
    const key = `${USER_CACHE_PREFIX}${userId}`;
    const userData = await redisClient.get(key);

    if (!userData) {
      return null;
    }

    return JSON.parse(userData);
  } catch (error) {
    logger.error('Error retrieving cached user data:', error);
    return null;
  }
}

export async function removeCachedUser(userId: string): Promise<void> {
  try {
    const key = `${USER_CACHE_PREFIX}${userId}`;
    await redisClient.del(key);
    logger.info(`Removed cached data for user ${userId}`);
  } catch (error) {
    logger.error('Error removing cached user data:', error);
    throw error;
  }
}
