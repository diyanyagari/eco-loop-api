import { Router } from "express";
import { loginUser } from "../controllers/AuthController";
import { checkToken } from "../controllers/CheckTokenController";
import { getProfile } from "../controllers/GetProfileController";
import { getHealthCheck } from "../controllers/HealthCheck";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/auth/login", loginUser);
router.post("/auth/check-token", authMiddleware, checkToken);
router.get("/auth/get-profile", authMiddleware, getProfile);
router.get("/health-check", getHealthCheck);

export default router;
