import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name:'', email:'', password:'', role:'freelancer', bio:'', skills:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : Array.isArray(detail) ? detail[0].msg : 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="auth-page" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
            <div style={{ width:40, height:40, background:'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:'0 4px 20px rgba(99,102,241,0.4)' }}>⚡</div>
            <span style={{ fontSize:'1.5rem', fontWeight:900, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Freelance<span style={{ background:'linear-gradient(90deg,#818cf8,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Hub</span></span>
          </div>
          <h2 style={{ fontSize:'1.6rem', marginBottom:'0.35rem' }}>Create your account 🚀</h2>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>Join 50,000+ professionals on FreelanceHub</p>
        </div>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button type="button" className={`role-btn ${formData.role === 'freelancer' ? 'active' : ''}`} onClick={() => setFormData(p => ({...p, role:'freelancer'}))}>
            🧑‍💻 I'm a Freelancer
          </button>
          <button type="button" className={`role-btn ${formData.role === 'client' ? 'active' : ''}`} onClick={() => setFormData(p => ({...p, role:'client'}))}>
            🏢 I'm a Client
          </button>
        </div>

        {error && <div className="form-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="John Doe" value={formData.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="john@example.com" value={formData.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min. 8 characters" value={formData.password} onChange={set('password')} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Short Bio <span style={{color:'var(--text-dim)',fontWeight:400}}>(optional)</span></label>
            <textarea className="form-input" placeholder="Tell clients / freelancers about yourself..." value={formData.bio} onChange={set('bio')} rows={2} style={{ minHeight:70 }} />
          </div>
          {formData.role === 'freelancer' && (
            <div className="form-group">
              <label className="form-label">Skills <span style={{color:'var(--text-dim)',fontWeight:400}}>(comma separated)</span></label>
              <input type="text" className="form-input" placeholder="React, Node.js, Python, UI/UX..." value={formData.skills} onChange={set('skills')} />
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-full" style={{ padding:'0.9rem', marginTop:'0.5rem' }} disabled={loading}>
            {loading ? '⏳ Creating account...' : `🚀 Create ${formData.role === 'client' ? 'Client' : 'Freelancer'} Account`}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <p style={{ textAlign:'center', fontSize:'0.875rem', color:'var(--text-muted)' }}>
          Already a member?{' '}
          <Link to="/login" style={{ color:'var(--primary-light)', fontWeight:700 }}>Sign in →</Link>
        </p>

        <p style={{ textAlign:'center', fontSize:'0.75rem', color:'var(--text-dim)', marginTop:'1rem' }}>
          By creating an account, you agree to our{' '}
          <a href="#" style={{ color:'var(--text-muted)' }}>Terms of Service</a> and{' '}
          <a href="#" style={{ color:'var(--text-muted)' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
