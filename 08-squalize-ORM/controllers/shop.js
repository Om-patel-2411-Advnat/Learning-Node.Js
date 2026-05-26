import Product from '../models/product.js';
import Cart from '../models/cart.js';
import { where } from 'sequelize';

export const getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

export const getProduct = (req, res, next) => {
  const prodId = req.params.productID;

  // this is how you can use the where to filter from the result of find all 
  // Product.findAll({where : {id : prodId}})
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: "/products"
  //     })
  //   })
  //   .catch(err => console.log(err));

  // this is an alternative approach and better by this method you can directly get the product with the id no need for the where 
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product ,
        pageTitle: product.title,
        path: "/products"
      })
    })
    .catch(err => console.log(err));
}

export const getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

export const getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id);

        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        };
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    })
  })
};

export const postCart = (req, res, next) => {
  const prodId = req.body.productID;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/cart');
}

export const getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

export const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productID;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

export const getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
