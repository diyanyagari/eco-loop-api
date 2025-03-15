import { Router } from "express";
import {
  createFamily,
  deleteFamily,
  getFamilies,
  updateFamily,
} from "../controllers/FamilyController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

router.get("/family", authMiddleware, adminMiddleware, getFamilies);
router.post("/family", authMiddleware, adminMiddleware, createFamily);
router.put("/family/:kk", authMiddleware, adminMiddleware, updateFamily);
router.delete("/family/:kk", authMiddleware, adminMiddleware, deleteFamily);

export default router;
