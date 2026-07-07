const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../utils/email');

const router = express.Router();

// Create a new order
router.post('/', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id;
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      state, 
      zipCode, 
      paymentMethod 
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode || !paymentMethod) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get cart items for this user
    const cartResult = await client.query(`
      SELECT c.*, p.name, p.price, p.id as product_id
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1 AND p.is_active = true
    `, [userId]);

    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Verify stock for all items before proceeding
    for (const cartItem of cartItems) {
      const stockCheck = await client.query(
        'SELECT stock_quantity FROM products WHERE id = $1 FOR UPDATE',
        [cartItem.product_id]
      );
      
      if (stockCheck.rows.length === 0 || stockCheck.rows[0].stock_quantity < cartItem.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          message: `Not enough stock for ${cartItem.name}. Available: ${stockCheck.rows[0]?.stock_quantity || 0}`
        });
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const shipping = subtotal >= 2000 ? 0 : 200;
    const totalAmount = subtotal + shipping;

    // Create shipping address string
    const shippingAddress = `${address}, ${city}, ${state} ${zipCode}`;

    // Create order
    const orderResult = await client.query(`
      INSERT INTO orders (
        user_id, 
        total_amount, 
        status, 
        shipping_address, 
        billing_address, 
        payment_method, 
        payment_status,
        phone_number
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      userId,
      totalAmount,
      'pending',
      shippingAddress,
      shippingAddress,
      paymentMethod,
      paymentMethod === 'cod' ? 'pending' : 'pending',
      phone
    ]);

    const order = orderResult.rows[0];

    // Create order items and decrement stock
    for (const cartItem of cartItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [
        order.id,
        cartItem.product_id,
        cartItem.quantity,
        cartItem.price
      ]);

      await client.query(`
        UPDATE products 
        SET stock_quantity = stock_quantity - $1 
        WHERE id = $2
      `, [cartItem.quantity, cartItem.product_id]);
    }

    // Clear cart after order creation
    await client.query(`
      DELETE FROM cart WHERE user_id = $1
    `, [userId]);

    await client.query('COMMIT');

    // Send order confirmation email asynchronously (no need to block the response)
    sendOrderConfirmationEmail(email, order, cartItems).catch(console.error);

    res.status(201).json({
      message: 'Order placed successfully',
      order: {
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        paymentStatus: order.payment_status
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', p.name
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const orderResult = await pool.query(`
      SELECT * FROM orders WHERE id = $1 AND user_id = $2
    `, [orderId, userId]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [orderId]);

    order.items = itemsResult.rows;

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
