import Product from '../models/product.js';
import Cart from '../models/cart.js';

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

  req.user.getCart()
    .then( cart => {
      return cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

export const postCart = (req, res, next) => {
  const prodId = req.body.productID;
  let fetchedCart ;
  let newQuantity = 1  ;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart ;
      return cart.getProducts({where : {id : prodId}})
    })
    .then(products => {
      let product ;
      if(products.length > 0 ){
        product = products[0]
      }
      console.log(product);
      if(product){
        const oldQuantity = product.cartItem.quantity ;
        newQuantity = oldQuantity + 1 ;
        return product ; 
      }
      return Product.findByPk(prodId)
    })
    .then(product  => {
      return fetchedCart.addProduct(product, { through: { quantity : newQuantity} })
    })
    .then( () => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err))
}

export const postOrder = (req , res , next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then( order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = {quantity : product.cartItem.quantity};
              return product ;
            })
          );
        })
        .catch(err => console.log(err));;
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
}

export const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({ where: { id: prodId } })
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then( result =>{
    res.redirect('/cart'); 
  })
  .catch(err => console.log(err));
};

export const getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

