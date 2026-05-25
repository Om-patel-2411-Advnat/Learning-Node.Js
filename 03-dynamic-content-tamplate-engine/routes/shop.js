import path from 'path';
import express from 'express';
import rootDir from '../util/path.js';
import { products } from './admin.js';

const router = express.Router();

router.get('/', (req, res, next) => {
    // res.render('shop', { prods: products, Title: 'Shop', path: '/' }); // this is pug 
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });  // this is express-handlebars
});

export default router;  