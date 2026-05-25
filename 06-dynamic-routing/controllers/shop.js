import Product from '../models/product.js';
import Cart from '../models/cart.js';

export const getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

export const getProduct = (req , res , next) =>{
  const prodId = req.params.productID ;
  Product.findById(prodId , product => {
    res.render('shop/product-detail' , {
      product : product ,
      pageTitle : product.title,
      path : "/products"
    })
  })
}

export const getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

export const getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [] ;
      for (let product of products){ 
        const cartProductData = cart.products.find( prod => prod.id === product.id );

        if (cartProductData){
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

export const postCart = (req , res , next) => {
  const prodId = req.body.productID ;
  Product.findById(prodId , product => {
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
