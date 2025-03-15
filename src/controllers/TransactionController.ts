import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Transaction } from "../entity/Transaction";
import { Like } from "typeorm";
import { CustomError, GlobalMsg } from "../utils/CustomError";

const transactionRepository = AppDataSource.getRepository(Transaction);

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { offset = 0, itemsPerPage = 10 } = req.query;

    const offsetNumber = parseInt(offset as string, 10) || 0;
    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 5;

    const searchQuery = req.query.q
      ? (req.query.q as string).toLowerCase()
      : "";

    const totalItems = await transactionRepository.count({
      // where: [
      //   {
      //     user: Like(`%${searchQuery}%`), // Using Like for partial matches
      //   },
      //   {
      //     location: Like(`%${searchQuery}%`),
      //   },
      // ],
    });

    const transactions = await transactionRepository.find({
      skip: offsetNumber,
      take: itemsPerPageNumber,
      relations: ["user", "location"],
      // where: [
      //   {
      //     user: Like(`%${searchQuery}%`), // Using Like for partial matches
      //   },
      //   {
      //     location: Like(`%${searchQuery}%`),
      //   },
      // ],
    });

    res.status(200).json({
      success: true,
      data: transactions || [],
      message: GlobalMsg("Transactions", transactions),
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

export const getTransactionByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { offset = 0, itemsPerPage = 10 } = req.query;

    const offsetNumber = parseInt(offset as string, 10) || 0;
    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 5;

    const totalItems = await transactionRepository.count({
      where: { user: { id: userId } }, // Filter by user ID
    });

    const transactions = await transactionRepository.find({
      skip: offsetNumber,
      take: itemsPerPageNumber,
      relations: ["user", "location"],
      where: { user: { id: userId } },
    });

    res.status(200).json({
      success: true,
      data: transactions || [],
      message: GlobalMsg("Transactions", transactions),
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

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, locationId, weight } = req.body;

    if (!userId || !locationId || !weight) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    const newTransaction = transactionRepository.create({
      user: { id: userId },
      location: { id: locationId },
      weight,
    });
    await transactionRepository.save(newTransaction);

    res.status(201).json({ success: true, data: newTransaction });
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
