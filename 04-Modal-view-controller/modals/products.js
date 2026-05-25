import path from 'path';
import __dirname from '../util/path.js';
import fs from 'fs';

const products = [];
const dataPath = path.join(__dirname, 'data', 'products.json');

function getProductsFromFile (callback){
    fs.readFile(dataPath , (err, fileContent) => {
        if (err) {
            return callback([]);
        } else {
            callback(JSON.parse(fileContent));
        }
    });
};

class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(dataPath, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
};

export default Product ;