import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};
