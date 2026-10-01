import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({ login_id: '', password: '', remember_me: false });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pupilTransform, setPupilTransform] = useState('translate(0px, 0px)');
  
  const eyeBtnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!showPassword || !eyeBtnRef.current) return;
      
      const eyeRect = eyeBtnRef.current.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;
      
      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 100);
      const moveDistance = Math.min(distance / 20, 1.5);
      
      const moveX = Math.cos(angle) * moveDistance;
      const moveY = Math.sin(angle) * moveDistance;
      
      setPupilTransform(`translate(${moveX}px, ${moveY}px)`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [showPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Hardcoded Admin check
    if (formData.login_id === 'admin' && formData.password === 'plantrip@123') {
      navigate('/admin-dashboard');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email: formData.login_id, password: formData.password })
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
    <div className="login-page">
      <Helmet>
        <title>Login - PlantripOnline</title>
      </Helmet>

      {/* Embedded Styles */}
      <style>{`
        /* Back Button */
        .login-page .back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.9);
            color: #1c1917;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .login-page .back-button:hover {
            background: rgba(255, 149, 0, 0.9);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 149, 0, 0.3);
        }

        .login-page {
            height: 100vh;
            overflow: hidden;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Homepage Background Integration */
        .login-page .homepage-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #f5f5f4, #fafaf9);
            z-index: -2;
        }

        .login-page .homepage-background::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover no-repeat;
            z-index: -1;
        }

        .login-page .homepage-background::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                to bottom, 
                rgba(0, 0, 0, 0.6) 0%,
                rgba(0, 0, 0, 0.4) 20%,
                rgba(0, 0, 0, 0.3) 40%,
                rgba(0, 0, 0, 0.2) 60%,
                rgba(0, 0, 0, 0.1) 80%,
                rgba(245, 245, 244, 0.95) 100%
            );
            z-index: 0;
        }

        .login-page .login-container {
            display: flex;
            height: 100vh;
            position: relative;
            z-index: 1;
        }

        .login-page .left-section {
            flex: 1;
            background: transparent;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            padding: 40px;
            position: relative;
            opacity: 0;
            transform: translateX(-100%);
            animation: slideInLeft 0.8s ease forwards;
        }

        @keyframes slideInLeft {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .login-page .left-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(52, 73, 94, 0.1), rgba(44, 62, 80, 0.2));
            backdrop-filter: blur(5px);
            border-radius: 0 20px 20px 0;
        }

        .login-page .left-content {
            position: relative;
            z-index: 1;
            text-align: center;
        }

        .login-page .logo {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .login-page .logo .highlight {
            color: #ff9500;
        }

        .login-page .tagline {
            font-size: 1.8rem;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .login-page .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .login-page .right-section {
            flex: 1;
            background: rgba(44, 62, 80, 0.85);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px;
            opacity: 0;
            transform: translateX(100%);
            animation: slideInRight 0.8s ease forwards;
            border-radius: 20px 0 0 20px;
        }

        @keyframes slideInRight {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .login-page .login-form-container {
            width: 100%;
            max-width: 420px;
        }

        .login-page .form-header {
            margin-bottom: 40px;
            color: white;
            opacity: 0;
            transform: translateY(-20px);
            animation: fadeInDown 0.6s ease forwards 0.5s;
        }

        @keyframes fadeInDown {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .login-page .form-header h2 {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .login-page .form-header p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
        }

        .login-page .error-msg {
            background: rgba(255, 59, 48, 0.1);
            border: 1px solid rgba(255, 59, 48, 0.3);
            color: #ff3b30;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.9rem;
            text-align: center;
        }

        .login-page .form-group {
            margin-bottom: 25px;
            opacity: 0;
            transform: translateX(30px);
            animation: fadeInLeft 0.6s ease forwards;
        }

        .login-page .form-group:nth-child(1) { animation-delay: 0.6s; }
        .login-page .form-group:nth-child(2) { animation-delay: 0.7s; }

        @keyframes fadeInLeft {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .login-page .form-group label {
            display: block;
            color: white;
            margin-bottom: 8px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .login-page .form-group input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 1rem;
            color: white;
            transition: all 0.3s ease;
        }

        .login-page .form-group input:focus {
            outline: none;
            border-color: #ff9500;
            background: rgba(255, 255, 255, 0.08);
        }

        .login-page .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .login-page .password-wrapper {
            position: relative;
        }

        .login-page .password-toggle {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s ease;
        }

        .login-page .password-toggle:hover {
            color: #ff9500;
        }

        .login-page .password-toggle svg {
            width: 20px;
            height: 20px;
        }

        .login-page #eye-pupil {
            transition: transform 0.1s ease;
            transform-origin: center;
        }

        .login-page .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            font-size: 0.9rem;
            opacity: 0;
            animation: fadeIn 0.6s ease forwards 0.8s;
        }

        @keyframes fadeIn {
            to { opacity: 1; }
        }

        .login-page .remember-me {
            display: flex;
            align-items: center;
            color: rgba(255, 255, 255, 0.8);
        }

        .login-page .remember-me input[type="checkbox"] {
            margin-right: 8px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .login-page .forgot-password {
            color: #ff9500;
            text-decoration: none;
            transition: opacity 0.3s ease;
        }

        .login-page .forgot-password:hover {
            opacity: 0.8;
        }

        .login-page .login-button {
            width: 100%;
            padding: 15px;
            background: #ff9500;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 20px;
            opacity: 0;
            animation: fadeIn 0.6s ease forwards 0.9s;
            position: relative;
        }

        .login-page .login-button:hover:not(:disabled) {
            background: #e68600;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 149, 0, 0.3);
        }

        .login-page .login-button:disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .login-page .login-button .spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        .login-page .login-button.loading .spinner {
            display: inline-block;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .login-page .signup-link {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            opacity: 0;
            animation: fadeIn 0.6s ease forwards 1s;
        }

        .login-page .signup-link a {
            color: #ff9500;
            text-decoration: none;
            font-weight: 600;
        }

        .login-page .signup-link a:hover {
            text-decoration: underline;
        }

        @media (max-width: 968px) {
            .login-page .login-container {
                flex-direction: column;
            }

            .login-page .left-section {
                min-height: 40vh;
                animation: slideInTop 0.8s ease forwards;
            }

            @keyframes slideInTop {
                from { opacity: 0; transform: translateY(-100%); }
                to { opacity: 1; transform: translateY(0); }
            }

            .login-page .right-section {
                min-height: 60vh;
                animation: slideInBottom 0.8s ease forwards;
                border-radius: 20px 20px 0 0;
            }

            @keyframes slideInBottom {
                from { opacity: 0; transform: translateY(100%); }
                to { opacity: 1; transform: translateY(0); }
            }

            .login-page .tagline {
                font-size: 1.5rem;
            }
        }
      `}</style>

      {/* Back Button */}
      <Link to="/" className="back-button">
        ← Back to Homepage
      </Link>
      
      {/* Homepage Background */}
      <div className="homepage-background"></div>
      
      <div className="login-container">
        <div className="left-section">
          <div className="left-content">
            <div className="logo">
              Plantrip<span className="highlight">O</span>nline
            </div>
            <div className="tagline">
              Discover the Magic of Asia
            </div>
            <div className="subtitle">
              Explore Thailand & Malaysia with our curated packages
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="login-form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="loginId">Email Address or Phone Number</label>
                <input 
                  type="text" 
                  id="loginId" 
                  name="login_id" 
                  placeholder="Enter your email or phone number" 
                  required
                  value={formData.login_id}
                  onChange={(e) => setFormData({...formData, login_id: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    name="password" 
                    placeholder="Enter your password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    ref={eyeBtnRef}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {showPassword ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          <circle id="eye-pupil" cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" style={{transform: pupilTransform}} />
                        </>
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input 
                    type="checkbox" 
                    id="rememberMe" 
                    name="remember_me" 
                    checked={formData.remember_me}
                    onChange={(e) => setFormData({...formData, remember_me: e.target.checked})}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit" className={`login-button ${loading ? 'loading' : ''}`} disabled={loading}>
                <span className="spinner"></span>
                <span className="button-text">{loading ? 'Logging in...' : 'Login'}</span>
              </button>

              <div className="signup-link">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
