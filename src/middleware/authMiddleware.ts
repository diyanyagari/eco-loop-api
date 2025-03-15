import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "./adminMiddleware";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Admin } from "../entity/Admin";

const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. No token provided.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      jti: string;
    }; // Ensure you have a `JWT_SECRET` in your environment variables

    const userRepository = AppDataSource.getRepository(User);
    const adminRepository = AppDataSource.getRepository(Admin);

    let user: User | Admin | null = await adminRepository.findOne({
      where: { id: decoded.id },
    });
    let role = "admin";

    if (!user) {
      user = await userRepository.findOne({ where: { id: decoded.id } });
      role = "user";
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
      return;
    }

    // Cek apakah jti masih valid
    if (!user.current_token || user.current_token !== decoded.jti) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Token expired or invalid.",
      });
      return;
    }
    req.user = decoded as unknown as typeof req.user;
    if (req.user) {
      req.user.role = role;
    }

    // req.user = decoded as typeof req.user; // Attach the decoded user to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
    return;
  }
};

export default authMiddleware;
