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
  const saveLocalCart = (items) => {
    try {
      localStorage.setItem('localCart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };
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
  const addToCart = async (productId, quantity = 1, size = null, color = null, productData = null) => {
    if (!user) {

      try {
        setLoading(true);
        

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
        const existingItemIndex = cartItems.findIndex(item => 
          item.productId === productId && 
          item.size === size && 
          item.color === color
        );

        let updatedItems;
        if (existingItemIndex >= 0) {

          updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {

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
      await fetchCartItems();
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };
  const updateQuantity = async (cartItemId, quantity) => {
    if (!user) {

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
      await fetchCartItems();
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };
  const removeFromCart = async (cartItemId) => {
    if (!user) {

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
      await fetchCartItems();
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };
  const clearCart = async () => {
    if (!user) {

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
  const buyNow = async (productId, quantity = 1, size = null, color = null, productData = null) => {
    try {

      const addResult = await addToCart(productId, quantity, size, color, productData);
      
      if (addResult.success) {
        

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
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      loadLocalCart();
    }
  }, [user]);
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
