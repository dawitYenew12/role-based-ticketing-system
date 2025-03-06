import { Request, Response } from 'express';
import axios from 'axios';
import { catchAsync } from '../utils/catchAsync';
import logger from '../config/logger';
import httpStatus from 'http-status';

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
    logger.info('here');
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
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        logger.warn('Login attempt with missing credentials');
        res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      // Forward request to Auth Service
      const response = await axios.post('http://localhost:3001/v1/auth/login', {
        email,
        password,
      });

      logger.info(`User logged in: ${email}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Extract response details from Axios error
        const status = error.response?.status || 500;
        const data = error.response?.data || {
          success: false,
          message: 'Internal Server Error',
        };

        // Provide more specific error messages based on status code
        if (status === 401) {
          logger.warn(`Failed login attempt for email: ${req.body.email}`);
          res.status(401).json({
            success: false,
            message:
              'Invalid email or password. Please check your credentials and try again.',
          });
        } else if (status === 404) {
          logger.warn(`Login attempt for non-existent user: ${req.body.email}`);
          res.status(404).json({
            success: false,
            message:
              'User not found. Please check your email or sign up for a new account.',
          });
        } else {
          logger.error(`Login failed: ${data.message}`);
          res.status(status).json(data);
        }
      } else {
        logger.error(
          `Unexpected error during login: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        res.status(500).json({
          success: false,
          message:
            'Authentication service unavailable. Please try again later.',
        });
      }
    }
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
