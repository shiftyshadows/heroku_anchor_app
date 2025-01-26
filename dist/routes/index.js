import express from 'express';
import productRoutes from './products.js';
const router = express.Router();
router.use('/products', productRoutes);
export default router;