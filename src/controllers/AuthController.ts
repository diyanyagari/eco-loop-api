import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import dotenv from "dotenv";
import { User } from "../entity/User";
import { Admin } from "../entity/Admin";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const loginUser = async (req: Request, res: Response) => {
  const { identifier, password, type = 2 } = req.body; // `identifier` can be nik or username

  const isRegularUser = type === 2; // 2 is regular user
  const isAdmin = type === 1; // 1 is admin
  const userRepository = AppDataSource.getRepository(User);
  const adminRepository = AppDataSource.getRepository(Admin);

  if (!identifier || !password) {
    res.status(400).json({
      success: false,
      message: "NIK and password are required.",
    });
    return;
  }

  try {
    let user: User | Admin | null = null;
    let role = "";
    let name = "";

    if (isRegularUser) {
      const userRepository = AppDataSource.getRepository(User);
      user = await userRepository.findOneBy({ nik: identifier });
      role = "user";
      name = user?.name || "";
    } else if (isAdmin) {
      const adminRepository = AppDataSource.getRepository(Admin);
      user = await adminRepository.findOneBy({ username: identifier });
      role = "admin";
      name = user?.username || "";
    }

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid nik or password.",
      });
      return;
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: "Invalid nik or password.",
      });
      return;
    }

    // // Generate a JWT token
    // const token = jwt.sign(
    //   {
    //     userId: user.id,
    //     name,
    //     role,
    //   },
    //   jwtSecret as string, // Ensure you have JWT_SECRET in your environment variables
    //   { expiresIn: "1h" }
    // );

    // Generate jti baru
    const jti = uuidv4();
    const token = jwt.sign(
      { id: user.id, jti },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Simpan jti baru di database
    user.current_token = jti;
    if (role === "admin") {
      await adminRepository.save(user as Admin);
    } else {
      await userRepository.save(user as User);
    }

    // Send the token and user data as response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token },
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
