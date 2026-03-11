import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const NewJobPage = () => {
  const [formData, setFormData] = useState({ title:'', description:'', budget:'', deadline:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/jobs', { ...formData, budget: parseFloat(formData.budget) });
      navigate(`/jobs/${res.data.job_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to post job. Please try again.');
    } finally { setLoading(false); }
  };

  const set = (f) => (e) => setFormData(p => ({ ...p, [f]: e.target.value }));

  return (
    <div>
      <div className="page-banner">
        <div className="container">
          <Link to="/dashboard" className="back-link" style={{ color:'rgba(255,255,255,0.6)', marginBottom:'1rem', display:'inline-flex' }}>← Back to Dashboard</Link>
          <div className="section-tag" style={{ marginBottom:'0.75rem' }}>📋 Create New Listing</div>
          <h1>Post a New Project</h1>
          <p>Describe your project clearly to attract the best talent</p>
        </div>
      </div>

      <div className="page-wrapper container" style={{ maxWidth:720 }}>
        <div className="card" style={{ padding:'2.5rem' }}>
          {error && <div className="form-error">⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input type="text" className="form-input" value={formData.title} onChange={set('title')} placeholder="e.g. Build a React e-commerce website" required />
              <p style={{ color:'var(--text-dim)', fontSize:'0.78rem', marginTop:'0.4rem' }}>Be specific — great titles attract more proposals</p>
            </div>

            <div className="form-group">
              <label className="form-label">Project Description *</label>
              <textarea className="form-input" rows={7} value={formData.description} onChange={set('description')} placeholder="Describe the project in detail: requirements, deliverables, tech stack, skills needed..." required />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">💰 Budget (USD) *</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)', fontWeight:700 }}>$</span>
                  <input type="number" className="form-input" value={formData.budget} onChange={set('budget')} placeholder="500" min={1} step="0.01" style={{ paddingLeft:'2rem' }} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">📅 Deadline *</label>
                <input type="date" className="form-input" value={formData.deadline} onChange={set('deadline')} required min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            {/* Tips */}
            <div className="card" style={{ marginTop:'2rem', padding:'1.25rem', background:'rgba(20,184,166,0.05)', border:'1px solid rgba(20,184,166,0.2)' }}>
              <h4 style={{ fontSize:'0.875rem', color:'var(--secondary)', marginBottom:'0.75rem' }}>💡 Tips for a great post</h4>
              <ul style={{ color:'var(--text-muted)', fontSize:'0.825rem', lineHeight:1.8, paddingLeft:'1.25rem' }}>
                <li>Be specific about deliverables and timelines</li>
                <li>Mention the tech stack or tools you prefer</li>
                <li>Set a realistic budget for quality work</li>
                <li>Include any reference links or examples</li>
              </ul>
            </div>

            <div style={{ display:'flex', gap:'1rem', marginTop:'2rem' }}>
              <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={loading}>
                {loading ? '⏳ Posting...' : '🚀 Post Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewJobPage;
