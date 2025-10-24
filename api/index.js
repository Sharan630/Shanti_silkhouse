const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRoutes = require('./auth');
const productRoutes = require('./products');
const adminRoutes = require('./admin');
const uploadRoutes = require('./upload');
const cartRoutes = require('./cart');
const testRoutes = require('./test');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/test', testRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});
app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});
module.exports = app;
