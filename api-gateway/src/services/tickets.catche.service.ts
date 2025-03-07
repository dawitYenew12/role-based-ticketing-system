import redisClient from '../config/redis';
import logger from '../config/logger';

const TICKET_CACHE_PREFIX = 'ticket:';
const TICKET_CACHE_TTL = 3600; // 1 hour in seconds

export interface TicketData {
  id: string;
  title: string;
  description: string;
  status: string;
  userId: string;
  [key: string]: any;
}

export async function cacheTicketData(
  ticketId: string,
  ticketData: TicketData,
): Promise<void> {
  try {
    const key = `${TICKET_CACHE_PREFIX}${ticketId}`;
    await redisClient.setex(key, TICKET_CACHE_TTL, JSON.stringify(ticketData));
    logger.info(`Cached ticket data for ticket ${ticketId}`);
  } catch (error) {
    logger.error('Error caching ticket data:', error);
    throw error;
  }
}

export async function getCachedTicket(
  ticketId: string,
): Promise<TicketData | null> {
  try {
    const key = `${TICKET_CACHE_PREFIX}${ticketId}`;
    const ticketData = await redisClient.get(key);

    if (!ticketData) {
      return null;
    }

    return JSON.parse(ticketData);
  } catch (error) {
    logger.error('Error retrieving cached ticket data:', error);
    return null;
  }
}

export async function removeCachedTicket(ticketId: string): Promise<void> {
  try {
    const key = `${TICKET_CACHE_PREFIX}${ticketId}`;

    // Check if the key contains a wildcard
    if (key.includes('*')) {
      // Get all keys matching the pattern
      const keys = await redisClient.keys(key);
      if (keys.length > 0) {
        // Delete all matching keys
        await redisClient.del(keys);
        logger.info(
          `Removed ${keys.length} cached entries matching pattern ${key}`,
        );
      }
    } else {
      // Delete a single key
      await redisClient.del(key);
      logger.info(`Removed cached data for ticket ${ticketId}`);
    }
  } catch (error) {
    logger.error('Error removing cached ticket data:', error);
    throw error;
  }
}
