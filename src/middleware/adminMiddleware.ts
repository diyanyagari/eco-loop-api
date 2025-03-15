import { NextFunction, Request, Response } from "express";

interface User {
  userId: string;
  access: string;
  role: string;
  iat: number;
  exp: number;
}

export interface CustomRequest extends Request {
  user?: User;
}

const adminMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Access forbidden: Admins only." });
  }
};

export default adminMiddleware;
