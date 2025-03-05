import express from 'express';
import http from 'http';
import connectDB from './config/db';
import logger from './config/logger';
import userRoute from './routes/user.routes';
import ticketRoute from './routes/ticket.routes';
import authRoute from './routes/auth.routes';
import { connectRabbitMQ } from './config/rabbitmq';
import config from './config/config';
import { errorHandler, errorConverter } from './middleware/error';
import ApiError from './utils/ApiError';
import httpStatus from 'http-status';
import cors from 'cors';
import { url } from 'inspector';

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

  if (config.env === 'production') {
    app.use(cors({ origin: url }));
    app.options('*', cors({ origin: url }));
  } else {
    app.use(cors());
    app.options('*', cors());
  }

  app.use('/v1/auth', authRoute);
  app.use('/v1/user', userRoute);
  app.use('/v1/ticket', ticketRoute);

  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  app.use(errorConverter);
  app.use(errorHandler);

  const httpServer = http.createServer(app);
  const server = httpServer.listen(config.port, () => {
    logger.info(`ticketing app running on port ${config.port}`);
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
