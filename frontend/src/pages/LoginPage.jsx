import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : Array.isArray(detail) ? detail[0].msg : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
            <div style={{ width:40, height:40, background:'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:'0 4px 20px rgba(99,102,241,0.4)' }}>⚡</div>
            <span style={{ fontSize:'1.5rem', fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Freelance<span style={{ background:'linear-gradient(90deg,#818cf8,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Hub</span></span>
          </div>
          <h2 style={{ fontSize:'1.6rem', marginBottom:'0.35rem' }}>Welcome back 👋</h2>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>Sign in to your account to continue</p>
        </div>

        {error && <div className="form-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <label className="form-label" style={{ margin:0 }}>Password</label>
              <a href="#" style={{ fontSize:'0.78rem', color:'var(--primary-light)', fontWeight:600 }}>Forgot password?</a>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop:'0.5rem', padding:'0.9rem' }} disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <p style={{ textAlign:'center', fontSize:'0.875rem', color:'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color:'var(--primary-light)', fontWeight:700 }}>Create one free →</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
