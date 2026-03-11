import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/jobs').then(r => setJobs(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || j.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      {/* Banner */}
      <div className="page-banner">
        <div className="container">
          <div className="section-tag" style={{ marginBottom: '1rem' }}>🔍 Explore Opportunities</div>
          <h1>Find Your Next <span className="grad-text">Project</span></h1>
          <p>Browse through hundreds of live projects posted by clients worldwide</p>

          {/* Search */}
          <div style={{ display:'flex', gap:'1rem', marginTop:'2rem', maxWidth:600, flexWrap:'wrap' }}>
            <div style={{ flex:1, position:'relative', minWidth:240 }}>
              <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-dim)', fontSize:'1rem' }}>🔍</span>
              <input
                type="text"
                className="form-input"
                placeholder="Search projects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft:'2.75rem' }}
              />
            </div>
            <select
              className="form-input"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ width:'auto', paddingRight:'2rem' }}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="page-wrapper container">
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize:'1.5rem' }}>
            {loading ? 'Loading...' : <><span className="grad-text">{filtered.length}</span> Projects Found</>}
          </h2>
          <Link to="/jobs/new" className="btn btn-primary btn-sm">+ Post a Project</Link>
        </div>

        {loading ? (
          <div className="loading-page"><div className="spinner" /><p className="loading-text">Fetching projects...</p></div>
        ) : filtered.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">📭</div>
            <h3>No matching projects</h3>
            <p>Try adjusting your search or be the first to post one!</p>
            <Link to="/jobs/new" className="btn btn-primary" style={{ marginTop:'1rem' }}>Post a Project</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            {filtered.map(job => (
              <div key={job.job_id} className="card job-card card-shine" style={{ padding:'1.75rem' }}>
                <div className="flex justify-between items-start">
                  <div style={{ flex:1 }}>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <Link to={`/jobs/${job.job_id}`} style={{ textDecoration:'none' }}>
                        <h3 style={{ fontSize:'1.2rem', color:'white', fontWeight:800, transition:'var(--transition)' }}
                          onMouseEnter={e => e.target.style.color='var(--primary-light)'}
                          onMouseLeave={e => e.target.style.color='white'}
                        >{job.title}</h3>
                      </Link>
                      <span className={`status-pill ${job.status}`}>{job.status === 'open' ? '🟢' : job.status === 'in_progress' ? '🔵' : '✅'} {job.status.replace('_', ' ')}</span>
                    </div>
                    <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:1.6, marginBottom:'1rem', maxWidth:600,
                      display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {job.description}
                    </p>
                    <div className="flex gap-3 items-center flex-wrap">
                      <div className="flex gap-2">
                        <span className="skill-tag">Full Stack</span>
                        <span className="skill-tag">React</span>
                        <span className="skill-tag">Node.js</span>
                      </div>
                      <span style={{ color:'var(--text-dim)', fontSize:'0.78rem' }}>
                        📅 Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign:'right', marginLeft:'1.5rem', flexShrink:0 }}>
                    <div className="job-card-budget">${job.budget}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-dim)', marginBottom:'1rem' }}>Project Budget</div>
                    <Link to={`/jobs/${job.job_id}`} className="btn btn-primary btn-sm">View Details →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListPage;
