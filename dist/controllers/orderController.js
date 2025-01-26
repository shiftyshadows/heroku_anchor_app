import Order from "../models/Order.js";
import mongoose from "mongoose";
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      total
    } = req.body;

    // Validate request payload
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Invalid or empty items list."
      });
    }
    if (!total || typeof total !== "number") {
      return res.status(400).json({
        message: "Invalid total amount."
      });
    }

    // Ensure `userId` is attached to the order
    const newOrder = new Order({
      userId: req.user.id,
      // Extracted from token by verifyToken middleware
      items,
      total,
      date: new Date()
    });
    await newOrder.save();
    res.status(201).json({
      message: "Order created successfully",
      order: newOrder
    });
  } catch (err) {
    console.error("Order creation failed:", err.message);
    res.status(500).json({
      error: "Failed to create order."
    });
  }
};

// Fetch all orders with sorting and pagination
export const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    // Define the status order
    const sortOrder = {
      New: 1,
      Shipped: 2,
      Delivered: 3
    };

    // Fetch and sort orders using aggregation
    const orders = await Order.aggregate([{
      $addFields: {
        sortOrder: {
          $ifNull: [{
            $arrayElemAt: [["New", "Shipped", "Delivered"], {
              $indexOfArray: [["New", "Shipped", "Delivered"], "$status"]
            }]
          }, 99]
        }
      }
    }, {
      $sort: {
        sortOrder: 1,
        date: -1
      }
    },
    // Sort by status and then by date
    {
      $skip: (page - 1) * limit
    }, {
      $limit: Number(limit)
    }]);
    const totalOrders = await Order.countDocuments();
    res.status(200).json({
      orders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / limit)
    });
  } catch (err) {
    console.error("Failed to fetch all orders:", err.message);
    res.status(500).json({
      message: "Failed to fetch all orders."
    });
  }
};

// Fetch orders for the logged-in user
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id; // User ID extracted from token
    const orders = await Order.find({
      userId
    }).sort({
      date: -1
    }); // Sort by date (latest first)
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch user orders."
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const {
      id
    } = req.params; // Order ID from URL
    const {
      status
    } = req.body; // New status from request body
    console.log("Received ID:", id); // Debugging: Check the ID
    // Validate the status
    if (!["New", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status."
      });
    }

    // Determine if `id` is an ObjectId or string and query accordingly
    const query = mongoose.Types.ObjectId.isValid(id) ? {
      _id: new mongoose.Types.ObjectId(id)
    } // Query by ObjectId
    : {
      _id: id
    }; // Query directly by string if not an ObjectId

    // Update the order
    const updatedOrder = await Order.findOneAndUpdate(query, {
      status
    }, {
      new: true
    });
    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found."
      });
    }
    res.status(200).json({
      message: "Order status updated.",
      order: updatedOrder
    });
  } catch (err) {
    console.error("Failed to update order status:", err.message);
    res.status(500).json({
      message: "Failed to update order status."
    });
  }
};
export const markOrderAsDelivered = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Order ID."
      });
    }
    const order = await Order.findById(id);

    // Check if the order exists and belongs to the logged-in user
    if (!order || order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access denied: Not your order."
      });
    }

    // Ensure the order can only be marked as delivered if it's shipped
    if (order.status !== "Shipped") {
      return res.status(400).json({
        message: "Order must be shipped before it can be delivered."
      });
    }

    // Update the order status to Delivered
    order.status = "Delivered";
    await order.save();
    res.status(200).json({
      message: "Order marked as delivered.",
      order
    });
  } catch (err) {
    console.error("Failed to update order status:", err.message);
    res.status(500).json({
      message: "Failed to update order status."
    });
  }
};