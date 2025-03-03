import Joi from 'joi';

const envVarSchema = Joi.object({
  DB_URI: Joi.string().required(),
  PORT: Joi.number().default(3000),
}).unknown();

export default envVarSchema;
