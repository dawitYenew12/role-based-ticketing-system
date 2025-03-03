import dotenv from 'dotenv';
dotenv.config();

import envVarSchema from '../validations/env.validation';

interface Config {
  port: number;
  dbUri: string;
  env: string;
  rabbitMQUri: string;
  jwt: {
    secretKey: string;
    accessTokenMinutes: number;
    refreshTokenDays: number;
  };
}

const { error, value: envVars } = envVarSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config: Config = {
  port: envVars.PORT,
  dbUri: envVars.DB_URI,
  env: envVars.NODE_ENV,
  rabbitMQUri: envVars.RABBITMQ_URL,
  jwt: {
    secretKey: envVars.JWT_SECRET,
    accessTokenMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshTokenDays: envVars.JWT_REFRESS_EXPIRATION_DAYS,
  },
};

export default config;
