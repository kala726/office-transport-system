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

  // Component එක Load වන විට කලින් මතක තබාගත් දත්ත තිබේදැයි බැලීම
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

    // සරල Validation එකක්
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // API Call එකක් ලෙස අනුකරණය කිරීම (Simulating API)
    setTimeout(() => {
      const user = validCredentials.find(
        cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );

      if (user) {
        // Remember Me Logic - Password එක save නොකර email එක පමණක් save කිරීම වඩාත් සුදුසුයි
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
        navigate('/', { replace: true }); // replace: true මගින් login එකට ආපසු (Back) යාම වලක්වයි
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <div className="logo-icon">🚀</div>
          <h1>Office Transport</h1>
          <p>Login to manage your daily commute</p>
        </header>

        {error && (
          <div className="error-banner">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🔓' : '🔒'}
              </button>
            </div>
          </div>

          <div className="form-actions-row">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Keep me logged in
            </label>
            <button type="button" className="text-btn" onClick={() => alert('Contact Admin to reset password')}>
              Forgot?
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;