import Product from '../models/product.js';

export const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing : false ,
  });
};

export const postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
  })
  .then(result => {
    console.log("created the product")
    res.redirect('/admin/products')
  })
  .catch(err => {
    console.log(err);
  });
};

export const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit ;
  if(!editMode){
    return res.redirect('/');
  }

  const prodId = req.params.productID; 
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      });
    })
    .catch(err => console.log(err));
};

export const postEditProduct = (req, res, next) => {
  const prodId = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/admin/products');
      }
      return product.update({
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        imageUrl: updatedImageUrl,
      });
    })
    .then(result => {
      console.log("UPDATED PRODUCT")
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

export const getProducts = (req, res, next) => {
  // Product.findAll()  // this is for fetching all the products
  req.user.getProducts() // this is for fetching all the products for only one specific user 
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

export const postDeleteProduct = (req , res , next ) =>{
  const prodId = req.body.productID ;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log("DESTROYED PRODUCT");
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}
