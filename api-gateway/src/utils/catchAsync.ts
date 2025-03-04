import { Request, Response, NextFunction } from 'express';

type AsyncHandler<T extends Request = Request> = (
  _req: T,
  _res: Response,
  _next: NextFunction,
) => Promise<void>;

export const catchAsync =
  <T extends Request>(fn: AsyncHandler<T>) =>
  (_req: T, _res: Response, _next: NextFunction) => {
    Promise.resolve(fn(_req, _res, _next)).catch(_next);
  };
