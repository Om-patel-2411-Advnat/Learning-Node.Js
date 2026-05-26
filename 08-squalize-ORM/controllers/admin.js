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
  Product.create({
    title ,
    price ,
    imageUrl ,
    description
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
      product.title = updatedTitle ;
      product.price = updatedPrice ;
      product.description = updatedDesc ;
      product.imageUrl = updatedImageUrl ;
      // this is sequelize method for saving the changes into the database
      // it will check if the product already exists than update and if not create new one 
      return product.save();
    })
    .then(result => {
      console.log("UPDATED PRODUCT")
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

export const getProducts = (req, res, next) => {
  Product.findAll()
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
      console.log("DESTROYED PRODUCT")
    })
    .catch(err => console.log(err));
  res.redirect('/admin/products');
}
