import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { login, loginWithClerk, logoutCurrentUser, createUser, requestPasswordReset, verifyOtp, resetPassword, refreshAccessToken } from "../controllers/auth-controller.js";
import { apiLimiter } from "../middlewares/rate-limiter.js";
const router = express.Router();
router.route("/").post(createUser);
router.route("/login").post(login);
router.route("/login-with-google").post(ClerkExpressRequireAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
}), loginWithClerk);
router.post("/logout", logoutCurrentUser);
router.post("/refresh", refreshAccessToken);
router.route("/request").post(apiLimiter, requestPasswordReset)
router.route("/verify").post(apiLimiter, verifyOtp)
router.route("/reset").post(resetPassword)
export default router