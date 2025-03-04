/* eslint-disable */
import { Request, Response, NextFunction } from 'express';

type AsyncHandler<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const catchAsync =
  <T extends Request>(fn: AsyncHandler<T>) =>
  (req: T, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
