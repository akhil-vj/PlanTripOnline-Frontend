import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="forgot-page">
      <Helmet>
        <title>Forgot Password - PlantripOnline</title>
      </Helmet>

      {/* Embedded Styles */}
      <style>{`
        /* Back Button */
        .forgot-page .back-button {
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

        .forgot-page .back-button:hover {
            background: rgba(255, 149, 0, 0.9);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 149, 0, 0.3);
        }

        .forgot-page {
            height: 100vh;
            overflow: hidden;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Homepage Background Integration */
        .forgot-page .homepage-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #f5f5f4, #fafaf9);
            z-index: -2;
        }

        .forgot-page .homepage-background::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover no-repeat;
            z-index: -1;
        }

        .forgot-page .homepage-background::after {
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

        .forgot-page .forgot-container {
            display: flex;
            height: 100vh;
            position: relative;
            z-index: 1;
        }

        .forgot-page .left-section {
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

        .forgot-page .left-section::before {
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

        .forgot-page .left-content {
            position: relative;
            z-index: 1;
            text-align: center;
        }

        .forgot-page .logo {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .forgot-page .logo .highlight {
            color: #ff9500;
        }

        .forgot-page .tagline {
            font-size: 1.8rem;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .forgot-page .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .forgot-page .right-section {
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

        .forgot-page .forgot-form-container {
            width: 100%;
            max-width: 420px;
        }

        .forgot-page .form-header {
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

        .forgot-page .form-header h2 {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .forgot-page .form-header p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .forgot-page .form-group {
            margin-bottom: 25px;
            opacity: 0;
            transform: translateX(30px);
            animation: fadeInLeft 0.6s ease forwards;
            animation-delay: 0.6s;
        }

        @keyframes fadeInLeft {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .forgot-page .form-group label {
            display: block;
            color: white;
            margin-bottom: 8px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .forgot-page .form-group input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 1rem;
            color: white;
            transition: all 0.3s ease;
        }

        .forgot-page .form-group input:focus {
            outline: none;
            border-color: #ff9500;
            background: rgba(255, 255, 255, 0.08);
        }

        .forgot-page .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .forgot-page .reset-button {
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
            animation: fadeIn 0.6s ease forwards 0.8s;
            position: relative;
        }

        .forgot-page .reset-button:hover:not(:disabled) {
            background: #e68600;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 149, 0, 0.3);
        }

        .forgot-page .reset-button:disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .forgot-page .reset-button .spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        .forgot-page .reset-button.loading .spinner {
            display: inline-block;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
            to { opacity: 1; }
        }

        .forgot-page .back-link {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            opacity: 0;
            animation: fadeIn 0.6s ease forwards 0.9s;
        }

        .forgot-page .back-link a {
            color: #ff9500;
            text-decoration: none;
            font-weight: 600;
        }

        .forgot-page .back-link a:hover {
            text-decoration: underline;
        }

        /* Success state styling */
        .forgot-page .success-state {
            text-align: center;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease;
        }

        .forgot-page .success-state.show {
            opacity: 1;
            transform: translateY(0);
        }

        .forgot-page .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 2.5rem;
        }

        .forgot-page .success-title {
            font-size: 1.5rem;
            color: white;
            margin-bottom: 10px;
        }

        .forgot-page .success-message {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
            margin-bottom: 25px;
        }

        @media (max-width: 968px) {
            .forgot-page .forgot-container {
                flex-direction: column;
            }

            .forgot-page .left-section {
                min-height: 40vh;
                animation: slideInTop 0.8s ease forwards;
            }

            @keyframes slideInTop {
                from { opacity: 0; transform: translateY(-100%); }
                to { opacity: 1; transform: translateY(0); }
            }

            .forgot-page .right-section {
                min-height: 60vh;
                animation: slideInBottom 0.8s ease forwards;
                border-radius: 20px 20px 0 0;
            }

            @keyframes slideInBottom {
                from { opacity: 0; transform: translateY(100%); }
                to { opacity: 1; transform: translateY(0); }
            }

            .forgot-page .tagline {
                font-size: 1.5rem;
            }
        }
      `}</style>

      {/* Back Button */}
      <Link to="/login" className="back-button">
        ← Back to Login
      </Link>
      
      {/* Homepage Background */}
      <div className="homepage-background"></div>
      
      <div className="forgot-container">
        <div className="left-section">
          <div className="left-content">
            <div className="logo">
              Plantrip<span className="highlight">O</span>nline
            </div>
            <div className="tagline">
              Recover Your Account
            </div>
            <div className="subtitle">
              Reset your password and get back to exploring Asia
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="forgot-form-container">
            
            {!success ? (
              <div id="resetForm" className="reset-form">
                <div className="form-header">
                  <h2>Forgot Password?</h2>
                  <p>Enter your email address and we'll send you a link to reset your password</p>
                </div>

                <form id="forgotPasswordForm" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="Enter your email address" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button type="submit" className={`reset-button ${loading ? 'loading' : ''}`} disabled={loading}>
                    <span className="spinner"></span>
                    <span className="button-text">{loading ? 'Sending...' : 'Send Reset Link'}</span>
                  </button>

                  <div className="back-link">
                    Remember your password? <Link to="/login">Back to Login</Link>
                  </div>
                </form>
              </div>
            ) : (
              <div id="successState" className="success-state show" style={{display: 'block'}}>
                <div className="success-icon">✉️</div>
                <div className="success-title">Check Your Email</div>
                <div className="success-message">
                  We've sent a password reset link to your email address. 
                  Please check your inbox and follow the instructions to reset your password.
                </div>
                <div className="back-link">
                  <Link to="/login">Back to Login</Link> | 
                  <a href="#" onClick={(e) => { e.preventDefault(); setSuccess(false); setEmail(''); }}>Try Another Email</a>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
