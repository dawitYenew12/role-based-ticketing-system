import express from 'express';
import http from 'http';
import connectDB from './config/db';
import logger from './config/logger';
import ticketRoutes from './routes/ticket.routes';
import config from './config/config';
import { errorHandler, errorConverter } from './middleware/error';
import ApiError from './utils/ApiError';
import httpStatus from 'http-status';
import { connectRabbitMQ } from './config/rabbitmq';
import { initializeUserService } from './services/user.service';
import './config/redis'; // This will initialize Redis connection

function exitHandler(server: http.Server) {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

const startServer = async () => {
  const app = express();
  app.use(express.json());

  // Connect to MongoDB
  await connectDB();

  // Connect to RabbitMQ and initialize user service
  await connectRabbitMQ();
  await initializeUserService();

  app.use('/v1', ticketRoutes);

  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  app.use(errorConverter);
  app.use(errorHandler);

  const httpServer = http.createServer(app);
  const server = httpServer.listen(config.port, () => {
    logger.info(`Ticket Service running on port ${config.port}`);
  });

  const gracefulShutdown = async () => {
    logger.info('Received shutdown signal');
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    exitHandler(server);
  });

  process.on('unhandledRejection', (error: Error) => {
    logger.error('Unhandled Rejection:', error);
    exitHandler(server);
  });

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
};

startServer();
