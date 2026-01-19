import express from "express";
import { login, loginWithGoogle, logoutCurrentUser, createUser, requestPasswordReset, verifyOtp, resetPassword } from "../controllers/auth-controller.js";
const router = express.Router();
router.route("/").post(createUser);
router.route("/login").post(login);
router.route("/login-with-google").post(loginWithGoogle);
router.post("/logout", logoutCurrentUser);
router.route("/request").post(requestPasswordReset)
router.route("/verify").post(verifyOtp)
router.route("/reset").post(resetPassword)
export default router