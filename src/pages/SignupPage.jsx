import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://backend.plantriponline.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        navigate('/user-dashboard');
      } else {
        // Typically validation errors are returned as an object in Laravel
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
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
          <h2 className={styles.formHeader}>Create Account</h2>
          <p className={styles.formSubheader}>Join us and start your journey today</p>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form onSubmit={handleSignup}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Country</label>
                <select 
                  name="country" 
                  value={formData.country} 
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="IN">India</option>
                  <option value="MY">Malaysia</option>
                  <option value="TH">Thailand</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxGroup}>
                <input type="checkbox" required />
                <span>I agree to the <Link to="/terms" className={styles.termsLink}>Terms & Conditions</Link> and <Link to="/privacy" className={styles.termsLink}>Privacy Policy</Link></span>
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <div className={styles.switchAuth}>
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
