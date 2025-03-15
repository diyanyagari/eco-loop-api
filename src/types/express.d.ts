import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        access: string;
        role: string;
        iat: number;
        exp: number;
        // Add any other fields you store in the token
      };
    }
  }
}
