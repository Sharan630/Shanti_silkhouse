const express = require('express');
const { pool } = require('./database');
const { authenticateAdmin } = require('./middleware');

const router = express.Router();

const PAID_REVENUE_FILTER = `status != 'cancelled' AND payment_status IN ('paid', 'paid_on_delivery')`;

router.get('/dashboard', authenticateAdmin, async (req, res) => {
  let client;
  try {
    client = await pool.connect();

    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    const productsResult = await client.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(productsResult.rows[0].count);

    const activeProductsResult = await client.query('SELECT COUNT(*) FROM products WHERE is_active = true');
    const activeProducts = parseInt(activeProductsResult.rows[0].count);

    const ordersResult = await client.query('SELECT COUNT(*) FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    const ordersByStatusResult = await client.query(`
      SELECT status, COUNT(*)::int as count
      FROM orders
      GROUP BY status
    `);
    const ordersByStatus = ordersByStatusResult.rows;

    const revenueResult = await client.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE ${PAID_REVENUE_FILTER}`
    );
    const totalRevenue = parseFloat(revenueResult.rows[0].total);

    const monthlyRevenueResult = await client.query(`
      SELECT COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE ${PAID_REVENUE_FILTER}
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    const monthlyRevenue = parseFloat(monthlyRevenueResult.rows[0].revenue);

    const lastMonthRevenueResult = await client.query(`
      SELECT COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE ${PAID_REVENUE_FILTER}
      AND created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND created_at < DATE_TRUNC('month', CURRENT_DATE)
    `);
    const lastMonthRevenue = parseFloat(lastMonthRevenueResult.rows[0].revenue);

    const revenueGrowth = lastMonthRevenue > 0
      ? parseFloat(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1))
      : 0;

    const recentOrdersResult = await client.query(`
      SELECT o.*, u.first_name, u.last_name, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);
    const recentOrders = recentOrdersResult.rows;

    const topProductsResult = await client.query(`
      SELECT p.id, p.name, p.price,
             COUNT(oi.id)::int as order_count,
             COALESCE(SUM(oi.quantity), 0)::int as total_quantity
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
      GROUP BY p.id, p.name, p.price
      ORDER BY order_count DESC, total_quantity DESC
      LIMIT 5
    `);
    const topProducts = topProductsResult.rows;

    const lowStockResult = await client.query(`
      SELECT * FROM products
      WHERE stock_quantity < 10 AND is_active = true
      ORDER BY stock_quantity ASC
      LIMIT 5
    `);
    const lowStockProducts = lowStockResult.rows;

    const weeklyOrdersResult = await client.query(`
      SELECT COUNT(*)::int as count,
             COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND status != 'cancelled'
    `);
    const weeklyOrders = weeklyOrdersResult.rows[0];

    const avgOrderValueResult = await client.query(`
      SELECT COALESCE(AVG(total_amount), 0) as avg_value
      FROM orders
      WHERE ${PAID_REVENUE_FILTER}
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
  } finally {
    if (client) {
      client.release();
    }
  }
});

router.get('/products', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 100, search = '' } = req.query;
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
    const products = result.rows.map(product => ({
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || [])
    }));
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
      stockQuantity,
      isActive = true
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, size, color, material, images, stock_quantity, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, description, price, category, size, color, material, JSON.stringify(images || []), stockQuantity, Boolean(isActive)]
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

router.put('/products/:id/toggle-status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const currentProduct = await pool.query(
      'SELECT is_active FROM products WHERE id = $1',
      [id]
    );

    if (currentProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentStatus = currentProduct.rows[0].is_active;
    const newStatus = currentStatus === null ? true : !currentStatus;

    const result = await pool.query(
      'UPDATE products SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    res.json({
      message: 'Product status updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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
    const activeStatus = isActive !== undefined ? Boolean(isActive) : true;

    const result = await pool.query(
      `UPDATE products SET
       name = $1, description = $2, price = $3, category = $4, size = $5,
       color = $6, material = $7, images = $8, stock_quantity = $9,
       is_active = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 RETURNING *`,
      [name, description, price, category, size, color, material,
        JSON.stringify(images || []), stockQuantity, activeStatus, id]
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

router.delete('/products/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const productCheck = await pool.query(
      'SELECT id FROM products WHERE id = $1',
      [id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await pool.query('DELETE FROM cart WHERE product_id = $1', [id]);

    await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);

    res.json({
      message: 'Product deleted successfully',
      note: 'Product has been removed from all user carts'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 500, status } = req.query;
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
      const statusCondition = ` WHERE o.status = $${paramCount}`;
      query += statusCondition;
      countQuery += statusCondition;
      params.push(status);
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const orders = result.rows;
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

router.put('/orders/:id/payment-status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const result = await pool.query(
      'UPDATE orders SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [payment_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order payment status updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order payment status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/orders/:id', authenticateAdmin, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query('SELECT id FROM orders WHERE id = $1', [req.params.id]);

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Order not found' });
    }

    const itemsResult = await client.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
      [req.params.id]
    );

    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('DELETE FROM order_items WHERE order_id = $1', [req.params.id]);
    await client.query('DELETE FROM orders WHERE id = $1', [req.params.id]);

    await client.query('COMMIT');

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

router.get('/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT oi.*, p.name as product_name, p.images
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.json({
      order: {
        ...order,
        items: itemsResult.rows
      }
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 500, search = '' } = req.query;
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

router.delete('/users/:id', authenticateAdmin, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query('SELECT id FROM users WHERE id = $1', [req.params.id]);

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'User not found' });
    }

    const ordersResult = await client.query(
      'SELECT id FROM orders WHERE user_id = $1',
      [req.params.id]
    );

    for (const order of ordersResult.rows) {
      const itemsResult = await client.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
        [order.id]
      );

      for (const item of itemsResult.rows) {
        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }

      await client.query('DELETE FROM order_items WHERE order_id = $1', [order.id]);
    }

    await client.query('DELETE FROM orders WHERE user_id = $1', [req.params.id]);
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.params.id]);
    await client.query('DELETE FROM users WHERE id = $1', [req.params.id]);

    await client.query('COMMIT');

    res.json({
      message: 'User deleted successfully',
      deletedOrders: ordersResult.rows.length
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

router.get('/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

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
