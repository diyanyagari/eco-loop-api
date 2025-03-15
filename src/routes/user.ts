import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.post("/users", authMiddleware, adminMiddleware, createUser);
router.put("/users/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;
