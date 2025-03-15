import { Request, Response } from "express";
import { Like } from "typeorm";
import { AppDataSource } from "../data-source";
import { BankLocation } from "../entity/BankLocation";
import { CustomError, GlobalMsg } from "../utils/CustomError";

const bankLocationRepository = AppDataSource.getRepository(BankLocation);

export const getBankLocation = async (req: Request, res: Response) => {
  try {
    const { offset = 0, itemsPerPage = 10 } = req.query;

    const offsetNumber = parseInt(offset as string, 10) || 0;
    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 5;

    const searchQuery = req.query.q
      ? (req.query.q as string).toLowerCase()
      : "";

    const totalItems = await bankLocationRepository.count({
      where: [
        {
          name: Like(`%${searchQuery}%`),
        },
        {
          address: Like(`%${searchQuery}%`),
        },
      ],
    });

    const bankLocations = await bankLocationRepository.find({
      skip: offsetNumber,
      take: itemsPerPageNumber,
      where: [
        {
          name: Like(`%${searchQuery}%`),
        },
        {
          address: Like(`%${searchQuery}%`),
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: bankLocations || [],
      message: GlobalMsg("Bank Locations", bankLocations),
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

export const getBankLocationByQR = async (req: Request, res: Response) => {
  try {
    const { qrcode } = req.params;
    // Check if `qrcode` is provided
    if (!qrcode) {
      res.status(400).json({
        success: false,
        message: "QR is required.",
      });
      return;
    }

    // Fetch bank location for the specified user
    const bankLocation = await bankLocationRepository.find({
      where: { qr_code: qrcode },
    });

    res.status(200).json({
      success: true,
      data: bankLocation || [],
      message: `Bank location for qr code ${qrcode} retrieved successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const createBankLocation = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    const existingBank = await bankLocationRepository.findOne({
      where: [{ name }],
    });

    if (existingBank) {
      res.status(400).json({
        success: false,
        message: "Bank Location already exists.",
      });
      return;
    }

    const newBank = bankLocationRepository.create({
      ...req.body,
    });
    await bankLocationRepository.save(newBank);

    res.status(201).json({ success: true, data: newBank });
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

export const updateBankLocation = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { address } = req.body;

    const bankLocation = await bankLocationRepository.findOne({
      where: { name: name },
    });

    if (!bankLocation) {
      res.status(404).json({
        success: false,
        message: "Bank location not found.",
      });
      return;
    }

    // Update fields
    bankLocation.address = address || bankLocation.address;

    // Save updated bank location
    await bankLocationRepository.save(bankLocation);

    res.status(200).json({
      success: true,
      message: "Bank location updated successfully.",
      data: bankLocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const deleteBankLocation = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    // Find bank location by Name
    const bankLocation = await bankLocationRepository.findOne({
      where: { name: name },
    });

    if (!bankLocation) {
      res.status(404).json({
        success: false,
        message: "Bank location not found.",
      });
      return;
    }

    // Delete bank location
    await bankLocationRepository.remove(bankLocation);

    res.status(200).json({
      success: true,
      message: "Bank location deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
