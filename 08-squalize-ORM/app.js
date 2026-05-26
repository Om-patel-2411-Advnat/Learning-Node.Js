import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import * as errorController from './controllers/error.js';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import __dirname from './util/path.js';
import sequelize from './util/database.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// // db.execute  // this will allow to run a query 
// db.execute('SELECT * FROM products')
//     .then(result => {
//         console.log(result[0]);
//     })
//     .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
    .then(result => {
        // console.log(result)
        app.listen(3000);
    })
    .catch(err  => console.log(err));

