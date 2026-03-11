import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const SubmitWorkPage = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post(`/projects/${id}/submit-work`, { work_notes: notes });
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-banner">
        <div className="container">
          <Link to={`/projects/${id}`} className="back-link" style={{ color:'rgba(255,255,255,0.6)', marginBottom:'1rem', display:'inline-flex' }}>← Back to Project</Link>
          <div className="section-tag" style={{ marginBottom:'0.75rem' }}>📤 Work Delivery</div>
          <h1>Submit Your Work</h1>
          <p>Provide a clear delivery note so the client can review your work</p>
        </div>
      </div>

      <div className="page-wrapper container" style={{ maxWidth:720 }}>
        <div className="card" style={{ padding:'2.5rem' }}>
          {error && <div className="form-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Work Delivery Notes *</label>
              <textarea
                className="form-input"
                rows={10}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Provide a comprehensive delivery note:

📁 Where to find the work (GitHub repo, Google Drive, deployed URL)
🔧 How to install/run (if applicable)
📋 What has been completed
✅ How requirements were met
📝 Any known issues or next steps"
                required
              />
              <p style={{ color:'var(--text-dim)', fontSize:'0.78rem', marginTop:'0.4rem' }}>
                The client will use this to review and approve your work. Be thorough!
              </p>
            </div>

            <div className="card" style={{ padding:'1.25rem', background:'rgba(245,158,11,0.05)', border:'1px solid rgba(245,158,11,0.2)', marginBottom:'1.5rem' }}>
              <p style={{ color:'#fcd34d', fontSize:'0.825rem', margin:0 }}>
                ⚠️ <strong>Important:</strong> Once submitted, the client will review your work and either approve it or request changes. Make sure all deliverables are accessible before submitting.
              </p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={loading}>
                {loading ? '⏳ Submitting...' : '📤 Submit Delivery'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitWorkPage;
