import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);
  const from = location.state?.from?.pathname || '/';
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        setMessage('Login successful! Redirecting...');
        

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'password123'
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {}
        <Link to="/" className="back-btn">
          <FiArrowLeft />
          Back to Home
        </Link>

        {}
        <div className="login-form-container">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue shopping</p>
          </div>

          {message && (
            <div className="message success">
              {message}
            </div>
          )}

          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                  className={validationErrors.email ? 'error' : ''}
                />
              </div>
              {validationErrors.email && (
                <span className="error-message">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                  className={validationErrors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {validationErrors.password && (
                <span className="error-message">{validationErrors.password}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="demo-login">
              <p>Want to try the demo?</p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="demo-btn"
                disabled={loading}
              >
                <FiUser />
                Use Demo Credentials
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="link">
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {}
        <div className="login-image">
          <div className="image-content">
            <h2>SHANTI SILK HOUSE</h2>
            <p>Premium Sarees & Traditional Wear</p>
            <div className="decoration">
              <div className="lotus">🌸</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
