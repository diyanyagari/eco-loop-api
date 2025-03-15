import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Equal, Like } from "typeorm";
import { CustomError, GlobalMsg } from "../utils/CustomError";
import { validate as isUuid } from "uuid";
import { Family } from "../entity/Family";

const userRepository = AppDataSource.getRepository(User);
const familyRepository = AppDataSource.getRepository(Family);

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { offset = 0, itemsPerPage = 10 } = req.query;

    const offsetNumber = parseInt(offset as string, 10) || 0;
    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 5;

    const searchQuery = req.query.q
      ? (req.query.q as string).toLowerCase()
      : "";

    const totalItems = await userRepository.count({
      where: [
        {
          name: Like(`%${searchQuery}%`),
        },
        {
          nik: Like(`%${searchQuery}%`),
        },
        {
          email: Like(`%${searchQuery}%`),
        },
      ],
    });

    const users = await userRepository.find({
      skip: offsetNumber,
      take: itemsPerPageNumber,
      where: [
        {
          name: Like(`%${searchQuery}%`),
        },
        {
          nik: Like(`%${searchQuery}%`),
        },
        {
          email: Like(`%${searchQuery}%`),
        },
      ],
      relations: ["family"],
    });

    const formattedUsers = users.map((user) => ({
      ...user,
      familyId: user.family ? user.family.kk_number : null, // 👈 Only include kk_number
    }));

    res.status(200).json({
      success: true,
      data: formattedUsers || [],
      message: GlobalMsg("Users", formattedUsers),
      offset: offsetNumber,
      totalItems,
      itemsPerPage: itemsPerPageNumber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    let { nik, name, phone, email, password, familyId } = req.body;

    // Set default password if it's empty or undefined
    password = password || "qwerty123";

    // if (!nik || !name || !phone || !email || !password || !familyId) {
    if (!nik || !name || !phone || !familyId) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    const existingUser = await userRepository.findOne({
      where: [{ nik }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Account already exists.",
      });
      return;
    }

    const existingFamily = await familyRepository.findOne({
      where: [{ kk_number: familyId }],
    });

    if (!existingFamily) {
      res.status(400).json({
        success: false,
        message: "Family ID doesnt exist.",
      });
      return;
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10); // Salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({
      ...req.body,
      password: hashedPassword,
      family: { kk_number: familyId },
    });
    await userRepository.save(newUser);

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(400).json({
        success: false,
        message: "A custom error occurred.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, email, familyId, password } = req.body;

    const user = await userRepository.findOne({ where: { id: id } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    // Update fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.password = password || user.password;
    user.family = familyId;

    // Save updated user
    await userRepository.save(user);

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate the UUID format
    if (!isUuid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid UUID format.",
      });
      return;
    }

    // Find user by ID
    const user = await userRepository.findOne({ where: { id: Equal(id) } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    // Delete user
    await userRepository.remove(user);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
