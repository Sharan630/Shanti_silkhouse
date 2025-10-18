import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, 
  FiEdit, FiTrash2, FiEye, FiSearch, FiFilter,
  FiDownload, FiUpload, FiSettings, FiBarChart2,
  FiPackage, FiTruck, FiCheckCircle, FiXCircle,
  FiPlus, FiRefreshCw, FiCalendar, FiClock
} from 'react-icons/fi';
import './AdminPanel.css';

const AdminPanel = () => {
  const { admin, adminLogin, logout } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
    salesChart: []
  });

  // Products data
  const [products, setProducts] = useState([]);
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
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');

  // Orders data
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  // Users data
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');

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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
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

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
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
        setSuccess('Product updated successfully!');
      } else {
        await axios.post('/api/admin/products', productData);
        setSuccess('Product created successfully!');
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
      fetchDashboardData();
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

  // Delete product function
  const handleDeleteProduct = async (productId) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Send DELETE request to backend
        await axios.delete(`/api/admin/products/${productId}`);
        
        // Show success message
        setSuccess('Product deleted successfully!');
        
        // Refresh products list without reloading page
        fetchProducts();
        fetchDashboardData();
        
      } catch (error) {
        // Show error message
        setError('Failed to delete product');
        console.error('Delete error:', error);
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
      setSuccess('Order status updated successfully!');
      fetchOrders();
      fetchDashboardData();
    } catch (error) {
      setError('Error updating order status');
    }
  };

  // Toggle product status
  const handleToggleProductStatus = async (productId, isActive) => {
    try {
      await axios.put(`/api/admin/products/${productId}`, { isActive: !isActive });
      setSuccess('Product status updated successfully!');
      fetchProducts();
    } catch (error) {
      setError('Error updating product status');
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    if (admin) {
      fetchDashboardData();
      fetchProducts();
      fetchOrders();
      fetchUsers();
    }
  }, [admin]);

  // Auto clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (!admin) {
    return (
      <div className="admin-login">
        <div className="admin-login-container">
          <div className="login-header">
            <h2>Admin Login</h2>
            <p>Access your admin dashboard</p>
          </div>
          <form onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
                placeholder="admin@saree.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {admin.name}</p>
        </div>
        <div className="admin-header-right">
          <button onClick={logout} className="logout-btn">
            <FiXCircle />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <FiBarChart2 />
          Dashboard
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          <FiPackage />
          Products
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          <FiShoppingBag />
          Orders
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          <FiUsers />
          Users
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          <FiTrendingUp />
          Analytics
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="message error">
          <FiXCircle />
          {error}
        </div>
      )}
      {success && (
        <div className="message success">
          <FiCheckCircle />
          {success}
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="admin-content">
          <div className="dashboard-header">
            <h2>Dashboard Overview</h2>
            <button onClick={fetchDashboardData} className="refresh-btn">
              <FiRefreshCw />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users">
                <FiUsers />
              </div>
              <div className="stat-content">
                <h3>{dashboardData.totalUsers}</h3>
                <p>Total Users</p>
                <span className="stat-change positive">+12% this month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon products">
                <FiPackage />
              </div>
              <div className="stat-content">
                <h3>{dashboardData.totalProducts}</h3>
                <p>Total Products</p>
                <span className="stat-change positive">+5 new this week</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orders">
                <FiShoppingBag />
              </div>
              <div className="stat-content">
                <h3>{dashboardData.totalOrders}</h3>
                <p>Total Orders</p>
                <span className="stat-change positive">+8% this month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon revenue">
                <FiDollarSign />
              </div>
              <div className="stat-content">
                <h3>₹{dashboardData.totalRevenue?.toLocaleString()}</h3>
                <p>Total Revenue</p>
                <span className="stat-change positive">+15% this month</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="dashboard-section">
            <h3>Recent Orders</h3>
            <div className="recent-orders">
              {dashboardData.recentOrders?.slice(0, 5).map(order => (
                <div key={order.id} className="recent-order">
                  <div className="order-info">
                    <h4>Order #{order.id}</h4>
                    <p>{order.first_name} {order.last_name}</p>
                  </div>
                  <div className="order-amount">
                    <span>₹{order.total_amount}</span>
                    <span className={`status status-${order.status}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="admin-content">
          <div className="section-header">
            <h2>Product Management</h2>
            <div className="header-actions">
              <div className="search-box">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Products</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="low-stock">Low Stock</option>
              </select>
            </div>
          </div>

          {/* Product Form */}
          <div className="product-form-section">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleProductSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="kanjivaram">Kanjivaram</option>
                    <option value="vintage">Vintage</option>
                    <option value="crafts">Crafts</option>
                    <option value="fancy">Fancy & Occasional</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    value={productForm.size}
                    onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                    placeholder="e.g., Free Size, S, M, L"
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
                    placeholder="e.g., Red, Blue, Green"
                  />
                </div>
                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                    placeholder="e.g., Silk, Cotton, Chiffon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  value={productForm.stockQuantity}
                  onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                  required
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="form-group">
                <label>Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="file-input"
                />
                <div className="image-preview">
                  {productForm.images.map((img, index) => (
                    <div key={index} className="preview-image">
                      <img src={img} alt={`Product ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => setProductForm(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
                        className="remove-image"
                      >
                        <FiXCircle />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
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
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products List */}
          <div className="products-section">
            <h3>Products ({products.length})</h3>
            <div className="products-grid">
              {products
                .filter(product => {
                  const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase());
                  const matchesFilter = 
                    productFilter === 'all' ||
                    (productFilter === 'active' && product.is_active) ||
                    (productFilter === 'inactive' && !product.is_active) ||
                    (productFilter === 'low-stock' && product.stock_quantity < 10);
                  return matchesSearch && matchesFilter;
                })
                .map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <div className={`product-status ${product.is_active ? 'active' : 'inactive'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-price">₹{product.price.toLocaleString()}</p>
                    <p className="product-stock">
                      Stock: {product.stock_quantity}
                      {product.stock_quantity < 10 && <span className="low-stock"> (Low Stock)</span>}
                    </p>
                    <div className="product-actions">
                      <button onClick={() => handleEditProduct(product)} className="btn-edit">
                        <FiEdit />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleToggleProductStatus(product.id, product.is_active)}
                        className={`btn-toggle ${product.is_active ? 'deactivate' : 'activate'}`}
                      >
                        {product.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Delete button clicked for product:', product.id);
                          handleDeleteProduct(product.id);
                        }}
                        className="btn-delete"
                        style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <FiTrash2 />
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

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="admin-content">
          <div className="section-header">
            <h2>Order Management</h2>
            <div className="header-actions">
              <div className="search-box">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(order => {
                    const matchesSearch = 
                      order.id.toString().includes(orderSearch) ||
                      `${order.first_name} ${order.last_name}`.toLowerCase().includes(orderSearch.toLowerCase());
                    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
                    return matchesSearch && matchesFilter;
                  })
                  .map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="customer-info">
                        <strong>{order.first_name} {order.last_name}</strong>
                        <span>{order.email}</span>
                      </div>
                    </td>
                    <td>₹{order.total_amount.toLocaleString()}</td>
                    <td>
                      <span className={`status status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-content">
          <div className="section-header">
            <h2>User Management</h2>
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(user => 
                    user.first_name.toLowerCase().includes(userSearch.toLowerCase()) ||
                    user.last_name.toLowerCase().includes(userSearch.toLowerCase()) ||
                    user.email.toLowerCase().includes(userSearch.toLowerCase())
                  )
                  .map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-view">
                        <FiEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="admin-content">
          <h2>Analytics & Reports</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Sales Overview</h3>
              <p>Revenue analytics and sales trends will be displayed here.</p>
            </div>
            <div className="analytics-card">
              <h3>Product Performance</h3>
              <p>Top-selling products and inventory insights.</p>
            </div>
            <div className="analytics-card">
              <h3>Customer Insights</h3>
              <p>Customer behavior and demographics analysis.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;