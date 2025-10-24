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

  // Load cart from localStorage for non-authenticated users
  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem('localCart');
      if (localCart) {
        const items = JSON.parse(localCart);
        setCartItems(items);
        setCartCount(items.length);
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    }
  };

  // Save cart to localStorage for non-authenticated users
  const saveLocalCart = (items) => {
    try {
      localStorage.setItem('localCart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };

  // Fetch cart items from API (for authenticated users)
  const fetchCartItems = async () => {
    if (!user) {
      loadLocalCart();
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
  const addToCart = async (productId, quantity = 1, size = null, color = null, productData = null) => {
    if (!user) {
      // For non-authenticated users, store in localStorage
      try {
        setLoading(true);
        
        // Use provided product data or create a basic structure
        const newItem = {
          id: `local_${Date.now()}_${productId}`,
          productId,
          quantity,
          size,
          color,
          price: productData?.price || 0,
          originalPrice: productData?.originalPrice || (productData?.price || 0) * 1.2,
          name: productData?.name || 'Product',
          images: productData?.images || [],
          material: productData?.material || '',
          category: productData?.category || '',
          created_at: new Date().toISOString()
        };

        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => 
          item.productId === productId && 
          item.size === size && 
          item.color === color
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          updatedItems = [...cartItems, newItem];
        }

        setCartItems(updatedItems);
        setCartCount(updatedItems.length);
        saveLocalCart(updatedItems);
        
        return { success: true, message: 'Item added to cart' };
      } catch (error) {
        return { success: false, message: 'Failed to add item to cart' };
      } finally {
        setLoading(false);
      }
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
    if (!user) {
      // For non-authenticated users, update local storage
      try {
        setLoading(true);
        const updatedItems = cartItems.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        );
        setCartItems(updatedItems);
        setCartCount(updatedItems.length);
        saveLocalCart(updatedItems);
        return { success: true, message: 'Quantity updated' };
      } catch (error) {
        return { success: false, message: 'Failed to update quantity' };
      } finally {
        setLoading(false);
      }
    }

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
    if (!user) {
      // For non-authenticated users, update local storage
      try {
        setLoading(true);
        const updatedItems = cartItems.filter(item => item.id !== cartItemId);
        setCartItems(updatedItems);
        setCartCount(updatedItems.length);
        saveLocalCart(updatedItems);
        return { success: true, message: 'Item removed from cart' };
      } catch (error) {
        return { success: false, message: 'Failed to remove item from cart' };
      } finally {
        setLoading(false);
      }
    }

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
    if (!user) {
      // For non-authenticated users, clear local storage
      try {
        setLoading(true);
        setCartItems([]);
        setCartCount(0);
        localStorage.removeItem('localCart');
        return { success: true, message: 'Cart cleared' };
      } catch (error) {
        return { success: false, message: 'Failed to clear cart' };
      } finally {
        setLoading(false);
      }
    }

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

  // Buy now functionality - add to cart and redirect to checkout
  const buyNow = async (productId, quantity = 1, size = null, color = null, productData = null) => {
    try {
      // First add the item to cart
      const addResult = await addToCart(productId, quantity, size, color, productData);
      
      if (addResult.success) {
        // Clear any existing cart items for buy now (optional - you might want to keep existing items)
        // await clearCart();
        
        // Return success with redirect information
        return { 
          success: true, 
          message: 'Item added to cart. Redirecting to checkout...',
          redirectTo: '/checkout'
        };
      } else {
        return addResult;
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to process buy now request' 
      };
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
      loadLocalCart();
    }
  }, [user]);

  // Load local cart on component mount
  useEffect(() => {
    if (!user) {
      loadLocalCart();
    }
  }, []);

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    buyNow,
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
