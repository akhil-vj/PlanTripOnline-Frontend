import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function EnquiryPage() {
  const [formData, setFormData] = useState({
    full_name: '', country: '', email: '', phone: '',
    destination: '', travel_type: '', start_date: '', duration: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Enquiry submitted successfully!');
    }, 1500);
  };

  return (
    <div className="enquiry-page">
      <Helmet>
        <title>Travel Enquiry - PlantripOnline</title>
      </Helmet>

      {/* Embedded Styles */}
      <style>{`
        /* Back Button */
        .enquiry-page .back-button {
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

        .enquiry-page .back-button:hover {
            background: rgba(255, 149, 0, 0.9);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 149, 0, 0.3);
        }

        .enquiry-page {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* Homepage Background Integration */
        .enquiry-page .homepage-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, #f5f5f4, #fafaf9);
            z-index: -2;
        }

        .enquiry-page .homepage-background::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover no-repeat;
            z-index: -1;
        }

        .enquiry-page .homepage-background::after {
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

        .enquiry-page .enquiry-container {
            display: flex;
            min-height: 100vh;
            position: relative;
            z-index: 1;
        }

        .enquiry-page .left-section {
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

        .enquiry-page .left-section::before {
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

        .enquiry-page .left-content {
            position: relative;
            z-index: 1;
            text-align: center;
        }

        .enquiry-page .logo {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .enquiry-page .logo .highlight {
            color: #ff9500;
        }

        .enquiry-page .tagline {
            font-size: 1.8rem;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .enquiry-page .subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-bottom: 30px;
        }

        .enquiry-page .feature-list {
            text-align: left;
            max-width: 300px;
            margin: 0 auto;
        }

        .enquiry-page .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
            font-size: 0.95rem;
        }

        .enquiry-page .feature-icon {
            width: 20px;
            height: 20px;
            background: #ff9500;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.8rem;
        }

        .enquiry-page .right-section {
            flex: 1.2;
            background: rgba(44, 62, 80, 0.85);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 40px;
            opacity: 0;
            transform: translateX(100%);
            animation: slideInRight 0.8s ease forwards;
            border-radius: 20px 0 0 20px;
            overflow-y: auto;
            max-height: 100vh;
        }

        @keyframes slideInRight {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .enquiry-page .enquiry-form-container {
            width: 100%;
            max-width: 500px;
            margin-top: 60px;
        }

        .enquiry-page .form-header {
            margin-bottom: 30px;
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

        .enquiry-page .form-header h2 {
            font-size: 2rem;
            margin-bottom: 8px;
        }

        .enquiry-page .form-header p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .enquiry-page .form-section {
            margin-bottom: 30px;
            opacity: 0;
            transform: translateX(30px);
            animation: fadeInLeft 0.6s ease forwards;
        }

        .enquiry-page .form-section:nth-child(2) { animation-delay: 0.6s; }
        .enquiry-page .form-section:nth-child(3) { animation-delay: 0.7s; }
        .enquiry-page .form-section:nth-child(4) { animation-delay: 0.8s; }
        .enquiry-page .form-section:nth-child(5) { animation-delay: 0.9s; }
        .enquiry-page .form-section:nth-child(6) { animation-delay: 1.0s; }

        @keyframes fadeInLeft {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .enquiry-page .section-title {
            color: #ff9500;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .enquiry-page .section-icon {
            width: 22px;
            height: 22px;
            background: linear-gradient(135deg, #ff9500, #e67700);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.8rem;
        }

        .enquiry-page .form-row {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }

        .enquiry-page .form-group {
            flex: 1;
            margin-bottom: 20px;
        }

        .enquiry-page .form-group.full-width {
            width: 100%;
        }

        .enquiry-page .form-group label {
            display: block;
            color: white;
            margin-bottom: 8px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .enquiry-page .form-group input,
        .enquiry-page .form-group select,
        .enquiry-page .form-group textarea {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 1rem;
            color: white;
            transition: all 0.3s ease;
        }

        .enquiry-page .form-group input:focus,
        .enquiry-page .form-group select:focus,
        .enquiry-page .form-group textarea:focus {
            outline: none;
            border-color: #ff9500;
            background: rgba(255, 255, 255, 0.08);
        }

        .enquiry-page .form-group input::placeholder,
        .enquiry-page .form-group textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .enquiry-page .form-group select option {
            background: #2c3e50;
            color: white;
        }

        .enquiry-page .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }

        .enquiry-page .submit-button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #ff9500, #e67700);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 20px;
            opacity: 0;
            animation: fadeIn 0.6s ease forwards 1.1s;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .enquiry-page .submit-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #e67700, #cc6600);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 149, 0, 0.3);
        }

        .enquiry-page .submit-button:disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .enquiry-page .submit-button .spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        .enquiry-page .submit-button.loading .spinner {
            display: inline-block;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
            to { opacity: 1; }
        }

        @media (max-width: 1200px) {
            .enquiry-page .enquiry-container {
                flex-direction: column;
            }

            .enquiry-page .left-section {
                min-height: 35vh;
                animation: slideInTop 0.8s ease forwards;
            }

            @keyframes slideInTop {
                from { opacity: 0; transform: translateY(-100%); }
                to { opacity: 1; transform: translateY(0); }
            }

            .enquiry-page .right-section {
                min-height: 65vh;
                animation: slideInBottom 0.8s ease forwards;
                max-height: none;
                border-radius: 20px 20px 0 0;
            }

            @keyframes slideInBottom {
                from { opacity: 0; transform: translateY(100%); }
                to { opacity: 1; transform: translateY(0); }
            }

            .enquiry-page .tagline {
                font-size: 1.5rem;
            }

            .enquiry-page .enquiry-form-container {
                margin-top: 20px;
            }
        }

        @media (max-width: 768px) {
            .enquiry-page .form-row {
                flex-direction: column;
                gap: 0;
            }

            .enquiry-page .enquiry-form-container {
                padding: 0 10px;
            }
        }
      `}</style>

      {/* Back Button */}
      <Link to="/" className="back-button">
        ← Back to Homepage
      </Link>
      
      {/* Homepage Background */}
      <div className="homepage-background"></div>
      
      <div className="enquiry-container">
        <div className="left-section">
          <div className="left-content">
            <div className="logo">
              Plantrip<span className="highlight">O</span>nline
            </div>
            <div className="tagline">
              Plan Your Perfect Journey
            </div>
            <div className="subtitle">
              Tell us about your dream trip and we'll create the perfect experience for you
            </div>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">✈️</div>
                <span>Customized Itineraries</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏨</div>
                <span>Best Hotel Deals</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🗺️</div>
                <span>Local Expert Guides</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                <span>24/7 Support</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💰</div>
                <span>Best Price Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="enquiry-form-container">
            <div className="form-header">
              <h2>Travel Enquiry</h2>
              <p>Share your travel preferences and we'll craft the perfect Asian adventure for you</p>
            </div>

            <form id="travelEnquiryForm" onSubmit={handleSubmit}>
              
              {/* Personal Information */}
              <div className="form-section">
                <div className="section-title">
                  <div className="section-icon">👤</div>
                  Personal Information
                </div>
                
                <div className="form-row">
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
                    <label htmlFor="country">Country</label>
                    <select 
                      id="country" 
                      name="country" 
                      required
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">Select your country</option>
                      <option value="malaysia">Malaysia</option>
                      <option value="singapore">Singapore</option>
                      <option value="thailand">Thailand</option>
                      <option value="indonesia">Indonesia</option>
                      <option value="vietnam">Vietnam</option>
                      <option value="philippines">Philippines</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="your@email.com" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      placeholder="+60 123 456 789" 
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Travel Preferences */}
              <div className="form-section">
                <div className="section-title">
                  <div className="section-icon">🗺️</div>
                  Travel Preferences
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="destination">Preferred Destination</label>
                    <select 
                      id="destination" 
                      name="destination" 
                      required
                      value={formData.destination}
                      onChange={handleChange}
                    >
                      <option value="">Select destination</option>
                      <option value="malaysia">Malaysia</option>
                      <option value="thailand">Thailand</option>
                      <option value="singapore">Singapore</option>
                      <option value="vietnam">Vietnam</option>
                      <option value="indonesia">Indonesia</option>
                      <option value="multi-destination">Multi-Destination</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="travelType">Travel Type</label>
                    <select 
                      id="travelType" 
                      name="travel_type" 
                      required
                      value={formData.travel_type}
                      onChange={handleChange}
                    >
                      <option value="">Select travel type</option>
                      <option value="leisure">Leisure / Vacation</option>
                      <option value="business">Business</option>
                      <option value="honeymoon">Honeymoon</option>
                      <option value="family">Family Trip</option>
                      <option value="group">Group Travel</option>
                      <option value="solo">Solo Travel</option>
                      <option value="adventure">Adventure</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Preferred Start Date</label>
                    <input 
                      type="date" 
                      id="startDate" 
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <select 
                      id="duration" 
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                    >
                      <option value="">Select duration</option>
                      <option value="1-2-days">1-2 Days</option>
                      <option value="3-4-days">3-4 Days</option>
                      <option value="5-7-days">5-7 Days</option>
                      <option value="1-2-weeks">1-2 Weeks</option>
                      <option value="2-3-weeks">2-3 Weeks</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="form-section">
                <div className="form-group full-width">
                  <label htmlFor="message">Additional Details or Requirements</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    placeholder="Tell us about your interests, preferred hotel style..." 
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className={`submit-button ${loading ? 'loading' : ''}`} disabled={loading}>
                <span className="spinner"></span>
                <span className="button-text">{loading ? 'Submitting...' : 'Send Enquiry'}</span>
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
