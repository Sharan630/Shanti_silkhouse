const express = require('express');
const { pool } = require('./database');
const { authenticateAdmin } = require('./middleware');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  let client;
  try {
    // Get a client from the pool to ensure connection stability
    client = await pool.connect();
    
    // Get total users
    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total products
    const productsResult = await client.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get active products
    const activeProductsResult = await client.query('SELECT COUNT(*) FROM products WHERE is_active = true');
    const activeProducts = parseInt(activeProductsResult.rows[0].count);

    // Get total orders
    const ordersResult = await client.query('SELECT COUNT(*) FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Get orders by status
    const ordersByStatusResult = await client.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    const ordersByStatus = ordersByStatusResult.rows;

    // Get total revenue
    const revenueResult = await client.query('SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != \'cancelled\'');
    const totalRevenue = parseFloat(revenueResult.rows[0].coalesce);

    // Get revenue this month
    const monthlyRevenueResult = await client.query(`
      SELECT COALESCE(SUM(total_amount), 0) as revenue 
      FROM orders 
      WHERE status != 'cancelled' 
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    const monthlyRevenue = parseFloat(monthlyRevenueResult.rows[0].revenue);

    // Get recent orders
    const recentOrdersResult = await client.query(`
      SELECT o.*, u.first_name, u.last_name, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);
    const recentOrders = recentOrdersResult.rows;

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue,
        monthlyRevenue
      },
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Get all products for admin
router.get('/products', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) FROM products';
    let params = [];
    let paramCount = 0;
    let conditions = [];

    if (category) {
      paramCount++;
      conditions.push(`category = $${paramCount}`);
      params.push(category);
    }

    if (search) {
      paramCount++;
      conditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const [productsResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, paramCount))
    ]);

    const products = productsResult.rows;
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
    console.error('Get admin products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new product
router.post('/products', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      images,
      sizes,
      colors,
      material,
      occasion,
      care_instructions
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products (
        name, description, price, category, images, sizes, colors, 
        material, occasion, care_instructions, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true) 
      RETURNING *`,
      [
        name, description, price, category, JSON.stringify(images),
        JSON.stringify(sizes), JSON.stringify(colors), material,
        occasion, care_instructions
      ]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product
router.put('/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      images,
      sizes,
      colors,
      material,
      occasion,
      care_instructions,
      is_active
    } = req.body;

    const result = await pool.query(
      `UPDATE products SET 
        name = $1, description = $2, price = $3, category = $4, 
        images = $5, sizes = $6, colors = $7, material = $8, 
        occasion = $9, care_instructions = $10, is_active = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12 RETURNING *`,
      [
        name, description, price, category, JSON.stringify(images),
        JSON.stringify(sizes), JSON.stringify(colors), material,
        occasion, care_instructions, is_active, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all orders
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT o.*, u.first_name, u.last_name, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    let countQuery = 'SELECT COUNT(*) FROM orders o';
    let params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      const condition = `o.status = $${paramCount}`;
      query += ` WHERE ${condition}`;
      countQuery += ` WHERE ${condition}`;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const [ordersResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, paramCount))
    ]);

    const orders = ordersResult.rows;
    const totalOrders = parseInt(countResult.rows[0].count);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page * limit < totalOrders,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
