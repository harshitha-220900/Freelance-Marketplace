import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const PaymentPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const projRes = await api.get('/projects');
        const project = projRes.data.find(p => p.project_id === parseInt(id));
        if (project) {
          const jobRes = await api.get(`/jobs/${project.job_id}`);
          setJob(jobRes.data);
        }
      } catch (err) { console.error(err); }
    };
    load();
  }, [id]);

  const handleFundEscrow = async () => {
    if (!job) return;
    setError('');
    setLoading(true);
    try {
      await api.post('/payments', { project_id: parseInt(id), amount: job.budget });
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Payment failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (!job) return <div className="loading-page"><div className="spinner" /><p className="loading-text">Loading payment portal...</p></div>;

  return (
    <div>
      <div className="page-banner">
        <div className="container">
          <Link to={`/projects/${id}`} className="back-link" style={{ color:'rgba(255,255,255,0.6)', marginBottom:'1rem', display:'inline-flex' }}>← Back to Project</Link>
          <div className="section-tag" style={{ marginBottom:'0.75rem' }}>💳 Secure Payment</div>
          <h1>Fund Project Escrow</h1>
          <p>Your payment is held securely until you approve the work</p>
        </div>
      </div>

      <div className="page-wrapper container" style={{ maxWidth:520 }}>
        {/* Payment Card */}
        <div className="payment-card mb-6">
          <div style={{ fontSize:'0.875rem', color:'rgba(255,255,255,0.6)', marginBottom:'0.5rem' }}>Total Amount Due</div>
          <div className="payment-amount">${job.budget}</div>
          <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', marginBottom:'1.5rem' }}>USD · Held securely in escrow</div>

          <div style={{ display:'flex', gap:'2rem', justifyContent:'center', flexWrap:'wrap' }}>
            {[['🔐','Secure Escrow'], ['⚡','Instant'], ['💯','100% Protected']].map(([icon, label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.25rem' }}>{icon}</div>
                <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)', fontWeight:600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding:'2rem' }}>
          {error && <div className="form-error">⚠️ {error}</div>}

          {/* How escrow works */}
          <h3 style={{ fontSize:'1rem', marginBottom:'1rem' }}>How Escrow Works</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
            {[
              ['1', '💳', 'You fund the escrow', 'Funds are safely held by FreelanceHub'],
              ['2', '💼', 'Freelancer works', 'They deliver the project before the deadline'],
              ['3', '✅', 'You approve', 'Only then are funds released to the freelancer'],
            ].map(([num, icon, title, desc]) => (
              <div key={num} className="flex items-start gap-3">
                <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--grad-primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.8rem', flexShrink:0 }}>{num}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{icon} {title}</div>
                  <div style={{ color:'var(--text-dim)', fontSize:'0.8rem' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding:'1rem', background:'rgba(245,158,11,0.05)', border:'1px solid rgba(245,158,11,0.2)', marginBottom:'1.5rem' }}>
            <p style={{ color:'#fcd34d', fontSize:'0.8rem', margin:0 }}>
              ⚠️ <strong>Demo Mode:</strong> This is a simulated payment. No real money is charged.
            </p>
          </div>

          <button onClick={handleFundEscrow} className="btn btn-primary btn-full" style={{ padding:'1rem', fontSize:'1rem' }} disabled={loading}>
            {loading ? '⏳ Processing...' : `💳 Fund Escrow — $${job.budget}`}
          </button>

          <p style={{ textAlign:'center', color:'var(--text-dim)', fontSize:'0.78rem', marginTop:'1rem' }}>
            🔐 Secured by FreelanceHub · Funds released only on your approval
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
