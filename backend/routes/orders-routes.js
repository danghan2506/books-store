import express from "express";
import {authenticate, authorizedAdmin} from "../middlewares/auth-middleware.js"
import { countTotalOrders, createOrder, getAllOrders, getUserOrders, calculateTotalSales, calcualteTotalSalesByDate } from "../controllers/orders-controller.js";
const router = express.Router()
router.route("/").post(authenticate, createOrder).get(authenticate, authorizedAdmin, getAllOrders)
router.route("/my-orders").get(authenticate,getUserOrders)
router.route("/total-orders").get(authenticate, countTotalOrders)
router.route("/total-sales").get(authenticate, authorizedAdmin, calculateTotalSales)
router.route("/total-sales/by-date").get(authenticate, authenticate, calcualteTotalSalesByDate)
export default router