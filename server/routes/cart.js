const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT 
        c.id,
        c.quantity,
        c.size,
        c.color,
        c.created_at,
        p.id as product_id,
        p.name,
        p.description,
        p.price,
        p.images,
        p.stock_quantity,
        p.category,
        p.material
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1 AND p.is_active = true
      ORDER BY c.created_at DESC
    `, [userId]);

    const cartItems = result.rows.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      originalPrice: parseFloat(item.price) * 1.2, // Assuming 20% discount
      images: item.images || [],
      stockQuantity: item.stock_quantity,
      category: item.category,
      material: item.material,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      addedAt: item.created_at
    }));

    res.json({ cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, size, color } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists and is active
    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Check stock availability
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ 
        message: `Only ${product.stock_quantity} items available in stock` 
      });
    }

    // Check if item already exists in cart
    const existingItem = await pool.query(`
      SELECT * FROM cart 
      WHERE user_id = $1 AND product_id = $2 AND size = $3 AND color = $4
    `, [userId, productId, size || null, color || null]);

    if (existingItem.rows.length > 0) {
      // Update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({ 
          message: `Cannot add more items. Only ${product.stock_quantity} available in stock` 
        });
      }

      await pool.query(`
        UPDATE cart 
        SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
      `, [newQuantity, existingItem.rows[0].id]);

      res.json({ 
        message: 'Cart updated successfully',
        cartItem: {
          id: existingItem.rows[0].id,
          quantity: newQuantity
        }
      });
    } else {
      // Add new item to cart
      const result = await pool.query(`
        INSERT INTO cart (user_id, product_id, quantity, size, color)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [userId, productId, quantity, size || null, color || null]);

      res.status(201).json({ 
        message: 'Item added to cart successfully',
        cartItem: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    // Check if cart item belongs to user
    const cartItem = await pool.query(`
      SELECT c.*, p.stock_quantity 
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = $1 AND c.user_id = $2
    `, [cartItemId, userId]);

    if (cartItem.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const item = cartItem.rows[0];

    // Check stock availability
    if (quantity > item.stock_quantity) {
      return res.status(400).json({ 
        message: `Only ${item.stock_quantity} items available in stock` 
      });
    }

    // Update quantity
    await pool.query(`
      UPDATE cart 
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
    `, [quantity, cartItemId]);

    res.json({ 
      message: 'Cart updated successfully',
      cartItem: {
        id: cartItemId,
        quantity: quantity
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/remove/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.id;

    // Check if cart item belongs to user
    const result = await pool.query(
      'SELECT * FROM cart WHERE id = $1 AND user_id = $2',
      [cartItemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Remove item from cart
    await pool.query('DELETE FROM cart WHERE id = $1', [cartItemId]);

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get cart count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT COUNT(*) as count FROM cart WHERE user_id = $1',
      [userId]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
