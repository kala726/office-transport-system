import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validCredentials = [
    { email: 'admin@transport.com', password: 'admin123', role: 'Admin', name: 'Admin User' },
    { email: 'user@transport.com', password: 'user123', role: 'User', name: 'Regular User' },
    { email: 'manager@transport.com', password: 'manager123', role: 'Manager', name: 'Manager User' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const user = validCredentials.find(
        cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );

      if (user) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        const userSession = {
          email: user.email,
          name: user.name,
          role: user.role,
          loginTime: new Date().toISOString(),
        };

        sessionStorage.setItem('user', JSON.stringify(userSession));
        setIsAuthenticated(true);
        navigate('/', { replace: true });
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-container">
      {/* Background Decoration Circles */}
      <div className="login-bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-card">
        <header className="login-header">
          <div className="logo">🚀</div>
          <h1>Office Transport</h1>
          <p>Login to manage your daily commute</p>
        </header>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={`login-form ${loading ? 'loading' : ''}`}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '🔓' : '🔒'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Keep me logged in
            </label>
            <button
              type="button"
              className="forgot-password"
              onClick={() => alert('Contact Developer to reset password  ;)')}
              disabled={loading}
            >
              Forgot?
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        {/* <div className="demo-info">
          <p>Demo Credentials:</p>
          <div className="demo-credentials">
            <div><strong>Admin:</strong> admin@transport.com / admin123</div>
          </div>
        </div> */}

        <div className="login-footer">
          &copy; 2026 Office Transport System
        </div>
      </div>
    </div>
  );
};

export default Login;