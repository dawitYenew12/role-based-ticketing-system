import express from 'express';
import http from 'http';
import connectDB from './config/db';
import logger from './config/logger';
import authRoutes from './routes/user.routes';
import { connectRabbitMQ } from './config/rabbitmq';
import config from './config/config';
import { errorHandler, errorConverter } from './middleware/error';
import ApiError from './utils/ApiError';
import httpStatus from 'http-status';

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

function unExpectedErrorHandler(server: http.Server) {
  return function (error: Error) {
    logger.error(error);
    exitHandler(server);
  };
}

const startServer = async () => {
  const app = express();
  app.use(express.json());

  connectDB();
  connectRabbitMQ();

  app.use('/v1/user', authRoutes);

  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  app.use(errorConverter);
  app.use(errorHandler);

  const httpServer = http.createServer(app);
  const server = httpServer.listen(config.port, () => {
    logger.info(`User Service running on port ${config.port}`);
  });
  process.on('uncaughtException', unExpectedErrorHandler(server));
  process.on('unhandledRejection', unExpectedErrorHandler(server));
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

startServer();
