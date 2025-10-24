import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiCheckCircle } from 'react-icons/fi';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('Password reset instructions have been sent to your email address.');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <Link to="/login" className="back-btn">
          <FiArrowLeft />
          Back to Login
        </Link>

        <div className="forgot-password-form-container">
          <div className="forgot-password-header">
            <h1>Forgot Password?</h1>
            <p>Enter your email address and we'll send you instructions to reset your password.</p>
          </div>

          {message && (
            <div className="message success">
              <FiCheckCircle />
              {message}
            </div>
          )}

          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary reset-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Sending...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>

          <div className="forgot-password-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
