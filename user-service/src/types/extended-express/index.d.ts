// src/types/express/index.d.ts
/* eslint-disable */
import { User } from '../custom';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
