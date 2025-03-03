import amqp from 'amqplib';
import config from './config';
import logger from '../config/logger';
import { setTimeout } from 'timers';

let channel: amqp.Channel | null = null;

const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(config.rabbitMQUri);
    channel = await connection.createChannel();
    logger.info('RabbitMQ connected for auth-service');
  } catch (error) {
    logger.error('Error connecting to RabbitMQ: ', error);
    setTimeout(connectRabbitMQ, 5000);
  }
};

const getChannel = (): amqp.Channel | null => {
  if (!channel) {
    throw new Error('RabbitMQ channel not established');
  }
  return channel;
};

export { connectRabbitMQ, getChannel };
