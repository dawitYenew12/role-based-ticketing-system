import express from 'express';
import connectDB from './config/db';
import logger from './config/logger';
import authRoutes from './routes/auth.routes';
import { connectRabbitMQ } from './config/rabbitmq';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

connectDB();

connectRabbitMQ();

// Routes
app.use('/v1/auth', authRoutes);

app.listen(PORT, () => {
  logger.info(`Auth Service running on port ${PORT}`);
});
