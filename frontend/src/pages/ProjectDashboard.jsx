import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const statusConfig = {
  active:        { color:'var(--primary-light)', bg:'rgba(99,102,241,0.15)', icon:'⚡', label:'Active' },
  work_submitted:{ color:'#fcd34d', bg:'rgba(245,158,11,0.12)', icon:'📤', label:'Work Submitted' },
  approved:      { color:'#86efac', bg:'rgba(34,197,94,0.12)',  icon:'✅', label:'Approved' },
  completed:     { color:'#86efac', bg:'rgba(34,197,94,0.12)',  icon:'✅', label:'Completed' },
};

const ProjectDashboard = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();

  const fetchProject = async () => {
    try {
      // Try direct endpoint first, fallback to list
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch {
        const res = await api.get('/projects');
        const found = res.data.find(p => p.project_id === parseInt(id));
        setProject(found || null);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleApprove = async () => {
    if (!window.confirm('Approve this submission? This will mark the project complete.')) return;
    setApproving(true);
    try {
      await api.put(`/projects/${id}/approve`);
      await fetchProject();
    } catch (err) { alert(err.response?.data?.detail || 'Error approving work'); }
    finally { setApproving(false); }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /><p className="loading-text">Loading project workspace...</p></div>;
  if (!project) return <div className="page-wrapper container"><div className="card empty-state"><div className="empty-icon">❌</div><h3>Project not found</h3><Link to="/dashboard" className="btn btn-primary mt-4">Back to Dashboard</Link></div></div>;

  const sc = statusConfig[project.status] || statusConfig.active;
  const isClient = user?.role === 'client' && user?.user_id === project.client_id;
  const isFreelancer = user?.role === 'freelancer' && user?.user_id === project.freelancer_id;

  return (
    <div>
      <div className="page-banner">
        <div className="container">
          <Link to="/dashboard" className="back-link" style={{ color:'rgba(255,255,255,0.6)', marginBottom:'1rem', display:'inline-flex' }}>← Back to Dashboard</Link>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="section-tag">🚀 Project Workspace</div>
            <span className="status-pill" style={{ background: sc.bg, color: sc.color }}>
              {sc.icon} {sc.label}
            </span>
          </div>
          <h1>Project #{project.project_id}</h1>
        </div>
      </div>

      <div className="page-wrapper container" style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'2rem', alignItems:'start' }}>
        {/* Main */}
        <div>
          {/* Project details */}
          <div className="card mb-6">
            <h2 style={{ fontSize:'1.2rem', marginBottom:'1.5rem' }}>📋 Project Details</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.35rem' }}>Job Reference</div>
                <div><Link to={`/jobs/${project.job_id}`} style={{ color:'var(--primary-light)', fontWeight:700 }}>Job #{project.job_id} →</Link></div>
              </div>
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.35rem' }}>Project Status</div>
                <span className="status-pill" style={{ background:sc.bg, color:sc.color }}>{sc.icon} {sc.label}</span>
              </div>
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.35rem' }}>Start Date</div>
                <div style={{ fontWeight:600 }}>{new Date(project.start_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
              </div>
              {project.end_date && (
                <div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.35rem' }}>Completed</div>
                  <div style={{ fontWeight:600 }}>{new Date(project.end_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.35rem' }}>Client</div>
                <div style={{ fontWeight:600 }}>User #{project.client_id} {isClient && '(You)'}</div>
              </div>
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.35rem' }}>Freelancer</div>
                <div style={{ fontWeight:600 }}>User #{project.freelancer_id} {isFreelancer && '(You)'}</div>
              </div>
            </div>
          </div>

          {/* Submitted work */}
          {project.work_notes && (
            <div className="card mb-6" style={{ background:'rgba(34,197,94,0.05)', border:'1px solid rgba(34,197,94,0.2)' }}>
              <h2 style={{ fontSize:'1.2rem', marginBottom:'1rem', color:'#86efac' }}>📤 Submitted Work</h2>
              <div style={{ color:'var(--text-muted)', whiteSpace:'pre-wrap', lineHeight:1.8, fontSize:'0.95rem' }}>{project.work_notes}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="card" style={{ padding:'2rem' }}>
            <h3 style={{ fontSize:'1rem', marginBottom:'1.5rem', color:'var(--text-muted)', fontWeight:700 }}>AVAILABLE ACTIONS</h3>
            <div className="flex gap-3 flex-wrap">
              {/* Freelancer: submit work */}
              {isFreelancer && project.status === 'active' && (
                <Link to={`/projects/${project.project_id}/submit`} className="btn btn-primary">
                  📤 Submit Work
                </Link>
              )}

              {/* Client: fund escrow */}
              {isClient && project.status === 'active' && (
                <Link to={`/projects/${project.project_id}/payment`} className="btn btn-secondary">
                  💳 Fund Escrow
                </Link>
              )}

              {/* Client: approve submitted work */}
              {isClient && project.status === 'work_submitted' && (
                <button onClick={handleApprove} disabled={approving} className="btn btn-accent">
                  {approving ? '⏳ Approving...' : '✅ Approve Work'}
                </button>
              )}

              {/* Both: leave review when completed */}
              {(project.status === 'completed' || project.status === 'approved') && (
                <Link to={`/projects/${project.project_id}/review`} className="btn btn-primary">
                  ⭐ Leave a Review
                </Link>
              )}

              {/* No actions available */}
              {!isClient && !isFreelancer && (
                <p style={{ color:'var(--text-dim)', fontSize:'0.875rem' }}>No actions available.</p>
              )}
              {(isClient || isFreelancer) && project.status === 'approved' && (
                <p style={{ color:'#86efac', fontSize:'0.875rem' }}>🎉 Project successfully completed!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: quick nav */}
        <div style={{ position:'sticky', top:90 }}>
          <div className="card">
            <h3 style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'1.25rem' }}>Quick Navigation</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ justifyContent:'flex-start' }}>📊 Dashboard</Link>
              <Link to={`/jobs/${project.job_id}`} className="btn btn-ghost btn-sm" style={{ justifyContent:'flex-start' }}>📋 View Job Listing</Link>
              {isFreelancer && project.status === 'active' && (
                <Link to={`/projects/${project.project_id}/submit`} className="btn btn-primary btn-sm" style={{ justifyContent:'flex-start' }}>📤 Submit Work</Link>
              )}
              {isClient && project.status === 'active' && (
                <Link to={`/projects/${project.project_id}/payment`} className="btn btn-secondary btn-sm" style={{ justifyContent:'flex-start' }}>💳 Make Payment</Link>
              )}
              {(project.status === 'completed' || project.status === 'approved') && (
                <Link to={`/projects/${project.project_id}/review`} className="btn btn-ghost btn-sm" style={{ justifyContent:'flex-start' }}>⭐ Leave Review</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
