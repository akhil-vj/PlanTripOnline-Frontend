import { useState } from 'react';
import { adminPut } from '../../config/api';

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: '28px 32px',
  boxShadow: '0 2px 12px rgba(0,0,0,.06)',
  marginBottom: 24,
};

const labelStyle = {
  display: 'block',
  fontSize: '.72rem',
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '.5px',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 10,
  fontSize: '.88rem',
  outline: 'none',
  fontFamily: 'inherit',
  color: '#0f172a',
  boxSizing: 'border-box',
};

const disabledInputStyle = {
  ...inputStyle,
  background: '#f8fafc',
  color: '#94a3b8',
  cursor: 'not-allowed',
};

const btnStyle = (disabled) => ({
  display: 'inline-block',
  padding: '11px 28px',
  background: disabled ? '#e2e8f0' : 'linear-gradient(135deg,#f97316,#fb923c)',
  color: disabled ? '#94a3b8' : '#fff',
  border: 'none',
  borderRadius: 12,
  fontWeight: 800,
  fontSize: '.88rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'inherit',
  boxShadow: disabled ? 'none' : '0 4px 14px rgba(249,115,22,.3)',
  marginTop: 8,
});

function StatusMsg({ msg }) {
  if (!msg) return null;
  const ok = msg.startsWith('✓');
  return (
    <div style={{
      marginTop: 10,
      padding: '9px 14px',
      borderRadius: 10,
      fontSize: '.83rem',
      fontWeight: 600,
      background: ok ? '#dcfce7' : '#fee2e2',
      color: ok ? '#16a34a' : '#dc2626',
      border: `1px solid ${ok ? '#bbf7d0' : '#fca5a5'}`,
    }}>
      {msg}
    </div>
  );
}

/* ── Profile Card ─────────────────────────────────────────────────────────── */
function ProfileCard() {
  const [name,    setName]    = useState(localStorage.getItem('userName')  || '');
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const email = localStorage.getItem('userEmail') || '';

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) { setMsg('⚠️ Name cannot be empty'); return; }
    setSaving(true); setMsg('');
    try {
      await adminPut('/api/admin/profile', { name: name.trim() });
      localStorage.setItem('userName', name.trim());
      setMsg('✓ Profile updated successfully');
    } catch (err) {
      setMsg(`⚠️ ${err.message || 'Failed to update profile'}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>
        👤 Profile Information
      </h2>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Display Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              value={email}
              disabled
              style={disabledInputStyle}
            />
            <span style={{ fontSize: '.72rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>
              Contact your system admin to change email
            </span>
          </div>
        </div>
        <button type="submit" disabled={saving} style={btnStyle(saving)}>
          {saving ? 'Saving…' : '💾 Save Profile'}
        </button>
        <StatusMsg msg={msg} />
      </form>
    </div>
  );
}

/* ── Password Card ─────────────────────────────────────────────────────────── */
function PasswordCard() {
  const [current,  setCurrent]  = useState('');
  const [newPw,    setNewPw]    = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');

  async function handleSave(e) {
    e.preventDefault();
    if (!current || !newPw || !confirm) { setMsg('⚠️ All fields are required'); return; }
    if (newPw.length < 8) { setMsg('⚠️ New password must be at least 8 characters'); return; }
    if (newPw !== confirm)  { setMsg('⚠️ Passwords do not match'); return; }
    setSaving(true); setMsg('');
    try {
      await adminPut('/api/admin/profile/password', {
        current_password: current,
        password: newPw,
        password_confirmation: confirm,
      });
      setMsg('✓ Password changed successfully');
      setCurrent(''); setNewPw(''); setConfirm('');
    } catch (err) {
      setMsg(`⚠️ ${err.message || 'Failed to change password'}`);
    } finally {
      setSaving(false);
    }
  }

  const PwField = ({ label, value, onChange, placeholder }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        required
        autoComplete="new-password"
      />
    </div>
  );

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>
        🔒 Change Password
      </h2>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <PwField label="Current Password" value={current} onChange={setCurrent} placeholder="••••••••" />
          <PwField label="New Password" value={newPw} onChange={setNewPw} placeholder="Min 8 characters" />
          <PwField label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
        </div>
        <button type="submit" disabled={saving} style={btnStyle(saving)}>
          {saving ? 'Saving…' : '🔑 Update Password'}
        </button>
        <StatusMsg msg={msg} />
      </form>
    </div>
  );
}

/* ── Main Export ──────────────────────────────────────────────────────────── */
export default function AdminProfileSettings() {
  return (
    <div style={{ maxWidth: 900 }}>
      <ProfileCard />
      <PasswordCard />
    </div>
  );
}

