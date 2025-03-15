import { Request, Response } from "express";
import { Like } from "typeorm";
import { AppDataSource } from "../data-source";
import { Family } from "../entity/Family";
import { CustomError, GlobalMsg } from "../utils/CustomError";

const familyRepository = AppDataSource.getRepository(Family);

export const getFamilies = async (req: Request, res: Response) => {
  try {
    const { offset = 0, itemsPerPage = 10 } = req.query;

    const offsetNumber = parseInt(offset as string, 10) || 0;
    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 5;

    const searchQuery = req.query.q
      ? (req.query.q as string).toLowerCase()
      : "";

    const totalItems = await familyRepository.count({
      where: [
        {
          kk_number: Like(`%${searchQuery}%`),
        },
        {
          family_name: Like(`%${searchQuery}%`),
        },
      ],
    });

    const families = await familyRepository.find({
      skip: offsetNumber,
      take: itemsPerPageNumber,
      where: [
        {
          kk_number: Like(`%${searchQuery}%`),
        },
        {
          family_name: Like(`%${searchQuery}%`),
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: families || [],
      message: GlobalMsg("Families", families),
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

export const createFamily = async (req: Request, res: Response) => {
  try {
    const { kk_number, family_name } = req.body;

    if (!kk_number || !family_name) {
      res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
      return;
    }

    const existingFamily = await familyRepository.findOne({
      where: [{ kk_number }],
    });

    if (existingFamily) {
      res.status(400).json({
        success: false,
        message: "Family already exists.",
      });
      return;
    }

    const newFamily = familyRepository.create({
      ...req.body,
    });
    await familyRepository.save(newFamily);

    res.status(201).json({ success: true, data: newFamily });
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

export const updateFamily = async (req: Request, res: Response) => {
  try {
    const { kk } = req.params;
    const { family_name } = req.body;

    const family = await familyRepository.findOne({ where: { kk_number: kk } });

    if (!family) {
      res.status(404).json({
        success: false,
        message: "Family not found.",
      });
      return;
    }

    // Update fields
    family.family_name = family_name || family.family_name;
    console.log('debug: ', family, ' ', kk, ' ', family_name)
    // Save updated Family
    await familyRepository.save(family);

    res.status(200).json({
      success: true,
      message: "Family updated successfully.",
      data: family,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const deleteFamily = async (req: Request, res: Response) => {
  try {
    const { kk } = req.params;

    // Find family by no KK
    const family = await familyRepository.findOne({ where: { kk_number: kk } });

    if (!family) {
      res.status(404).json({
        success: false,
        message: "Family not found.",
      });
      return;
    }

    // Delete family
    await familyRepository.remove(family);

    res.status(200).json({
      success: true,
      message: "Family deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
