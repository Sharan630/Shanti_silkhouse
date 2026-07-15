import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''
  : 'http://localhost:5001';

axios.defaults.baseURL = API_BASE_URL;

const TOKEN_STORAGE_KEY = 'token';
const ADMIN_TOKEN_STORAGE_KEY = 'adminToken';
const USER_STORAGE_KEY = 'user';
const ADMIN_STORAGE_KEY = 'admin';

const AuthContext = createContext();

const isAuthError = (error) => {
  const status = error?.response?.status;
  return status === 401 || status === 403;
};

const saveUserSession = (token, userData) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const saveAdminSession = (token, adminData) => {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminData));
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  delete axios.defaults.headers.common['Authorization'];
};

const readCachedUser = () => {
  try {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const readCachedAdmin = () => {
  try {
    const cached = localStorage.getItem(ADMIN_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const adminToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (token) {
        const cachedUser = readCachedUser();
        if (cachedUser) setUser(cachedUser);
      }

      if (adminToken) {
        const cachedAdmin = readCachedAdmin();
        if (cachedAdmin) setAdmin(cachedAdmin);
      }

      const activeToken = adminToken || token;
      if (!activeToken) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;

      try {
        if (adminToken) {
          await axios.get('/api/admin/dashboard');
          const cachedAdmin = readCachedAdmin();
          if (cachedAdmin) setAdmin(cachedAdmin);
        } else if (token) {
          const response = await axios.get('/api/auth/profile');
          setUser(response.data.user);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
        }
      } catch (error) {
        if (isAuthError(error)) {
          clearSession();
          setUser(null);
          setAdmin(null);
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (emailOrPhone, password, loginType = 'email') => {
    try {
      const payload = loginType === 'phone'
        ? { phone: emailOrPhone, password }
        : { email: emailOrPhone, password };

      const response = await axios.post('/api/auth/login', payload);
      const { token, user: loggedInUser } = response.data;

      saveUserSession(token, loggedInUser);
      setUser(loggedInUser);
      setAdmin(null);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user: registeredUser } = response.data;

      saveUserSession(token, registeredUser);
      setUser(registeredUser);
      setAdmin(null);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/admin/login', { email, password });
      const { token, admin: loggedInAdmin } = response.data;

      saveAdminSession(token, loggedInAdmin);
      setAdmin(loggedInAdmin);
      setUser(null);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Admin login failed'
      };
    }
  };

  const logout = () => {
    clearSession();
    localStorage.removeItem('wishlist');
    setUser(null);
    setAdmin(null);
    window.dispatchEvent(new Event('userLogout'));
  };

  const value = {
    user,
    admin,
    login,
    register,
    adminLogin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
