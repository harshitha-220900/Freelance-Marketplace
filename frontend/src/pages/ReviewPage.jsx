import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ReviewPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/projects').then(res => {
      const found = res.data.find(p => p.project_id === parseInt(id));
      if (found) setProject(found);
    }).catch(console.error);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const revieweeId = user.user_id === project.client_id ? project.freelancer_id : project.client_id;
    try {
      await api.post('/reviews', {
        project_id: parseInt(id),
        reviewee_id: revieweeId,
        rating: parseInt(rating),
        comment: comment,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit review. Please try again.');
    } finally { setLoading(false); }
  };

  const ratingLabels = { 1:'Poor', 2:'Fair', 3:'Good', 4:'Great', 5:'Excellent! ⭐' };

  if (!project) return <div className="loading-page"><div className="spinner" /><p className="loading-text">Loading review page...</p></div>;

  const reviewingWho = user?.user_id === project.client_id ? 'the Freelancer' : 'the Client';

  return (
    <div>
      <div className="page-banner">
        <div className="container">
          <Link to={`/projects/${id}`} className="back-link" style={{ color:'rgba(255,255,255,0.6)', marginBottom:'1rem', display:'inline-flex' }}>← Back to Project</Link>
          <div className="section-tag" style={{ marginBottom:'0.75rem' }}>⭐ Leave a Review</div>
          <h1>Rate Your Experience</h1>
          <p>Share your feedback about working with {reviewingWho}</p>
        </div>
      </div>

      <div className="page-wrapper container" style={{ maxWidth:560 }}>
        <div className="card" style={{ padding:'2.5rem' }}>
          {error && <div className="form-error">⚠️ {error}</div>}

          {/* Star Rating */}
          <div className="form-group" style={{ textAlign:'center' }}>
            <label className="form-label" style={{ display:'block', marginBottom:'1rem', fontSize:'1rem' }}>
              How was your experience?
            </label>
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', marginBottom:'0.75rem' }}>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  className="star"
                  style={{
                    fontSize:'2.5rem',
                    cursor:'pointer',
                    color: star <= (hoverRating || rating) ? 'var(--accent)' : 'var(--text-dim)',
                    transition:'all 0.15s ease',
                    transform: star <= (hoverRating || rating) ? 'scale(1.15)' : 'scale(1)',
                  }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <div style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--accent)' }}>
              {ratingLabels[hoverRating || rating]}
            </div>
          </div>

          <hr className="divider" />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Written Feedback *</label>
              <textarea
                className="form-input"
                rows={5}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Describe the quality of work, communication, professionalism, and anything else that stood out..."
                required
              />
            </div>

            <div className="card" style={{ padding:'1.25rem', background:'rgba(99,102,241,0.05)', border:'1px solid rgba(99,102,241,0.2)', marginBottom:'1.5rem' }}>
              <p style={{ color:'var(--primary-light)', fontSize:'0.825rem', margin:0 }}>
                💡 Reviews help build trust in the FreelanceHub community. Your honest feedback matters!
              </p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={loading}>
                {loading ? '⏳ Submitting...' : `⭐ Submit ${rating}-Star Review`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
