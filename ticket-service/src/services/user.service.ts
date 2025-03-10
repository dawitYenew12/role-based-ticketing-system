import { getChannel } from '../config/rabbitmq';
import redisClient from '../config/redis';
import logger from '../config/logger';

export const initializeUserService = async (): Promise<void> => {
  const channel = getChannel();
  if (channel) {
    await channel.assertQueue('user-created', { durable: true });
    channel.consume('user-created', async (message) => {
      if (message) {
        try {
          const { userId, email, role } = JSON.parse(
            message.content.toString(),
          );

          // Cache user details in Redis
          await redisClient.set(
            `user:${userId}`,
            JSON.stringify({ email, role }),
          );
          logger.info(`User created and cached: ${userId}`);

          channel.ack(message);
        } catch (error) {
          logger.error(`Error processing user created event: ${error}`);
          channel.nack(message);
        }
      }
    });
    logger.info('User service initialized and listening for events');
  }
};

export const getUserDetails = async (
  userId: string,
): Promise<{ email: string; role: string } | null> => {
  logger.info(userId);
  const userData = await redisClient.get(`user:${userId}`);
  logger.info('user data: ', userData);
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};
