import path from 'path';
import __dirname from '../util/path.js';
import fs from 'fs';
import Cart from './cart.js'

const dataPath = path.join(__dirname, 'data', 'products.json');

function getProductsFromFile(callback) {
  fs.readFile(dataPath, (err, fileContent) => {
    if (err) {
      return callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(id , title, imageUrl, description, price) {
    this.id = id ;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      console.log(this.id);
      if(this.id){
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products]; 
        updatedProducts[existingProductIndex] = this ;
        fs.writeFile(dataPath, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(dataPath, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static deleteById(id){
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const UpdatedProducts = products.filter(prod => prod.id !== id );
      fs.writeFile(dataPath, JSON.stringify(UpdatedProducts) , (err) =>{
        if(!err){
          Cart.deleteProduct(id , product.price);
        }
      })
    })
  }

  static findById(id , callback){
    getProductsFromFile(products => {
      // console.log(products + " " + id );
      const product = products.find(p => p.id === id );
      callback(product);
    }) 
  }
};

export default Product;