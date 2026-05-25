import express from 'express';
import path from 'path';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import __dirname from './util/path.js';
// import {engine} from 'express-handlebars';

const app = express();

// this is for express-handlebars
// app.engine(
//     'hbs',
//     engine({
//         layoutsDir: 'views/layouts/',
//         defaultLayout: 'main-layout',
//         extname: 'hbs'
//     })
// );
// app.set('view engine' , 'hbs');

// this is for pug
// app.set('view engine' , 'pug');

app.set('view engine' , 'ejs');
app.set('views' , 'views');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render("404" , {pageTitle : "Page not found"});
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
