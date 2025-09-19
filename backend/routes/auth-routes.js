import express from "express";
import { authenticate } from "../middlewares/auth-middleware.js";
import { requestPasswordReset, verifyOtp, resetPassword } from "../controllers/auth-controller.js";
const router = express.Router();
router.route("/request").post(requestPasswordReset)
router.route("/verify").post(verifyOtp)
router.route("/reset").post(resetPassword)
export default router