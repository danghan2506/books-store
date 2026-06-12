import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { login, loginWithClerk, logoutCurrentUser, createUser, requestPasswordReset, verifyOtp, resetPassword, refreshAccessToken } from "../controllers/auth-controller.js";
const router = express.Router();
router.route("/").post(createUser);
router.route("/login").post(login);
router.route("/login-with-google").post(ClerkExpressRequireAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
}), loginWithClerk);
router.post("/logout", logoutCurrentUser);
router.post("/refresh", refreshAccessToken);
router.route("/request").post(requestPasswordReset)
router.route("/verify").post(verifyOtp)
router.route("/reset").post(resetPassword)
export default router