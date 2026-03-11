import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('projects');

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const requests = [api.get('/projects')];
      if (user?.role === 'client') requests.push(api.get('/jobs'));
      const results = await Promise.allSettled(requests);
      if (results[0].status === 'fulfilled') setProjects(results[0].value.data || []);
      if (user?.role === 'client' && results[1]?.status === 'fulfilled') {
        setJobs((results[1].value.data || []).filter(j => j.client_id === user.user_id));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const stats = useMemo(() => ({
    active: projects.filter(p => p.status === 'active' || p.status === 'work_submitted').length,
    completed: projects.filter(p => p.status === 'approved' || p.status === 'completed').length,
    total: projects.length,
    jobs: jobs.length,
  }), [projects, jobs]);

  const filteredProjects = useMemo(() => projects.filter(p =>
    !search || p.project_id?.toString().includes(search) || p.status?.includes(search.toLowerCase())
  ), [projects, search]);

  const filteredJobs = useMemo(() => jobs.filter(j =>
    !search || j.title?.toLowerCase().includes(search.toLowerCase())
  ), [jobs, search]);

  if (loading) return <div className="loading-page"><div className="spinner" /><p className="loading-text">Preparing your workspace...</p></div>;
  if (!user) return null;

  const isClient = user.role === 'client';
  const statItems = isClient
    ? [
        { icon:'📋', label:'My Listings', value: stats.jobs, color:'#6366f1', grad:'var(--grad-primary)' },
        { icon:'⚡', label:'Active Projects', value: stats.active, color:'#14b8a6', grad:'var(--grad-teal)' },
        { icon:'✅', label:'Completed', value: stats.completed, color:'#22c55e', grad:'var(--grad-success)' },
        { icon:'📊', label:'Total Projects', value: stats.total, color:'#f59e0b', grad:'var(--grad-amber)' },
      ]
    : [
        { icon:'⚡', label:'Active Projects', value: stats.active, color:'#6366f1', grad:'var(--grad-primary)' },
        { icon:'✅', label:'Completed', value: stats.completed, color:'#22c55e', grad:'var(--grad-success)' },
        { icon:'📊', label:'Total Projects', value: stats.total, color:'#14b8a6', grad:'var(--grad-teal)' },
        { icon:'🎯', label:'Success Rate', value: stats.total ? `${Math.round((stats.completed/stats.total)*100)}%` : '—', color:'#f59e0b', grad:'var(--grad-amber)' },
      ];

  return (
    <div className="page-wrapper container animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-10 flex-wrap gap-6">
        <div>
          <div className="section-tag" style={{ marginBottom:'0.75rem' }}>
            {isClient ? '🏢 Client Dashboard' : '🧑‍💻 Freelancer Dashboard'}
          </div>
          <h1 style={{ fontSize:'2.5rem' }}>
            Hey, <span className="grad-text">{user.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-muted mt-2">Here's everything happening in your workspace today.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => fetchData(true)} disabled={refreshing} className="btn btn-outline">
            {refreshing ? '⏳ Syncing...' : '🔄 Refresh'}
          </button>
          {isClient && <Link to="/jobs/new" className="btn btn-primary">+ Post a Project</Link>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.25rem', marginBottom:'2.5rem' }}>
        {statItems.map((s, i) => (
          <div key={i} className="card stats-card" style={{ padding:'1.5rem', overflow:'hidden', position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.grad, borderRadius:'20px 20px 0 0' }} />
            <div style={{ width:48, height:48, borderRadius:14, background:`${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', marginBottom:'1rem' }}>
              {s.icon}
            </div>
            <div style={{ fontSize:'2.2rem', fontWeight:900, lineHeight:1, background:s.grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:'0.25rem' }}>
              {s.value}
            </div>
            <div style={{ fontSize:'0.78rem', color:'var(--text-dim)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:'relative', maxWidth:400, marginBottom:'1.5rem' }}>
        <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)' }}>🔍</span>
        <input
          className="form-input"
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft:'2.75rem' }}
        />
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <div className={`tab-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          ⚡ Projects ({filteredProjects.length})
        </div>
        {isClient && (
          <div className={`tab-item ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
            📋 Job Listings ({filteredJobs.length})
          </div>
        )}
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        filteredProjects.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">📭</div>
            <h3>No projects yet</h3>
            <p>{isClient ? 'Post a job and accept a bid to start a project.' : 'Browse open projects and submit proposals.'}</p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop:'1rem' }}>{isClient ? 'Post a Job' : 'Find Work'}</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {filteredProjects.map(p => (
              <Link key={p.project_id} to={`/projects/${p.project_id}`} style={{ textDecoration:'none' }}>
                <div className="card" style={{ padding:'1.5rem' }}>
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 style={{ fontSize:'1.1rem', color:'white' }}>Project #{p.project_id}</h3>
                        <span className={`status-pill ${p.status}`}>
                          {p.status === 'active' ? '⚡' : p.status === 'work_submitted' ? '📤' : '✅'} {p.status.replace('_',' ')}
                        </span>
                      </div>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-dim)', display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                        <span>Started: {new Date(p.start_date).toLocaleDateString()}</span>
                        {p.end_date && <span>Ended: {new Date(p.end_date).toLocaleDateString()}</span>}
                        <span>Job #{p.job_id}</span>
                      </div>
                    </div>
                    <span className="btn btn-outline btn-sm">View Project →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {/* Jobs Tab (Client only) */}
      {activeTab === 'jobs' && isClient && (
        filteredJobs.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">📋</div>
            <h3>No job listings yet</h3>
            <p>Post your first project and find talented freelancers.</p>
            <Link to="/jobs/new" className="btn btn-primary" style={{ marginTop:'1rem' }}>Post a Project</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {filteredJobs.map(job => (
              <Link key={job.job_id} to={`/jobs/${job.job_id}`} style={{ textDecoration:'none' }}>
                <div className="card" style={{ padding:'1.5rem' }}>
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 style={{ fontSize:'1.1rem', color:'white' }}>{job.title}</h3>
                        <span className={`status-pill ${job.status}`}>{job.status.replace('_',' ')}</span>
                      </div>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-dim)' }}>
                        Budget: <strong style={{ color:'var(--primary-light)' }}>${job.budget}</strong> · Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="btn btn-outline btn-sm">Manage →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
