import mongoose from "mongoose";
import Product from "./src/models/Product.js"; // Adjust this path to your Product model
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 35 Computer Items to Seed
const computerItems = [
  {
    name: "Gaming Laptop",
    price: 1299.99,
    description: "High-performance laptop with NVIDIA RTX graphics card.",
    stock: 20,
    featured: true,
    image: "rog_strix.png",
  },
  {
    name: "Wireless Mouse",
    price: 24.99,
    description: "Ergonomic wireless mouse with adjustable DPI.",
    stock: 50,
    featured: false,
    image: "wireless-mouse.jpg",
  },
  {
    name: "Mechanical Keyboard",
    price: 89.99,
    description: "RGB mechanical keyboard with customizable switches.",
    stock: 30,
    featured: false,
    image: "mechanical-keyboard.jpg",
  },
  {
    name: "4K Monitor",
    price: 399.99,
    description: "27-inch UHD monitor with HDR support.",
    stock: 15,
    featured: true,
    image: "uhd_monitor.png",
  },
  {
    name: "External SSD",
    price: 119.99,
    description: "1TB portable SSD with USB 3.1.",
    stock: 40,
    featured: true,
    image: "hard-drive.jpeg",
  },
  {
    name: "Gaming Chair",
    price: 199.99,
    description: "Ergonomic gaming chair with adjustable armrests.",
    stock: 10,
    featured: false,
    image: "gaming-chair.jpg",
  },
  {
    name: "Webcam",
    price: 49.99,
    description: "Full HD 1080p webcam for video conferencing.",
    stock: 35,
    featured: false,
    image: "webcam.jpg",
  },
  {
    name: "Graphics Card",
    price: 699.99,
    description: "NVIDIA RTX 3080 graphics card with 10GB VRAM.",
    stock: 5,
    featured: false,
    image: "graphics-card.jpg",
  },
  {
    name: "Processor",
    price: 329.99,
    description: "Intel Core i7 11th Gen Processor with 8 cores.",
    stock: 25,
    featured: false,
    image: "processor.jpg",
  },
  {
    name: "Gaming Headset",
    price: 79.99,
    description: "Surround sound headset with noise-canceling mic.",
    stock: 50,
    featured: false,
    image: "gaming-headset.jpg",
  },
  {
    name: "Motherboard",
    price: 199.99,
    description: "ATX motherboard with Wi-Fi 6 support.",
    stock: 12,
    featured: false,
    image: "motherboard.jpg",
  },
  {
    name: "Power Supply Unit",
    price: 89.99,
    description: "750W 80 Plus Gold certified PSU.",
    stock: 30,
    featured: false,
    image: "psu.jpg",
  },
  {
    name: "Gaming Desk",
    price: 159.99,
    description: "Spacious gaming desk with cable management.",
    stock: 8,
    featured: false,
    image: "gaming-desk.jpg",
  },
  {
    name: "PC Case",
    price: 119.99,
    description: "Mid-tower case with tempered glass panel.",
    stock: 20,
    featured: false,
    image: "pc-case.jpg",
  },
  {
    name: "Router",
    price: 99.99,
    description: "Wi-Fi 6 router with high-speed connectivity.",
    stock: 45,
    featured: false,
    image: "router.jpg",
  },
  {
    name: "RAM",
    price: 69.99,
    description: "16GB DDR4 RAM with RGB lighting.",
    stock: 40,
    featured: false,
    image: "ram.jpg",
  },
  {
    name: "Cooling Fan",
    price: 24.99,
    description: "RGB cooling fan for PC builds.",
    stock: 60,
    featured: false,
    image: "cooling-fan.jpg",
  },
  {
    name: "Docking Station",
    price: 79.99,
    description: "USB-C docking station with multiple ports.",
    stock: 25,
    featured: false,
    image: "docking-station.jpg",
  },
  {
    name: "Soundbar",
    price: 129.99,
    description: "Bluetooth soundbar with rich bass.",
    stock: 18,
    featured: false,
    image: "soundbar.jpg",
  },
  {
    name: "Printer",
    price: 199.99,
    description: "Wireless all-in-one printer with high-speed printing.",
    stock: 15,
    featured: false,
    image: "printer.jpg",
  },
  {
    name: "USB-C Hub",
    price: 39.99,
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.",
    stock: 40,
    featured: false,
    image: "usb-c-hub.jpg",
  },
  {
    name: "Ethernet Cable",
    price: 12.99,
    description: "Cat 6 Ethernet cable for high-speed internet connectivity.",
    stock: 100,
    featured: false,
    image: "ethernet-cable.jpg",
  },
  {
    name: "Hard Drive",
    price: 89.99,
    description: "2TB external hard drive for backup and storage.",
    stock: 50,
    featured: false,
    image: "hard-drive.jpg",
  },
  {
    name: "Gaming Controller",
    price: 59.99,
    description: "Wireless gaming controller with haptic feedback.",
    stock: 35,
    featured: true,
    image: "ps5-pad.png",
  },
  {
    name: "Webcam Cover",
    price: 9.99,
    description: "Privacy webcam cover for laptops and desktops.",
    stock: 150,
    featured: false,
    image: "webcam-cover.jpg",
  },
];

// Seed Database
const seedDatabase = async () => {
  try {
    await Product.insertMany(computerItems);
    console.log("Successfully added computer items to the database!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

seedDatabase();
