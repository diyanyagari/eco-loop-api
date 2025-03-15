import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Admin } from "../entity/Admin";
import { User } from "../entity/User";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const getProfile = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.id;

    let user = null;
    let role = "admin";

    // check data user admin first
    const adminRepository = AppDataSource.getRepository(Admin);
    user = await adminRepository.findOneBy({ id: userId });

    if (!user) {
      role = "user";
      const userRepository = AppDataSource.getRepository(User);
      user = await userRepository.findOneBy({ id: userId });
    }

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Fetch User Data successful",
      data: {
        id: user.id,
        name: role === "admin" ? (user as Admin).username : (user as User).name,
        role,
        nik: role === "admin" ? "" : (user as User).nik,
        email: role === "admin" ? "" : (user as User).email,
      },
    });
  } catch (error) {
    console.error("Fetch User Data error: ", error);

    if ((error as any).name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Token has expired, please login again",
      });
      return;
    } else if ((error as any).name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Invalid token, please login again",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
