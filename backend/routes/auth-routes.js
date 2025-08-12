import express from "express"
import { authenticate } from "../middlewares/auth-middleware.js"
import { requestPasswordReset, verifyOtp, resetPassword } from "../controllers/auth-controller.js"
const router = express.Router()
router.route("/request").post(authenticate, requestPasswordReset)
router.route("/verify").post(authenticate, verifyOtp)
router.route("/reset").post(authenticate, resetPassword)
export default router