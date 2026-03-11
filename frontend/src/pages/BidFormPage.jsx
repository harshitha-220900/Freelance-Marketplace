import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const BidFormPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({ proposal_text:'', bid_amount:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => setJob(r.data)).catch(console.error);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/bids', {
        job_id: parseInt(id),
        proposal_text: formData.proposal_text,
        bid_amount: parseFloat(formData.bid_amount),
      });
      navigate(`/jobs/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit proposal. Please try again.');
    } finally { setLoading(false); }
  };

  if (!job) return <div className="loading-page"><div className="spinner" /><p className="loading-text">Loading project details...</p></div>;

  return (
    <div>
      <div className="page-banner">
        <div className="container">
          <Link to={`/jobs/${id}`} className="back-link" style={{ color:'rgba(255,255,255,0.6)', marginBottom:'1rem', display:'inline-flex' }}>← Back to Project</Link>
          <div className="section-tag" style={{ marginBottom:'0.75rem' }}>💼 Submit Your Proposal</div>
          <h1>Bid on: {job.title}</h1>
          <p>Client Budget: <strong style={{ color:'var(--accent)' }}>${job.budget}</strong></p>
        </div>
      </div>

      <div className="page-wrapper container" style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'2rem', alignItems:'start' }}>
        <div className="card" style={{ padding:'2.5rem' }}>
          {error && <div className="form-error">⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">💡 Your Proposal *</label>
              <textarea
                className="form-input"
                rows={8}
                value={formData.proposal_text}
                onChange={e => setFormData(p => ({ ...p, proposal_text: e.target.value }))}
                placeholder="Tell the client why you're perfect for this project:
• Your relevant experience
• Your approach to this project  
• How you'll meet their requirements
• Your timeline and process"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">💰 Your Bid Amount (USD) *</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)', fontWeight:700, fontSize:'1.1rem' }}>$</span>
                <input
                  type="number"
                  className="form-input"
                  value={formData.bid_amount}
                  onChange={e => setFormData(p => ({ ...p, bid_amount: e.target.value }))}
                  placeholder="Enter your bid"
                  min={1}
                  step="0.01"
                  style={{ paddingLeft:'2rem', fontSize:'1.1rem', fontWeight:700 }}
                  required
                />
              </div>
              <p style={{ color:'var(--text-dim)', fontSize:'0.78rem', marginTop:'0.4rem' }}>
                Client budget: ${job.budget} · Set a competitive but fair price
              </p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={loading}>
                {loading ? '⏳ Submitting...' : '🚀 Submit Proposal'}
              </button>
            </div>
          </form>
        </div>

        {/* Project summary sidebar */}
        <div style={{ position:'sticky', top:90 }}>
          <div className="card">
            <h3 style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'1.25rem' }}>📋 Project Summary</h3>
            <div className="info-row"><span className="info-label">Title</span><span className="info-value" style={{ fontWeight:700 }}>{job.title}</span></div>
            <div className="info-row"><span className="info-label">Budget</span><span className="info-value" style={{ fontWeight:900, color:'var(--accent)', fontSize:'1.25rem' }}>${job.budget}</span></div>
            <div className="info-row"><span className="info-label">Deadline</span><span className="info-value">{new Date(job.deadline).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}</span></div>

            <hr className="divider" />

            <p style={{ color:'var(--text-dim)', fontSize:'0.825rem', lineHeight:1.7 }}>{job.description?.slice(0,200)}{job.description?.length > 200 ? '...' : ''}</p>
          </div>

          <div className="card" style={{ marginTop:'1rem', background:'rgba(20,184,166,0.05)', border:'1px solid rgba(20,184,166,0.2)' }}>
            <h4 style={{ fontSize:'0.825rem', color:'var(--secondary)', marginBottom:'0.75rem' }}>✅ Pro Tips</h4>
            <ul style={{ color:'var(--text-muted)', fontSize:'0.78rem', lineHeight:1.9, paddingLeft:'1rem' }}>
              <li>Personalize your proposal</li>
              <li>Show relevant experience</li>
              <li>Be realistic with your bid</li>
              <li>Respond quickly to messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidFormPage;
