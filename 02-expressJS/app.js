import express from 'express';
import path from 'path';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import __dirname from './util/path.js';

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
