import amqp from 'amqplib';
import config from './config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { setTimeout } from 'timers';
import userService from '../services/user.service';

let channel: amqp.Channel | null = null;

const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(config.rabbitMQUri);
    channel = await connection.createChannel();
    await channel.assertQueue('user-created');
    logger.info('Connected to RabbitMQ');

    // Consume user-created events
    channel.consume('user-created', async (msg) => {
      if (msg) {
        try {
          const { userId, email, role } = JSON.parse(msg.content.toString());
          await userService.createUserProfile(userId, email, role);
          if (channel) {
            channel.ack(msg); // Acknowledge the message
          }
          logger.info(`User profile created for: ${email}`);
        } catch (error) {
          logger.error(
            `Error processing user-created event: ${(error as Error).message}`,
          );
          if (channel) {
            channel.nack(msg); // Negative acknowledgment
          }
        }
      }
    });
  } catch (error: any) {
    logger.error(`RabbitMQ connection error: ${error.message}`);
    setTimeout(connectRabbitMQ, 5000);
  }
};

const getChannel = (): amqp.Channel | null => {
  if (!channel) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'RabbitMQ channel not available',
    );
  }
  return channel;
};

export { connectRabbitMQ, getChannel };
