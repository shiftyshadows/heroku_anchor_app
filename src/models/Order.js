import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID for the order
  items: [
    {
      id: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["New", "Shipped", "Delivered"], // Order statuses
    default: "New",
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
