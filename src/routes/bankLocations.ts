import { Router } from "express";
import {
  createBankLocation,
  deleteBankLocation,
  getBankLocation,
  updateBankLocation,
  getBankLocationByQR,
} from "../controllers/BankController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

router.get("/bank-location", authMiddleware, adminMiddleware, getBankLocation);
router.get("/bank-location/:qrcode", authMiddleware, getBankLocationByQR);
router.post(
  "/bank-location",
  authMiddleware,
  adminMiddleware,
  createBankLocation
);
router.put(
  "/bank-location/:name",
  authMiddleware,
  adminMiddleware,
  updateBankLocation
);
router.delete(
  "/bank-location/:id",
  authMiddleware,
  adminMiddleware,
  deleteBankLocation
);

export default router;
