import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const { admin, adminLogin, logout } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    size: '',
    color: '',
    material: '',
    stockQuantity: '',
    images: []
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await adminLogin(loginData.email, loginData.password);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Handle product form submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stockQuantity: parseInt(productForm.stockQuantity)
      };

      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct.id}`, productData);
      } else {
        await axios.post('/api/admin/products', productData);
      }

      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        size: '',
        color: '',
        material: '',
        stockQuantity: '',
        images: []
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving product');
    }
    setLoading(false);
  };

  // Handle image upload
  const handleImageUpload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post('/api/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newImages = response.data.images.map(img => img.imageUrl);
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (error) {
      setError('Error uploading images');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        setError('Error deleting product');
      }
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      size: product.size || '',
      color: product.color || '',
      material: product.material || '',
      stockQuantity: product.stock_quantity.toString(),
      images: product.images || []
    });
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      setError('Error updating order status');
    }
  };

  useEffect(() => {
    if (admin) {
      fetchProducts();
      fetchOrders();
    }
  }, [admin]);

  if (!admin) {
    return (
      <div className="admin-login">
        <div className="admin-login-container">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-info">
          <span>Welcome, {admin.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'products' && (
        <div className="admin-content">
          <div className="product-form">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleProductSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    value={productForm.size}
                    onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({...productForm, color: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  value={productForm.stockQuantity}
                  onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                <div className="image-preview">
                  {productForm.images.map((img, index) => (
                    <img key={index} src={img} alt={`Product ${index + 1}`} />
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </form>
          </div>

          <div className="products-list">
            <h3>Products</h3>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  {product.images && product.images.length > 0 && (
                    <img src={product.images[0]} alt={product.name} />
                  )}
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>₹{product.price}</p>
                    <p>Stock: {product.stock_quantity}</p>
                    <div className="product-actions">
                      <button onClick={() => handleEditProduct(product)}>Edit</button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-content">
          <h3>Orders</h3>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h4>Order #{order.id}</h4>
                  <span className={`status status-${order.status}`}>{order.status}</span>
                </div>
                <div className="order-details">
                  <p><strong>Customer:</strong> {order.first_name} {order.last_name}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Total:</strong> ₹{order.total_amount}</p>
                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="order-actions">
                  <select 
                    value={order.status} 
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
