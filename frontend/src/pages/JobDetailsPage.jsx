import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const jobRes = await api.get(`/jobs/${id}`);
        setJob(jobRes.data);
        try { const bidsRes = await api.get(`/bids/job/${id}`); setBids(bidsRes.data); } catch {}
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleAcceptBid = async (bidId) => {
    if (!window.confirm('Accept this bid and create a project?')) return;
    try {
      await api.put(`/bids/${bidId}/accept`);
      await api.post('/projects', { job_id: job.job_id });
      navigate('/dashboard');
    } catch (err) { alert(err.response?.data?.detail || 'Error accepting bid'); }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /><p className="loading-text">Loading project...</p></div>;
  if (!job) return <div className="page-wrapper container"><div className="card empty-state"><div className="empty-icon">❌</div><h3>Project not found</h3><Link to="/jobs" className="btn btn-primary mt-4">Browse Projects</Link></div></div>;

  const isClient = user?.role === 'client' && user?.user_id === job.client_id;
  const isFreelancer = user?.role === 'freelancer';
  const hasBid = bids.some(b => b.freelancer_id === user?.user_id);

  return (
    <div>
      {/* Banner */}
      <div className="page-banner">
        <div className="container">
          <Link to="/jobs" className="back-link" style={{ color:'rgba(255,255,255,0.6)', marginBottom:'1rem', display:'inline-flex' }}>← Back to Projects</Link>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={`status-pill ${job.status}`}>{job.status === 'open' ? '🟢' : '🔵'} {job.status.replace('_',' ')}</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)' }}>{job.title}</h1>
          <p style={{ marginTop:'0.5rem' }}>Posted {new Date(job.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
        </div>
      </div>

      <div className="page-wrapper container" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'2rem', alignItems:'start' }}>
        {/* Main */}
        <div>
          <div className="card mb-6">
            <h2 style={{ fontSize:'1.25rem', marginBottom:'1rem' }}>📋 Project Description</h2>
            <div style={{ color:'var(--text-muted)', lineHeight:1.8, whiteSpace:'pre-wrap', fontSize:'0.95rem' }}>{job.description}</div>
          </div>

          {/* Bid CTA for freelancers */}
          {isFreelancer && job.status === 'open' && !hasBid && (
            <div className="card" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))', border:'1px solid rgba(99,102,241,0.3)', textAlign:'center', padding:'2.5rem' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>💼</div>
              <h3 style={{ fontSize:'1.3rem', marginBottom:'0.5rem' }}>Interested in this project?</h3>
              <p style={{ color:'var(--text-muted)', marginBottom:'1.5rem' }}>Submit your proposal and showcase your skills</p>
              <Link to={`/jobs/${job.job_id}/bid`} className="btn btn-primary btn-lg">Submit Proposal →</Link>
            </div>
          )}

          {isFreelancer && hasBid && (
            <div className="card form-success" style={{ textAlign:'center', padding:'1.5rem' }}>
              ✅ You have already submitted a proposal for this project. Check your dashboard for updates.
            </div>
          )}

          {/* Bids section */}
          {(isClient || (bids.length > 0 && user)) && (
            <div className="mt-8">
              <h2 style={{ fontSize:'1.5rem', marginBottom:'1.5rem' }}>
                📩 Proposals <span style={{ color:'var(--text-dim)', fontSize:'1rem', fontWeight:500 }}>({bids.length})</span>
              </h2>
              {bids.length === 0 ? (
                <div className="card empty-state"><div className="empty-icon">📭</div><h3>No proposals yet</h3><p>Check back soon!</p></div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  {bids.map(bid => (
                    <div key={bid.bid_id} className={`card bid-card ${bid.status === 'accepted' ? 'accepted' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div style={{ flex:1 }}>
                          <div className="flex items-center gap-3 mb-2">
                            <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--grad-primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1rem', color:'white' }}>
                              F
                            </div>
                            <div>
                              <div style={{ fontWeight:700 }}>Freelancer #{bid.freelancer_id}</div>
                              <div style={{ fontSize:'0.78rem', color:'var(--text-dim)' }}>{new Date(bid.created_at).toLocaleDateString()}</div>
                            </div>
                            <span className={`badge ${bid.status === 'accepted' ? 'badge-success' : 'badge-gray'} ml-auto`}>{bid.status}</span>
                          </div>
                          <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:1.6 }}>{bid.proposal_text}</p>
                        </div>
                        <div style={{ textAlign:'right', marginLeft:'1.5rem', flexShrink:0 }}>
                          <div style={{ fontSize:'1.8rem', fontWeight:900, background:'var(--grad-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>${bid.bid_amount}</div>
                          {isClient && job.status === 'open' && bid.status !== 'accepted' && (
                            <button onClick={() => handleAcceptBid(bid.bid_id)} className="btn btn-secondary btn-sm" style={{ marginTop:'0.75rem' }}>✅ Accept Bid</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position:'sticky', top:'90px' }}>
          <div className="card mb-4">
            <h3 style={{ fontSize:'1rem', marginBottom:'1.25rem', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Project Details</h3>
            <div className="info-row"><span className="info-label">Budget</span><span className="info-value" style={{ fontWeight:900, fontSize:'1.5rem', background:'var(--grad-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>${job.budget}</span></div>
            <div className="info-row"><span className="info-label">Deadline</span><span className="info-value">{new Date(job.deadline).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}</span></div>
            <div className="info-row"><span className="info-label">Status</span><span className={`status-pill ${job.status}`}>{job.status.replace('_',' ')}</span></div>
            <div className="info-row"><span className="info-label">Bids</span><span className="info-value">{bids.length} proposals</span></div>
          </div>

          {!user && (
            <div className="card" style={{ textAlign:'center' }}>
              <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', marginBottom:'1rem' }}>Sign in to submit a proposal</p>
              <Link to="/login" className="btn btn-primary btn-full">Sign In to Bid</Link>
              <div style={{ marginTop:'0.75rem' }}>
                <Link to="/signup" style={{ color:'var(--text-dim)', fontSize:'0.8rem' }}>No account? Sign up free →</Link>
              </div>
            </div>
          )}

          {isClient && (
            <div className="card" style={{ background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ color:'#fca5a5', fontSize:'0.8rem', textAlign:'center' }}>🔐 You own this project</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
