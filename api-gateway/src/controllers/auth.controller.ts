import { Request, Response } from 'express';
import axios from 'axios';
import { catchAsync } from '../utils/catchAsync';
import logger from '../config/logger';

export const signup = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Forward request to Auth Service
    const response = await axios.post('http://localhost:3001/v1/auth/signup', {
      email,
      password,
    });

    logger.info(`User registered: ${email}`);
    res.status(response.status).json(response.data);
  },
);

export const signupBySelectingRole = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body;

    try {
      // Forward request to Auth Service
      const response = await axios.post(
        'http://localhost:3001/v1/auth/register',
        {
          email,
          password,
          role,
        },
      );

      logger.info(JSON.stringify(response.data));
      logger.info(`User registered with role: ${email}`);

      res.status(response.status).json(response.data);
    } catch (error: any) {
      if (error.response) {
        // Axios received a response but it's an error (e.g., 400 Bad Request)
        logger.error(
          `Error response from auth service: ${JSON.stringify(error.response.data)}`,
        );
        res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        // No response received
        logger.error(
          `No response received from auth service: ${error.message}`,
        );
        res
          .status(500)
          .json({ success: false, message: 'Auth service is unreachable' });
      } else {
        // Other unexpected errors
        logger.error(`Unexpected error: ${error.message}`);
        res
          .status(500)
          .json({ success: false, message: 'Something went wrong' });
      }
    }
  },
);

export const login = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Forward request to Auth Service
    const response = await axios.post('http://localhost:3001/v1/auth/login', {
      email,
      password,
    });

    logger.info(`User logged in: ${email}`);
    res.status(response.status).json(response.data);
  },
);

export const refreshToken = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    // Forward request to Auth Service
    const response = await axios.post(
      'http://auth-service:4001/auth/refresh-token',
      {
        refreshToken,
      },
    );

    logger.info(`Token refreshed for user`);
    res.status(response.status).json(response.data);
  },
);

export const validateToken = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    // Forward request to Auth Service
    const response = await axios.post(
      'http://localhost:3001/v1/auth/validate',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    logger.info(`Token validated for user`);
    res.status(response.status).json(response.data);
  },
);
