const express = require('express');
const { pool } = require('./database');

const router = express.Router();
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
router.get('/celebrate', async (req, res) => {
  try {
    const { priceFilter = 'all' } = req.query;
    

    let baseQuery = 'SELECT * FROM products WHERE is_active = true';
    let baseParams = [];
    

    if (priceFilter !== 'all') {
      let priceValue;
      switch (priceFilter) {
        case '20k':
          priceValue = 20000;
          break;
        case '30k':
          priceValue = 30000;
          break;
        case '40k':
          priceValue = 40000;
          break;
        case '50k':
          priceValue = 50000;
          break;
        case '1lac':
          priceValue = 100000;
          break;
        default:
          break;
      }
      if (priceValue) {
        baseQuery += ' AND price <= $1';
        baseParams.push(priceValue);
      }
    }
    

    const finalQuery = baseQuery + ' ORDER BY RANDOM() LIMIT 8';
    
    const result = await pool.query(finalQuery, baseParams);
    const products = result.rows;
    

    const finalProducts = products.slice(0, 8);

    res.json({ products: finalProducts });
  } catch (error) {
    console.error('Get celebrate products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
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
