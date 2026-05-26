import db from '../util/database.js'

import Cart from './cart.js'

class Product {
  constructor(id, title, price, description, imageUrl) {
    this.id = id ;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title , price , description , imageUrl) VALUES (?,?,?,?)',
      [this.title , this.price , this.description , this.imageUrl]
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static deleteById(id){
    
  }

  static findById(id){
    return db.execute('SELECT * FROM products WHERE products.id = ?' , [id]);
  }
};

export default Product;