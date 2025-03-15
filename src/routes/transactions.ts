import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionByUserId
} from "../controllers/TransactionController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.get("/transactions", authMiddleware, getTransactions);
router.get("/transactions/:userId", authMiddleware, getTransactionByUserId);
router.post("/transactions", authMiddleware, createTransaction);

export default router;
