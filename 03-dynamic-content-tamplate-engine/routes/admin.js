// import path from 'path';
import express from 'express';
// import rootDir from '../util/path.js';

const router = express.Router();

export const products = [] ;

router.get('/add-product', (req, res, next) => {
    // res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });  // this is for pug 
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product', formsCSS: true, productCSS: true, activeAddProduct: true }); // this is for express-handlebars
});

router.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect('/');
});

export default router;
