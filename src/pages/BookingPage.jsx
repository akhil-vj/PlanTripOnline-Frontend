import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination, country, image, price, rating } = location.state || {};

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    telephone: '',
    countryCode: '+91',
    email: '',
    whatsapp: '',
    whatsappCode: '+91',
    date: '',
    adults: '2',
    children: '0',
    pickUp: '',
    customPickup: '',
    dropPoint: '',
    customDrop: '',
    promoCode: '',
    specialRequests: '',
    nationality: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  
  // Checkout flow state: 'form' | 'payment' | 'success'
  const [currentStep, setCurrentStep] = useState('form');
  const [selectedGateway, setSelectedGateway] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardName: '',
    expiry: '12/28',
    cvv: '•••'
  });
  const [upiId, setUpiId] = useState('');

  const baseRatePerAdult = 120;
  const baseRatePerChild = 70;

  const calculations = useMemo(() => {
    const adultCount = parseInt(form.adults, 10) || 0;
    const childCount = parseInt(form.children, 10) || 0;
    const subtotal = (adultCount * baseRatePerAdult) + (childCount * baseRatePerChild);
    const discount = promoApplied ? promoDiscount : 0;
    const taxes = Math.round((subtotal - discount) * 0.05); // 5% service & tax
    const total = Math.max(0, subtotal - discount + taxes);
    return { adultCount, childCount, subtotal, discount, taxes, total };
  }, [form.adults, form.children, promoApplied, promoDiscount]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyPromo = () => {
    if (!form.promoCode.trim()) return;
    if (form.promoCode.toUpperCase() === 'PLANTRIP10' || form.promoCode.toUpperCase() === 'WELCOME') {
      setPromoDiscount(25);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "WELCOME"');
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'offline') {
      // Offline goes straight to confirmed booking
      setCurrentStep('success');
    } else {
      // Online directs to the interactive payment gateway step
      setCurrentStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#0b1329',
      color: '#1e293b',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Helmet>
        <title>Reserve {destination || 'Your Trip'} – PlantripOnline</title>
      </Helmet>

      {/* Top Banner Navigation */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              cursor: 'pointer',
              color: '#f8fafc',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 10,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            ← Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
              PlanTrip<span style={{ color: '#ff9500' }}>Online</span>
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
              Checkout for <strong style={{ color: '#f1f5f9' }}>{destination || 'Destination Tour'}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontSize: '0.82rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
            256-Bit SSL Secured
          </div>
        </div>
      </header>

      {/* Step Indicators */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', padding: '14px 0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: currentStep === 'form' ? '#ff9500' : '#34d399', fontSize: '0.88rem', fontWeight: 700 }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: currentStep === 'form' ? '#ff9500' : '#10b981',
              color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', fontWeight: 800
            }}>
              {currentStep === 'form' ? '1' : '✓'}
            </span>
            Traveller Details
          </div>

          <span style={{ width: 36, height: 2, background: currentStep !== 'form' ? '#10b981' : 'rgba(255, 255, 255, 0.15)' }}></span>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            color: currentStep === 'payment' ? '#ff9500' : (currentStep === 'success' ? '#34d399' : '#64748b'),
            fontSize: '0.88rem', fontWeight: currentStep === 'payment' ? 700 : 500
          }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: currentStep === 'payment' ? '#ff9500' : (currentStep === 'success' ? '#10b981' : '#1e293b'),
              color: currentStep === 'form' ? '#64748b' : '#ffffff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', fontWeight: 800
            }}>
              {currentStep === 'success' ? '✓' : '2'}
            </span>
            Payment Gateway
          </div>

          <span style={{ width: 36, height: 2, background: currentStep === 'success' ? '#10b981' : 'rgba(255, 255, 255, 0.15)' }}></span>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            color: currentStep === 'success' ? '#ff9500' : '#64748b',
            fontSize: '0.88rem', fontWeight: currentStep === 'success' ? 700 : 500
          }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              background: currentStep === 'success' ? '#ff9500' : '#1e293b',
              color: currentStep === 'success' ? '#ffffff' : '#64748b',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', fontWeight: 800
            }}>
              3
            </span>
            Confirmed
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: 1180, width: '100%', margin: '0 auto', padding: '32px 24px 32px', flex: 1 }}>
        {currentStep === 'success' && (
          <div style={{
            background: 'white',
            borderRadius: 24,
            padding: '60px 40px',
            textAlign: 'center',
            maxWidth: 680,
            margin: '0 auto',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', fontSize: '2.5rem', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
            }}>✓</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
              {paymentMethod === 'online' ? 'Payment Successful & Confirmed!' : 'Booking Reserved Successfully!'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 28px' }}>
              {paymentMethod === 'online' ? (
                <>Thank you, <strong>{form.firstName} {form.lastName}</strong>! Your payment of <strong>${calculations.total} USD</strong> has been approved. Your e-tickets and tax invoice have been dispatched to <strong>{form.email}</strong>.</>
              ) : (
                <>Thank you, <strong>{form.firstName} {form.lastName}</strong>! Your offline booking for <strong>{destination}</strong> is registered. Our concierge team will connect with you via WhatsApp/Call at <strong>{form.countryCode} {form.telephone}</strong> to arrange your arrival handover.</>
              )}
            </p>
            <div style={{ background: '#f8fafc', borderRadius: 14, padding: '20px 24px', textAlign: 'left', maxWidth: 460, margin: '0 auto 32px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem', color: '#64748b' }}>
                <span>Booking Reference:</span>
                <strong style={{ color: '#0f172a' }}>PTO-{Math.floor(100000 + Math.random() * 900000)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem', color: '#64748b' }}>
                <span>Payment Mode:</span>
                <strong style={{ color: paymentMethod === 'online' ? '#16a34a' : '#ea580c' }}>
                  {paymentMethod === 'online' ? 'Paid Online (Verified)' : 'Pay upon Departure'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem', color: '#64748b' }}>
                <span>Travel Date:</span>
                <strong style={{ color: '#0f172a' }}>{form.date || 'To be confirmed'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                <span>Total Amount:</span>
                <strong style={{ color: '#2563eb', fontSize: '1.1rem' }}>${calculations.total} USD</strong>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '16px 36px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
              }}
            >
              Return to Homepage
            </button>
          </div>
        )}

        {/* ── STEP 2: PAYMENT GATEWAY SCREEN (ONLINE ONLY) ── */}
        {currentStep === 'payment' && (
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{
              background: 'white',
              borderRadius: 24,
              padding: '36px 40px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.2)',
              border: '1px solid #e2e8f0',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('form')}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: 0 }}
                  >
                    ← Edit Traveler Details
                  </button>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Select Payment Gateway
                  </h1>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
                    Complete your transaction securely. Encrypted with bank-grade 256-bit security.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Payable</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>${calculations.total} <span style={{ fontSize: '1rem', color: '#64748b' }}>USD</span></div>
                </div>
              </div>

              {/* Gateway Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
                {[
                  { id: 'card', name: 'Credit / Debit Card', icon: '💳', sub: 'Visa, Mastercard, Amex' },
                  { id: 'upi', name: 'UPI / QR', icon: '📱', sub: 'GPay, PhonePe, Paytm' },
                  { id: 'netbanking', name: 'Net Banking', icon: '🏦', sub: 'All Indian & Global Banks' },
                  { id: 'wallet', name: 'Digital Wallets', icon: '👛', sub: 'PayPal, Apple Pay' },
                ].map(gw => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setSelectedGateway(gw.id)}
                    style={{
                      background: selectedGateway === gw.id ? '#f0f7ff' : '#f8fafc',
                      border: selectedGateway === gw.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: 14,
                      padding: '16px 14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{gw.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedGateway === gw.id ? '#1e40af' : '#1e293b', marginBottom: 2 }}>
                      {gw.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{gw.sub}</div>
                  </button>
                ))}
              </div>

              {/* Gateway Content Area */}
              <div style={{ background: '#f8fafc', borderRadius: 18, padding: '28px', border: '1px solid #e2e8f0', marginBottom: 28 }}>
                {selectedGateway === 'card' && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 18 }}>Enter Card Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={labelStyle}>Card Number</label>
                        <input
                          placeholder="4242 •••• •••• 4242"
                          defaultValue="4111 2222 3333 4242"
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14 }}>
                        <div>
                          <label style={labelStyle}>Cardholder Name</label>
                          <input
                            placeholder="Name on card"
                            defaultValue={`${form.firstName} ${form.lastName}`.trim() || 'John Doe'}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Expiry (MM/YY)</label>
                          <input
                            placeholder="MM/YY"
                            defaultValue="08/29"
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="•••"
                            defaultValue="789"
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedGateway === 'upi' && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Pay via UPI ID or QR Code</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'center' }}>
                      <div>
                        <label style={labelStyle}>Enter UPI VPA ID</label>
                        <input
                          placeholder="yourname@okhdfcbank"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          style={{ ...inputStyle, marginBottom: 10 }}
                        />
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                          Accepts Google Pay, PhonePe, Paytm, and all BHIM UPI handles.
                        </p>
                      </div>
                      <div style={{ textAlign: 'center', background: 'white', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 4 }}>📷</div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>Scan QR Code</span>
                        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>Instant authorization</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedGateway === 'netbanking' && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Popular Banks</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Maybank', 'Bangkok Bank'].map(bank => (
                        <button
                          key={bank}
                          type="button"
                          style={{
                            padding: '12px 14px', borderRadius: 10, border: '1px solid #cbd5e1',
                            background: 'white', fontWeight: 600, fontSize: '0.85rem', color: '#1e293b',
                            cursor: 'pointer', textAlign: 'center'
                          }}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedGateway === 'wallet' && (
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Choose Digital Wallet</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      {['PayPal (Global)', 'Apple Pay', 'Google Pay Wallet', 'Amazon Pay'].map(w => (
                        <div key={w} style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <input type="radio" name="walletChoice" defaultChecked={w.includes('PayPal')} style={{ accentColor: '#2563eb' }} />
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontSize: '0.86rem', fontWeight: 600 }}>
                  <span>🛡️</span> Zero cancellation fee & 100% money-back escrow
                </div>

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessingPayment}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 36px',
                    borderRadius: 12,
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    cursor: isProcessingPayment ? 'wait' : 'pointer',
                    boxShadow: '0 6px 20px rgba(16,185,129,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s',
                    opacity: isProcessingPayment ? 0.75 : 1
                  }}
                >
                  {isProcessingPayment ? (
                    <>Processing Transaction...</>
                  ) : (
                    <>Pay ${calculations.total} USD Securely ➔</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: TRAVELER & TRIP BOOKING FORM ── */}
        {currentStep === 'form' && (
          <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 32, alignItems: 'start' }}>
            {/* Left Column: Form Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Card 1: Primary Traveler */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={{ ...iconBadgeStyle, background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#2563eb' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: 6 }}>Step 1 of 3</span>
                      <h2 style={cardTitleStyle}>Lead Traveler Information</h2>
                    </div>
                    <p style={cardSubStyle}>Enter contact details for booking confirmation & digital vouchers</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={labelStyle}>First Name <R /></label>
                    <input
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name <R /></label>
                    <input
                      name="lastName"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Sharma"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Email Address (For Confirmation & E-Tickets) <R /></label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={labelStyle}>Primary Contact Phone <R /></label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <select
                        name="countryCode"
                        value={form.countryCode}
                        onChange={handleChange}
                        style={{ ...inputStyle, width: 92, padding: '12px 6px', flexShrink: 0, fontWeight: 600 }}
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+60">🇲🇾 +60</option>
                        <option value="+66">🇹🇭 +66</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                      </select>
                      <input
                        name="telephone"
                        required
                        value={form.telephone}
                        onChange={handleChange}
                        placeholder="Mobile number"
                        style={{ ...inputStyle, flex: 1 }}
                        onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>WhatsApp Number (Tour Coordination) <R /></label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <select
                        name="whatsappCode"
                        value={form.whatsappCode}
                        onChange={handleChange}
                        style={{ ...inputStyle, width: 92, padding: '12px 6px', flexShrink: 0, fontWeight: 600 }}
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+60">🇲🇾 +60</option>
                        <option value="+66">🇹🇭 +66</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                      </select>
                      <input
                        name="whatsapp"
                        required
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="WhatsApp number"
                        style={{ ...inputStyle, flex: 1 }}
                        onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Country / Nationality <R /></label>
                  <select
                    name="nationality"
                    value={form.nationality}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option>India</option>
                    <option>Malaysia</option>
                    <option>Thailand</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                    <option>United Arab Emirates</option>
                    <option>Australia</option>
                    <option>Singapore</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Card 2: Schedule & Pax */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={{ ...iconBadgeStyle, background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', color: '#ea580c' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#ea580c', background: '#fff7ed', padding: '2px 8px', borderRadius: 6 }}>Step 2 of 3</span>
                      <h2 style={cardTitleStyle}>Date & Participants</h2>
                    </div>
                    <p style={cardSubStyle}>Choose your travel date, guest count, and logistics</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Travel Date <R /></label>
                  <input
                    name="date"
                    type="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                    style={{ ...inputStyle, fontWeight: 600 }}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                {/* Counter Steppers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
                  <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Adults</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Age 12+ (${baseRatePerAdult}/person)</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, adults: String(Math.max(1, (parseInt(prev.adults, 10) || 1) - 1)) }))}
                          style={counterBtnStyle}
                        >−</button>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, minWidth: 24, textAlign: 'center', color: '#0f172a' }}>{form.adults}</span>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, adults: String(Math.min(20, (parseInt(prev.adults, 10) || 1) + 1)) }))}
                          style={counterBtnStyle}
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Children</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Age 3–11 (${baseRatePerChild}/person)</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, children: String(Math.max(0, (parseInt(prev.children, 10) || 0) - 1)) }))}
                          style={counterBtnStyle}
                        >−</button>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, minWidth: 24, textAlign: 'center', color: '#0f172a' }}>{form.children}</span>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, children: String(Math.min(10, (parseInt(prev.children, 10) || 0) + 1)) }))}
                          style={counterBtnStyle}
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pickup and Drop Point */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Pick-Up Location</label>
                    <select name="pickUp" value={form.pickUp} onChange={handleChange} style={inputStyle}>
                      <option value="">Select pickup point</option>
                      <option value="hotel">My Hotel (City Center)</option>
                      <option value="airport">International Airport (Arrivals)</option>
                      <option value="train">Central Train Station</option>
                      <option value="custom">Custom Address</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Drop-Off Location</label>
                    <select name="dropPoint" value={form.dropPoint} onChange={handleChange} style={inputStyle}>
                      <option value="">Select drop-off point</option>
                      <option value="hotel">Return to My Hotel</option>
                      <option value="airport">International Airport (Departures)</option>
                      <option value="train">Central Train Station</option>
                      <option value="custom">Custom Address</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Special Requests & Preferences (Optional)</label>
                  <textarea
                    name="specialRequests"
                    rows={3}
                    value={form.specialRequests}
                    onChange={handleChange}
                    placeholder="Dietary requirements (veg, halal), infant car seats, guide language preference..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                  ></textarea>
                </div>
              </div>

              {/* Card 3: Payment Preference */}
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={{ ...iconBadgeStyle, background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', color: '#16a34a' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 6 }}>Step 3 of 3</span>
                      <h2 style={cardTitleStyle}>Payment Preference</h2>
                    </div>
                    <p style={cardSubStyle}>Choose how you want to confirm and pay for this reservation</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <label
                    onClick={() => setPaymentMethod('online')}
                    style={{
                      border: paymentMethod === 'online' ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                      background: paymentMethod === 'online' ? '#f0f7ff' : '#ffffff',
                      borderRadius: 14,
                      padding: '18px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#0f172a' }}>⚡ Instant Online Payment</span>
                      <input
                        type="radio"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        style={{ accentColor: '#2563eb' }}
                      />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                      Credit/Debit Card, UPI, or NetBanking. Instant booking confirmation & e-tickets.
                    </p>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('offline')}
                    style={{
                      border: paymentMethod === 'offline' ? '2px solid #ff9500' : '1.5px solid #e2e8f0',
                      background: paymentMethod === 'offline' ? '#fffaf0' : '#ffffff',
                      borderRadius: 14,
                      padding: '18px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#0f172a' }}>🤝 Pay Offline / Concierge</span>
                      <input
                        type="radio"
                        checked={paymentMethod === 'offline'}
                        onChange={() => setPaymentMethod('offline')}
                        style={{ accentColor: '#ff9500' }}
                      />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                      Reserve now with zero advance. Pay upon departure via cash or direct transfer.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <div style={{
              position: 'sticky',
              top: '84px',
              alignSelf: 'start',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              
              {/* Trip Overview Box */}
              <div style={{
                background: 'white',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {image && (
                  <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                    <img src={image} alt={destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)'
                    }}></div>
                    <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20, color: 'white' }}>
                      <span style={{
                        background: '#ff9500', color: 'white', fontSize: '0.72rem',
                        fontWeight: 800, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase'
                      }}>
                        Verified Experience
                      </span>
                      <h3 style={{ margin: '6px 0 0', fontSize: '1.25rem', fontWeight: 800, textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                        {destination || 'Signature Tour'}
                      </h3>
                      {country && <p style={{ margin: '2px 0 0', fontSize: '0.84rem', opacity: 0.9 }}>📍 {country}</p>}
                    </div>
                  </div>
                )}

                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Customer Rating</span>
                    <span style={{ background: '#fef3c7', color: '#b45309', fontWeight: 700, fontSize: '0.85rem', padding: '4px 10px', borderRadius: 8 }}>
                      ★ {rating || '4.9'} (Top Rated)
                    </span>
                  </div>

                  {/* Promo Input */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        name="promoCode"
                        value={form.promoCode}
                        onChange={handleChange}
                        placeholder="Promo Code (e.g. WELCOME)"
                        style={{ ...inputStyle, padding: '10px 12px', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        style={{
                          background: '#0f172a',
                          color: 'white',
                          border: 'none',
                          padding: '0 18px',
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p style={{ margin: '6px 0 0', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>
                        ✓ $25 discount voucher applied!
                      </p>
                    )}
                    {promoError && (
                      <p style={{ margin: '6px 0 0', color: '#dc2626', fontSize: '0.8rem' }}>
                        {promoError}
                      </p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                      <span>Adults ({calculations.adultCount} × ${baseRatePerAdult})</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>${calculations.adultCount * baseRatePerAdult}</span>
                    </div>

                    {calculations.childCount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                        <span>Children ({calculations.childCount} × ${baseRatePerChild})</span>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>${calculations.childCount * baseRatePerChild}</span>
                      </div>
                    )}

                    {promoApplied && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#16a34a', fontWeight: 600 }}>
                        <span>Promotional Discount</span>
                        <span>-${promoDiscount}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                      <span>Taxes & Processing (5%)</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>${calculations.taxes}</span>
                    </div>

                    <div style={{
                      borderTop: '2px solid #f1f5f9',
                      paddingTop: 16,
                      marginTop: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline'
                    }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total Price</span>
                        <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>All inclusions covered</span>
                      </div>
                      <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
                        ${calculations.total} <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>USD</span>
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '16px 0',
                      borderRadius: 12,
                      border: 'none',
                      background: paymentMethod === 'online'
                        ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                        : 'linear-gradient(135deg, #ff9500, #ea580c)',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      boxShadow: paymentMethod === 'online'
                        ? '0 6px 20px rgba(37,99,235,0.35)'
                        : '0 6px 20px rgba(255,149,0,0.35)',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {paymentMethod === 'online' ? 'Proceed to Secure Payment ➔' : 'Confirm Offline Booking ➔'}
                  </button>
                </div>
              </div>

            </div>
          </form>
        )}
      </main>
    </div>
  );
}

function R() {
  return <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>;
}

const cardStyle = {
  background: 'white',
  borderRadius: 20,
  padding: '32px 36px',
  boxShadow: '0 4px 25px rgba(0, 0, 0, 0.05)',
  border: '1px solid #e2e8f0',
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  marginBottom: 24,
  paddingBottom: 16,
  borderBottom: '1px solid #f1f5f9',
};

const iconBadgeStyle = {
  width: 44,
  height: 44,
  borderRadius: 12,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  flexShrink: 0,
};

const cardTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: 800,
  color: '#0f172a',
  margin: 0,
  letterSpacing: '-0.3px',
};

const cardSubStyle = {
  fontSize: '0.84rem',
  color: '#64748b',
  margin: '4px 0 0',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.84rem',
  fontWeight: 600,
  color: '#334155',
  marginBottom: 8,
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: '1.5px solid #cbd5e1',
  fontSize: '0.92rem',
  color: '#0f172a',
  background: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const counterBtnStyle = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#0f172a',
  fontSize: '1.2rem',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

