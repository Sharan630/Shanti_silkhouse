const express = require('express');
const pool = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get total users
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total products
    const productsResult = await pool.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get active products
    const activeProductsResult = await pool.query('SELECT COUNT(*) FROM products WHERE is_active = true');
    const activeProducts = parseInt(activeProductsResult.rows[0].count);

    // Get total orders
    const ordersResult = await pool.query('SELECT COUNT(*) FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Get orders by status
    const ordersByStatusResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    const ordersByStatus = ordersByStatusResult.rows;

    // Get total revenue
    const revenueResult = await pool.query('SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != \'cancelled\'');
    const totalRevenue = parseFloat(revenueResult.rows[0].coalesce);

    // Get revenue this month
    const monthlyRevenueResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as revenue 
      FROM orders 
      WHERE status != 'cancelled' 
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    const monthlyRevenue = parseFloat(monthlyRevenueResult.rows[0].revenue);

    // Get revenue last month for comparison
    const lastMonthRevenueResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as revenue 
      FROM orders 
      WHERE status != 'cancelled' 
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE) - 1
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    const lastMonthRevenue = parseFloat(lastMonthRevenueResult.rows[0].revenue);

    // Calculate revenue growth
    const revenueGrowth = lastMonthRevenue > 0 ? 
      ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0;

    // Get recent orders
    const recentOrdersResult = await pool.query(`
      SELECT o.*, u.first_name, u.last_name, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC 
      LIMIT 10
    `);
    const recentOrders = recentOrdersResult.rows;

    // Get top products (by order count)
    const topProductsResult = await pool.query(`
      SELECT p.*, COUNT(oi.id) as order_count, SUM(oi.quantity) as total_quantity
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
      GROUP BY p.id
      ORDER BY order_count DESC
      LIMIT 5
    `);
    const topProducts = topProductsResult.rows;

    // Get low stock products
    const lowStockResult = await pool.query(`
      SELECT * FROM products 
      WHERE stock_quantity < 10 AND is_active = true
      ORDER BY stock_quantity ASC
      LIMIT 5
    `);
    const lowStockProducts = lowStockResult.rows;

    // Get orders this week
    const weeklyOrdersResult = await pool.query(`
      SELECT COUNT(*) as count, 
             COALESCE(SUM(total_amount), 0) as revenue
      FROM orders 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND status != 'cancelled'
    `);
    const weeklyOrders = weeklyOrdersResult.rows[0];

    // Get average order value
    const avgOrderValueResult = await pool.query(`
      SELECT COALESCE(AVG(total_amount), 0) as avg_value
      FROM orders 
      WHERE status != 'cancelled'
    `);
    const avgOrderValue = parseFloat(avgOrderValueResult.rows[0].avg_value);

    res.json({
      totalUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      monthlyRevenue,
      revenueGrowth,
      ordersByStatus,
      recentOrders,
      topProducts,
      lowStockProducts,
      weeklyOrders: {
        count: parseInt(weeklyOrders.count),
        revenue: parseFloat(weeklyOrders.revenue)
      },
      avgOrderValue
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all products (admin)
router.get('/products', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) FROM products';
    let params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      const searchCondition = ` WHERE (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      query += searchCondition;
      countQuery += searchCondition;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const products = result.rows;

    // Get total count
    const countResult = await pool.query(countQuery, params.slice(0, paramCount));
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

// Create product
router.post('/products', authenticateAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      size,
      color,
      material,
      images,
      stockQuantity
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, size, color, material, images, stock_quantity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, description, price, category, size, color, material, JSON.stringify(images || []), stockQuantity]
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

// Toggle product status
router.put('/products/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    console.log('Toggle status endpoint hit for product ID:', req.params.id);
    const { id } = req.params;

    // First get the current product to toggle its status
    const currentProduct = await pool.query(
      'SELECT is_active FROM products WHERE id = $1',
      [id]
    );

    console.log('Current product query result:', currentProduct.rows);

    if (currentProduct.rows.length === 0) {
      console.log('Product not found with ID:', id);
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentStatus = currentProduct.rows[0].is_active;
    const newStatus = currentStatus === null ? true : !currentStatus;
    
    console.log('Current status:', currentStatus, 'New status:', newStatus);

    const result = await pool.query(
      'UPDATE products SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    console.log('Update result:', result.rows[0]);

    res.json({
      message: 'Product status updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
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
      size,
      color,
      material,
      images,
      stockQuantity,
      isActive
    } = req.body;

    const result = await pool.query(
      `UPDATE products SET 
       name = $1, description = $2, price = $3, category = $4, size = $5, 
       color = $6, material = $7, images = $8, stock_quantity = $9, 
       is_active = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 RETURNING *`,
      [name, description, price, category, size, color, material, 
       JSON.stringify(images || []), stockQuantity, isActive, id]
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

    // First, check if product exists
    const productCheck = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete all cart items that reference this product
    await pool.query(
      'DELETE FROM cart WHERE product_id = $1',
      [id]
    );

    // Now delete the product
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    res.json({ 
      message: 'Product deleted successfully',
      note: 'Product has been removed from all user carts'
    });
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
    let countQuery = 'SELECT COUNT(*) FROM orders';
    let params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      const statusCondition = ` WHERE o.status = $${paramCount}`;
      query += statusCondition;
      countQuery += statusCondition;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const orders = result.rows;

    // Get total count
    const countResult = await pool.query(countQuery, params.slice(0, paramCount));
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
    console.error('Get admin orders error:', error);
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

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, first_name, last_name, email, phone, created_at FROM users';
    let countQuery = 'SELECT COUNT(*) FROM users';
    let params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      const searchCondition = ` WHERE (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      query += searchCondition;
      countQuery += searchCondition;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const users = result.rows;

    // Get total count
    const countResult = await pool.query(countQuery, params.slice(0, paramCount));
    const totalUsers = parseInt(countResult.rows[0].count);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user details
router.get('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's orders
    const ordersResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json({
      user: result.rows[0],
      orders: ordersResult.rows
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
