const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const cartRoutes = require('./routes/cart');
const { initializeDatabase } = require('./models/database');
const envPath = path.join(__dirname, 'config.env');
dotenv.config({ path: envPath });
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in environment variables');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
