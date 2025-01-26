import express from "express";
import { createOrder, getOrdersByUser, getOrders, updateOrderStatus, markOrderAsDelivered } from "../controllers/orderController.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js"; // Middleware to check admin role

const router = express.Router();

// POST /api/orders - Create a new order
router.post("/", verifyToken, createOrder);

// GET /api/orders/user - Fetch orders for a specific user
router.get("/user", verifyToken, getOrdersByUser);

// GET /api/orders - Retrieve all orders for admin
router.get("/", verifyToken, verifyAdmin, getOrders);

// PATCH /api/orders/:id - Update order status
router.patch("/:id", verifyToken, verifyAdmin, updateOrderStatus);

// PATCH /api/orders/user/:id - Mark order as delivered
router.patch("/user/:id", verifyToken, markOrderAsDelivered);

export default router;
