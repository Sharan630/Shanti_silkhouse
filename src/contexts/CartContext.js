import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart items from API
  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCartItems(response.data.cartItems);
      setCartCount(response.data.cartItems.length);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/cart/add', {
        productId,
        quantity,
        size,
        color
      });

      // Refresh cart items
      await fetchCartItems();
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (!user) return { success: false, message: 'Please login' };

    try {
      setLoading(true);
      const response = await axios.put(`/api/cart/update/${cartItemId}`, {
        quantity
      });

      // Refresh cart items
      await fetchCartItems();
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    if (!user) return { success: false, message: 'Please login' };

    try {
      setLoading(true);
      const response = await axios.delete(`/api/cart/remove/${cartItemId}`);

      // Refresh cart items
      await fetchCartItems();
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user) return { success: false, message: 'Please login' };

    try {
      setLoading(true);
      const response = await axios.delete('/api/cart/clear');

      setCartItems([]);
      setCartCount(0);
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Get cart count
  const getCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const response = await axios.get('/api/cart/count');
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const savings = originalTotal - subtotal;
    const shipping = subtotal > 5000 ? 0 : 200;
    const total = subtotal + shipping;

    return {
      subtotal,
      originalTotal,
      savings,
      shipping,
      total,
      itemCount: cartItems.length
    };
  };

  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotals,
    fetchCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
