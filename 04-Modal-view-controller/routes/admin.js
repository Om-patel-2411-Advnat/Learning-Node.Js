// import path from 'path';
import express  from 'express';
import * as productsController from '../controllers/products.js';

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

export default router ;
