import amqp from 'amqplib';
import config from './config';
import logger from '../config/logger';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { setTimeout } from 'timers';

let channel: amqp.Channel | null = null;

const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(config.rabbitMQUri);
    channel = await connection.createChannel();
    await channel.assertQueue('user-created', { durable: true });
    logger.info('Connected to RabbitMQ');
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
