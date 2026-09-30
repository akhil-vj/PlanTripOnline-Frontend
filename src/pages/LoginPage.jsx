import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Hardcoded Admin check
    if (email === 'admin' && password === 'plantrip@123') {
      navigate('/admin-dashboard');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://backend.plantriponline.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Assume token is returned
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        navigate('/user-dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Left side with Image */}
      <div className={styles.authLeft}>
        <Link to="/" className={styles.backButton}>
          &larr; Back to Homepage
        </Link>
        <div className={styles.authLeftContent}>
          <h1 className={styles.authLogo}>Plantrip<span>O</span>nline</h1>
          <h2 className={styles.authTitle}>Discover the Magic of Asia</h2>
          <p className={styles.authSubtitle}>Explore Thailand & Malaysia with our curated packages</p>
        </div>
      </div>

      {/* Right side with Form */}
      <div className={styles.authRight}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formHeader}>Welcome Back</h2>
          <p className={styles.formSubheader}>Enter your credentials to access your account</p>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label>Email Address or Phone Number</label>
              <input
                type="text"
                placeholder="Enter your email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxGroup}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className={styles.switchAuth}>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
