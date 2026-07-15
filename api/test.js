const express = require('express');
const { isRazorpayConfigured, getRazorpayKeys } = require('./utils/razorpay');
const router = express.Router();
router.get('/', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
router.get('/razorpay', (req, res) => {
  const { keyId, keySecret } = getRazorpayKeys();
  res.json({
    configured: isRazorpayConfigured(),
    keyId: keyId || null,
    keyMode: keyId?.startsWith('rzp_live_') ? 'live' : keyId?.startsWith('rzp_test_') ? 'test' : 'unknown',
    secretSet: Boolean(keySecret),
    secretLength: keySecret ? keySecret.length : 0
  });
});
router.get('/db', async (req, res) => {
  try {
    const { pool } = require('./database');
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ 
      message: 'Database connected successfully!', 
      currentTime: result.rows[0].current_time,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

module.exports = router;
