import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Demo credentials (In real app, this would be from backend)
  const validCredentials = [
    { email: 'admin@transport.com', password: 'admin123', role: 'Admin', name: 'Admin User' },
    { email: 'user@transport.com', password: 'user123', role: 'User', name: 'Regular User' },
    { email: 'manager@transport.com', password: 'manager123', role: 'Manager', name: 'Manager User' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Check credentials
      const user = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (user) {
        // Handle "Remember Me"
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        // Create user session
        const userSession = {
          email: user.email,
          name: user.name,
          role: user.role,
          loginTime: new Date().toISOString(),
        };

        // Save to sessionStorage (clears when browser closes)
        sessionStorage.setItem('user', JSON.stringify(userSession));
        
        // Update authentication state
        setIsAuthenticated(true);
        
        // Redirect to home page
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your email in a real application.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo and Title */}
        <div className="login-header">
          <div className="logo">🚗</div>
          <h1>Office Transport System</h1>
          <p>Welcome back! Please login to continue</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">
              <span className="label-icon">📧</span>
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Demo Credentials Info */}
        {/* <div className="demo-info">
          <p>📝 Demo Credentials:</p>
          <div className="demo-credentials">
            <div>admin@transport.com / admin123</div>
            <div>user@transport.com / user123</div>
            <div>manager@transport.com / manager123</div>
          </div>
        </div> */}

        {/* Footer */}
        <div className="login-footer">
          <p>© 2026 Office Transport System. All rights reserved.</p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="login-bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
};

export default Login;