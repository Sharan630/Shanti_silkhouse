const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products WHERE is_active = true';
    let params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const products = result.rows;

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM products WHERE is_active = true';
    let countParams = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalProducts = parseInt(countResult.rows[0].count);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        hasNext: page * limit < totalProducts,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get new arrivals (latest 4 products)
router.get('/new-arrivals', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC LIMIT 4'
    );

    const products = result.rows;
    res.json({ products });
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get products for celebrate section with price filtering
router.get('/celebrate', async (req, res) => {
  try {
    const { priceFilter = 'all' } = req.query;
    
    let query = 'SELECT * FROM products WHERE is_active = true';
    let params = [];
    let paramCount = 0;

    // Add price filtering based on the selected filter
    if (priceFilter !== 'all') {
      paramCount++;
      let priceCondition = '';
      switch (priceFilter) {
        case '20k':
          priceCondition = ` AND price <= $${paramCount}`;
          params.push(20000);
          break;
        case '30k':
          priceCondition = ` AND price <= $${paramCount}`;
          params.push(30000);
          break;
        case '40k':
          priceCondition = ` AND price <= $${paramCount}`;
          params.push(40000);
          break;
        case '50k':
          priceCondition = ` AND price <= $${paramCount}`;
          params.push(50000);
          break;
        case '1lac':
          priceCondition = ` AND price <= $${paramCount}`;
          params.push(100000);
          break;
        default:
          break;
      }
      query += priceCondition;
    }

    query += ' ORDER BY created_at DESC LIMIT 8';

    const result = await pool.query(query, params);
    const products = result.rows;

    res.json({ products });
  } catch (error) {
    console.error('Get celebrate products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM products WHERE is_active = true AND category IS NOT NULL ORDER BY category'
    );

    const categories = result.rows.map(row => row.category);
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
