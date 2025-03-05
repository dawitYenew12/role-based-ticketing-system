import dotenv from 'dotenv';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

dotenv.config();

import envVarSchema from '../validations/env.validation';

interface Config {
  port: number;
  dbUri: string;
  env: string;
  rabbitMQUri: string;
  redisUrl: string;
  jwt: {
    secretKey: string;
    accessTokenMinutes: number;
    refreshTokenDays: number;
  };
}

const { error, value: envVars } = envVarSchema.validate(process.env);

if (error) {
  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    'Environment validation error',
  );
}

const config: Config = {
  port: envVars.PORT,
  dbUri: envVars.DB_URI,
  env: envVars.NODE_ENV,
  rabbitMQUri: envVars.RABBITMQ_URL,
  redisUrl: envVars.REDIS_URL || 'redis://m:6379',
  jwt: {
    secretKey: envVars.JWT_SECRET,
    accessTokenMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshTokenDays: envVars.JWT_REFRESS_EXPIRATION_DAYS,
  },
};

export default config;
