import express from "express";
const router = express.Router()
import { createUser, getCurrentUserProfile, login, logoutCurrentUser, deleteUserProfile , getUserById, updateUserProfile, getAllUsers} from "../controllers/users-controller.js";
import { authenticate, authorizedAdmin} from "../middlewares/auth-middleware.js";
router.route("/").post(createUser)
router.route("/login").post(login)
router.post("/logout", logoutCurrentUser)
router.route("/profile").get(authenticate, getCurrentUserProfile).put(authenticate, updateUserProfile)
router.route("/all-users").get(authenticate, authorizedAdmin, getAllUsers)
// Admin routes
router.route("/:userId").delete(authenticate, authorizedAdmin, deleteUserProfile).get(authenticate, authorizedAdmin, getUserById).put(authenticate, authenticate, updateUserProfile)
export default router