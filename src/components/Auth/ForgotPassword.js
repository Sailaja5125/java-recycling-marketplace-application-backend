import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await authAPI.forgotPassword(email);
      setResetToken(response.data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data || 'Failed to send reset token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">Enter your email to receive a reset token</p>

        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" role="alert" aria-live="polite">
            <p>Reset token generated successfully!</p>
            <div className="token-display">
              <strong>Your reset token:</strong>
              <code className="reset-token" aria-label={`Reset token: ${resetToken}`}>
                {resetToken}
              </code>
              <p className="token-instruction">
                Please copy this token and use it on the reset password page.
              </p>
            </div>
            <Link to="/reset-password" className="btn-primary" style={{ marginTop: '1rem' }}>
              Go to Reset Password
            </Link>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
                autoComplete="email"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
              aria-label={loading ? 'Sending reset token...' : 'Send reset token'}
            >
              {loading ? 'Sending...' : 'Send Reset Token'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          Remember your password?{' '}
          <Link to="/login" className="auth-link" aria-label="Go back to login">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
