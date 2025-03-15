import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError";

const jwtSecret = process.env.JWT_SECRET;
const usedTokens = new Set();

export const checkToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }
    const decoded = jwt.verify(token, jwtSecret);

    // Cek apakah token udah pernah dipakai
    if (usedTokens.has(token)) {
      res.status(401).json({ error: "Token already used" });
      return;
    }

    res.status(201).json({ success: true, data: decoded });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    } else {
      console.log('asdds', error)
      res.status(500).json({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    }
  }
};
