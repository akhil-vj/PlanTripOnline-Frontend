import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    full_name: '', email: '', country: '', phone: '',
    password: '', password_confirmation: '', terms_accepted: false
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [pupilTransform, setPupilTransform] = useState('translate(0px, 0px)');
  const [confirmPupilTransform, setConfirmPupilTransform] = useState('translate(0px, 0px)');
  
  const eyeBtnRef = useRef(null);
  const eyeBtnConfirmRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // First eye
      if (showPassword && eyeBtnRef.current) {
        const eyeRect = eyeBtnRef.current.getBoundingClientRect();
        const deltaX = e.clientX - (eyeRect.left + eyeRect.width / 2);
        const deltaY = e.clientY - (eyeRect.top + eyeRect.height / 2);
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 100);
        const moveDistance = Math.min(distance / 20, 1.5);
        setPupilTransform(`translate(${Math.cos(angle) * moveDistance}px, ${Math.sin(angle) * moveDistance}px)`);
      }
      // Second eye
      if (showConfirmPassword && eyeBtnConfirmRef.current) {
        const eyeRect = eyeBtnConfirmRef.current.getBoundingClientRect();
        const deltaX = e.clientX - (eyeRect.left + eyeRect.width / 2);
        const deltaY = e.clientY - (eyeRect.top + eyeRect.height / 2);
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 100);
        const moveDistance = Math.min(distance / 20, 1.5);
        setConfirmPupilTransform(`translate(${Math.cos(angle) * moveDistance}px, ${Math.sin(angle) * moveDistance}px)`);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [showPassword, showConfirmPassword]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.full_name,
        email: formData.email,
        country: formData.country,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      const response = await apiFetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        navigate('/user-dashboard');
      } else {
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
    <div className="signup-page">
      <Helmet>
        <title>Sign Up - PlantripOnline</title>
      </Helmet>

      {/* Embedded Styles */}
      <style>{`
        /* Back Button */
        .signup-page .back-button {
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

        .signup-page .back-button:hover {
            background: rgba(255, 149, 0, 0.9);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 149, 0, 0.3);
        }

        .signup-page {
            height: 100vh;
            overflow: hidden;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Homepage Background Integration */
        .signup-page .homepage-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #f5f5f4, #fafaf9);
            z-index: -2;
        }

        .signup-page .homepage-background::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover no-repeat;
            z-index: -1;
        }

        .signup-page .homepage-background::after {
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

        .signup-page .signup-container {
            display: flex;
            height: 100vh;
            position: relative;
            z-index: 1;
        }

        .signup-page .left-section {
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

        .signup-page .left-section::before {
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

        .signup-page .left-content {
            position: relative;
            z-index: 1;
            text-align: center;
        }

        .signup-page .logo {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .signup-page .logo .highlight {
            color: #ff9500;
        }

        .signup-page .tagline {
            font-size: 1.8rem;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .signup-page .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .signup-page .right-section {
            flex: 1;
            background: rgba(44, 62, 80, 0.85);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px;
            overflow-y: auto;
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

        .signup-page .signup-form-container {
            width: 100%;
            max-width: 420px;
            padding: 15px 0;
        }

        .signup-page .form-header {
            margin-bottom: 25px;
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

        .signup-page .form-header h2 {
            font-size: 1.8rem;
            margin-bottom: 8px;
        }

        .signup-page .form-header p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }

        .signup-page .error-msg {
            background: rgba(255, 59, 48, 0.1);
            border: 1px solid rgba(255, 59, 48, 0.3);
            color: #ff3b30;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.9rem;
            text-align: center;
        }

        .signup-page .form-group {
            margin-bottom: 18px;
            opacity: 0;
            transform: translateX(30px);
            animation: fadeInLeft 0.6s ease forwards;
        }

        .signup-page .form-group:nth-child(1) { animation-delay: 0.6s; }
        .signup-page .form-group:nth-child(2) { animation-delay: 0.65s; }

        /* Phone-Country row animation */
        .signup-page .phone-country-row {
            opacity: 0;
            transform: translateX(30px);
            animation: fadeInLeft 0.6s ease forwards;
            animation-delay: 0.7s;
        }

        /* Password row animation */
        .signup-page .password-row { 
            opacity: 0;
            transform: translateX(30px);
            animation: fadeInLeft 0.6s ease forwards;
            animation-delay: 0.75s;
        }

        /* Phone-Country row layout */
        .signup-page .phone-country-row {
            display: flex;
            gap: 15px;
            margin-bottom: 18px;
        }

        .signup-page .phone-field, .signup-page .country-field {
            flex: 1;
        }

        .signup-page .country-field {
            flex: 1; /* 1/3 width */
        }

        .signup-page .phone-field {
            flex: 2; /* 2/3 width */
        }

        .signup-page .phone-field .form-group,
        .signup-page .country-field .form-group {
            margin-bottom: 0;
        }

        .signup-page .phone-field label,
        .signup-page .country-field label {
            display: block;
            color: white;
            margin-bottom: 6px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .signup-page .phone-field input,
        .signup-page .country-field select {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 0.95rem;
            color: white;
            transition: all 0.3s ease;
        }

        .signup-page .phone-field input:focus,
        .signup-page .country-field select:focus {
            outline: none;
            border-color: #ff9500;
            background: rgba(255, 255, 255, 0.08);
        }

        .signup-page .phone-field input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .signup-page .country-field select {
            cursor: pointer;
        }

        .signup-page .country-field select option {
            background: #2c3e50;
            color: white;
        }

        @keyframes fadeInLeft {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .signup-page .form-group label {
            display: block;
            color: white;
            margin-bottom: 6px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .signup-page .form-group input,
        .signup-page .form-group select {
            width: 100%;
            padding: 12px 14px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 0.95rem;
            color: white;
            transition: all 0.3s ease;
        }

        .signup-page .form-group input:focus,
        .signup-page .form-group select:focus {
            outline: none;
            border-color: #ff9500;
            background: rgba(255, 255, 255, 0.08);
        }

        .signup-page .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        /* Password row layout */
        .signup-page .password-row {
            display: flex;
            gap: 15px;
            margin-bottom: 18px;
        }

        .signup-page .password-field {
            flex: 1;
        }

        .signup-page .password-field .form-group {
            margin-bottom: 0;
        }

        .signup-page .password-field label {
            display: block;
            color: white;
            margin-bottom: 6px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .signup-page .password-field input {
            width: 100%;
            padding: 12px 45px 12px 14px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 0.95rem;
            color: white;
            transition: all 0.3s ease;
        }

        .signup-page .password-field input:focus {
            outline: none;
            border-color: #ff9500;
            background: rgba(255, 255, 255, 0.08);
        }

        .signup-page .password-field input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .signup-page .password-field .password-wrapper {
            position: relative;
        }

        .signup-page .password-field .password-toggle {
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

        .signup-page .password-field .password-toggle:hover {
            color: #ff9500;
        }

        .signup-page .password-field .password-toggle svg {
            width: 18px;
            height: 18px;
        }

        .signup-page #eye-pupil,
        .signup-page #eye-pupil-confirm {
            transition: transform 0.1s ease;
            transform-origin: center;
        }

        .signup-page .terms-checkbox {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.85rem;
            opacity: 0;
            animation: fadeIn 0.6s ease forwards 0.9s;
        }

        @keyframes fadeIn {
            to { opacity: 1; }
        }

        .signup-page .terms-checkbox input[type="checkbox"] {
            margin-right: 8px;
            margin-top: 2px;
            width: 16px;
            height: 16px;
            cursor: pointer;
            flex-shrink: 0;
        }

        .signup-page .terms-checkbox a {
            color: #ff9500;
            text-decoration: none;
        }

        .signup-page .terms-checkbox a:hover {
            text-decoration: underline;
        }

        .signup-page .signup-button {
            width: 100%;
            padding: 13px;
            background: #ff9500;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 18px;
            opacity: 0;
            animation: fadeIn 0.6s ease forwards 1s;
            position: relative;
        }

        .signup-page .signup-button:hover:not(:disabled) {
            background: #e68600;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 149, 0, 0.3);
        }

        .signup-page .signup-button:disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .signup-page .signup-button .spinner {
            display: none;
            width: 18px;
            height: 18px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }

        .signup-page .signup-button.loading .spinner {
            display: inline-block;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .signup-page .login-link {
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.85rem;
            padding-bottom: 10px;
            opacity: 0;
            animation: fadeIn 0.6s ease forwards 1.1s;
        }

        .signup-page .login-link a {
            color: #ff9500;
            text-decoration: none;
            font-weight: 600;
        }

        .signup-page .login-link a:hover {
            text-decoration: underline;
        }

        @media (max-width: 968px) {
            .signup-page .signup-container {
                flex-direction: column;
            }

            .signup-page .left-section {
                min-height: 30vh;
                animation: slideInTop 0.8s ease forwards;
            }

            @keyframes slideInTop {
                from { opacity: 0; transform: translateY(-100%); }
                to { opacity: 1; transform: translateY(0); }
            }

            .signup-page .right-section {
                min-height: 70vh;
                animation: slideInBottom 0.8s ease forwards;
                border-radius: 20px 20px 0 0;
            }

            @keyframes slideInBottom {
                from { opacity: 0; transform: translateY(100%); }
                to { opacity: 1; transform: translateY(0); }
            }

            .signup-page .tagline {
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
      
      <div className="signup-container">
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
          <div className="signup-form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Join us and start your journey today</p>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form id="signupForm" onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="full_name" 
                  placeholder="Enter your full name" 
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="phone-country-row">
                <div className="country-field">
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select 
                      id="country" 
                      name="country" 
                      required
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">-- Select --</option>
                      <option value="malaysia">Malaysia</option>
                      <option value="thailand">Thailand</option>
                      <option value="singapore">Singapore</option>
                      <option value="vietnam">Vietnam</option>
                      <option value="indonesia">Indonesia</option>
                      <option value="india">India</option>
                      <option value="china">China</option>
                      <option value="japan">Japan</option>
                      <option value="south_korea">South Korea</option>
                      <option value="philippines">Philippines</option>
                      <option value="united_states">United States</option>
                      <option value="united_kingdom">United Kingdom</option>
                      <option value="australia">Australia</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="phone-field">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      placeholder={formData.country ? "Enter phone number" : "Select country first"} 
                      disabled={!formData.country} 
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="password-row">
                <div className="password-field">
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        id="password" 
                        name="password" 
                        placeholder="Create a password" 
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        ref={eyeBtnRef}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {showPassword ? (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" style={{transform: pupilTransform}} />
                            </>
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="password-field">
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-wrapper">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        id="confirmPassword" 
                        name="password_confirmation" 
                        placeholder="Confirm your password" 
                        required
                        value={formData.password_confirmation}
                        onChange={handleChange}
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        ref={eyeBtnConfirmRef}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {showConfirmPassword ? (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" style={{transform: confirmPupilTransform}} />
                            </>
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="terms-checkbox">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms_accepted" 
                  required
                  checked={formData.terms_accepted}
                  onChange={handleChange}
                />
                <label htmlFor="terms">I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a></label>
              </div>

              <button type="submit" className={`signup-button ${loading ? 'loading' : ''}`} disabled={loading}>
                <span className="spinner"></span>
                <span className="button-text">{loading ? 'Signing Up...' : 'Sign Up'}</span>
              </button>

              <div className="login-link">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
