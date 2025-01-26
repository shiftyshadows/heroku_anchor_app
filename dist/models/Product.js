import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    default: "shiftyshadows" // Default creator
  },
  name: {
    type: String,
    required: [true, "Product name is required."],
    trim: true,
    minlength: [3, "Product name must be at least 3 characters long."]
  },
  price: {
    type: Number,
    required: [true, "Product price in Ksh is required."],
    min: [0, "Price cannot be negative."]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters."]
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    // Optional field
    trim: true
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required."],
    min: [0, "Stock cannot be negative."]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: date => date.toISOString().slice(0, 19).replace("T", " ") // Format to "YYYY-MM-DD HH:MM:SS"
  }
}, {
  timestamps: true,
  // Adds createdAt and updatedAt
  toJSON: {
    getters: true,
    // Ensures getters are applied when converting to JSON
    virtuals: true // Includes virtuals in JSON representation
  },
  toObject: {
    getters: true,
    // Ensures getters are applied when converting to objects
    virtuals: true // Includes virtuals in object representation
  }
});

// Virtual field to get the numeric price
productSchema.virtual("numericPrice").get(function () {
  return this.price; // Directly return price as a number
});

// Virtual field for formatted price with Ksh
productSchema.virtual("formattedPrice").get(function () {
  return `Ksh ${this.price.toFixed(2)}`; // Format price with two decimal places
});

// Virtual field to determine if the product is in stock
productSchema.virtual("isInStock").get(function () {
  return this.stock > 0; // Returns true if stock is greater than 0
});

// Middleware to sanitize inputs before saving
productSchema.pre("save", function (next) {
  this.name = this.name.trim();
  if (this.description) this.description = this.description.trim();
  next();
});

// Middleware to log document updates
productSchema.post("save", function (doc) {
  console.log(`Product "${doc.name}" has been saved.`);
});

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);
export default Product;