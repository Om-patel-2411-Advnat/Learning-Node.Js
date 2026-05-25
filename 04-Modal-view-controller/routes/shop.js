// import path from 'path';
import express from 'express';
import * as productsController from '../controllers/products.js';

const router = express.Router();

router.get('/', productsController.getProducts);

export default router;
