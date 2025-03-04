import mongoose from 'mongoose';
import config from './config';
import logger from '../config/logger';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.dbUri);
    logger.info('MongoDB connected for ticket-service');
  } catch (error) {
    logger.error('Error connecting to MongoDB: ', error);
  }
};

export default connectDB;
