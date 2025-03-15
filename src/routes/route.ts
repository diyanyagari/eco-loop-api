import { Router } from "express";
import { loginUser } from "../controllers/AuthController";
import { checkToken } from "../controllers/CheckTokenController";
import { getProfile } from "../controllers/GetProfileController";

const router = Router();

router.post("/auth/login", loginUser);
router.post("/auth/check-token", checkToken);
router.get("/auth/get-profile", getProfile);

export default router;
