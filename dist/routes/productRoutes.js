import express from "express";
import Product from "../models/Product.js";
const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Fetch all products with pagination and optional filtering
 * @access  Public
 */
router.get("/", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    featured
  } = req.query;
  try {
    const query = featured ? {
      featured: featured === "true"
    } : {};
    const skip = (page - 1) * limit;
    const products = await Product.find(query).skip(skip).limit(parseInt(limit)).sort({
      createdAt: -1
    }) // Optional: Sort by creation date (newest first)
    .lean(); // Convert documents to plain JavaScript objects

    const transformedProducts = products.map(product => ({
      ...product,
      id: product._id,
      // Add `id` field
      _id: undefined // Remove `_id` field
    }));
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    res.status(200).json({
      products: transformedProducts,
      currentPage: parseInt(page),
      totalPages,
      totalProducts
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Fetch a single product by MongoDB _id
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean(); // Convert to plain JavaScript object

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Transform _id to id
    product.id = product._id;
    delete product._id;
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error
    });
  }
});

/**
 * @route   POST /api/products
 * @desc    Add a new product
 * @access  Private (Admin)
 */
router.post("/", async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    image,
    featured
  } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image,
      featured: featured || false
    });
    const savedProduct = await newProduct.save();

    // Transform _id to id
    const transformedProduct = {
      ...savedProduct.toObject(),
      id: savedProduct._id,
      _id: undefined
    };
    res.status(201).json(transformedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
      error
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product by MongoDB _id
 * @access  Private (Admin)
 */
router.put("/:id", async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    image,
    featured
  } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name,
      description,
      price,
      stock,
      image,
      featured
    }, {
      new: true,
      runValidators: true
    });
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Transform _id to id
    const transformedProduct = {
      ...updatedProduct.toObject(),
      id: updatedProduct._id,
      _id: undefined
    };
    res.status(200).json(transformedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error
    });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by MongoDB _id
 * @access  Private (Admin)
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error
    });
  }
});
export default router;