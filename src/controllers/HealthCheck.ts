import { Request, Response } from "express";

export const getHealthCheck = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Good!",
      data: {},
    });
  } catch (error) {
    console.error("Fetch User Data error: ", error);
    res.status(500).json({
      success: false,
      message: "Something Wrong.",
    });
  }
};
