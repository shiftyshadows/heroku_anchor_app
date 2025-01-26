import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
const router = express.Router();

// Admin dashboard route
router.get("/admin-dashboard", verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard."
  });
});
export default router;