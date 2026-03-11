import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = [
  { icon: '💻', label: 'Web Development', color: '#6366f1' },
  { icon: '🎨', label: 'Design & UI/UX',  color: '#ec4899' },
  { icon: '🤖', label: 'AI & Machine Learning', color: '#14b8a6' },
  { icon: '✍️', label: 'Content Writing',  color: '#f59e0b' },
  { icon: '📱', label: 'Mobile Apps',      color: '#8b5cf6' },
  { icon: '📊', label: 'Data Science',     color: '#06b6d4' },
  { icon: '🔐', label: 'Cybersecurity',    color: '#22c55e' },
  { icon: '🎬', label: 'Video & Animation', color: '#f97316' },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Startup Founder', avatar: 'S', text: 'FreelanceHub helped me find an incredible developer in 24 hours. The quality of talent here is unmatched.', rating: 5 },
  { name: 'James R.', role: 'Senior Designer', avatar: 'J', text: 'As a freelancer, I\'ve tripled my income using this platform. The project matching is spot on!', rating: 5 },
  { name: 'Priya M.', role: 'Product Manager', avatar: 'P', text: 'The escrow payment system gives both parties peace of mind. Truly professional experience!', rating: 5 },
];

const STATS = [
  { value: '50K+', label: 'Freelancers', icon: '👥' },
  { value: '120K+', label: 'Projects Done', icon: '🚀' },
  { value: '$2M+', label: 'Paid Out', icon: '💰' },
  { value: '98%', label: 'Satisfaction', icon: '⭐' },
];

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs?status=open').then(r => setJobs(r.data.slice(0, 4))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="section-tag animate-fade-in-up">
              ⚡ The Future of Freelancing is Here
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.5rem', lineHeight: 1.1 }} className="animate-fade-in-up">
              Find <span className="grad-text">Top Talent</span> or<br />
              Your Dream <span className="grad-text-teal">Project</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: 540, lineHeight: 1.7 }} className="animate-fade-in-up">
              Connect with world-class freelancers or discover exciting projects. 
              Build, create, and grow — all in one powerful platform.
            </p>
            <div className="flex gap-4 flex-wrap animate-fade-in-up">
              <Link to="/jobs" className="btn btn-primary btn-xl animate-glow">
                🔍 Explore Projects
              </Link>
              <Link to="/signup" className="btn btn-outline btn-xl">
                🚀 Start Earning
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 mt-8 flex-wrap" style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              <span>✅ No upfront fees</span>
              <span>🔐 Secure payments</span>
              <span>⚡ Post in 2 minutes</span>
            </div>
          </div>

          {/* Floating card preview */}
          <div className="animate-float" style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            width: 280, display: 'none'
          }}>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ padding: '3rem 0', background: 'rgba(99,102,241,0.04)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="section-heading">
            <div className="section-tag">📂 Browse by Category</div>
            <h2>What are you looking for?</h2>
            <p>Explore thousands of projects across every industry and discipline</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {CATEGORIES.map((c, i) => (
              <Link to="/jobs" key={i} style={{ textDecoration: 'none' }}>
                <div className="card category-card card-shine" style={{ borderTop: `3px solid ${c.color}` }}>
                  <span className="category-icon">{c.icon}</span>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>{c.label}</h4>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Explore →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LATEST PROJECTS ===== */}
      <section style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div className="section-heading">
            <div className="section-tag">🔥 Live Opportunities</div>
            <h2>Latest Projects</h2>
            <p>Fresh projects posted by clients ready to hire today</p>
          </div>

          {loading ? (
            <div className="loading-page" style={{ minHeight: 200 }}>
              <div className="spinner" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="card empty-state">
              <div className="empty-icon">📭</div>
              <h3>No projects yet</h3>
              <p>Be the first to post a project!</p>
              <Link to="/signup" className="btn btn-primary" style={{ marginTop: '1rem' }}>Post a Project</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem' }}>
              {jobs.map(job => (
                <Link to={`/jobs/${job.job_id}`} key={job.job_id} style={{ textDecoration: 'none' }}>
                  <div className="card job-card card-shine">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'white' }}>{job.title}</h3>
                        <span className="status-pill open">🟢 Open</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="job-card-budget">${job.budget}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Budget</div>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 flex-wrap">
                        <span className="skill-tag">Full Stack</span>
                        <span className="skill-tag">React</span>
                      </div>
                      <span className="btn btn-primary btn-sm">View →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/jobs" className="btn btn-outline btn-lg">View All Projects →</Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="section-heading">
            <div className="section-tag">🗺️ How It Works</div>
            <h2>Simple. Fast. Powerful.</h2>
            <p>Get started in minutes, not days</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
            {[
              { step: '01', icon: '📝', title: 'Post a Project', desc: 'Describe what you need, set your budget, and watch proposals roll in within hours.' },
              { step: '02', icon: '🤝', title: 'Choose Your Expert', desc: 'Review proposals, check portfolios, and select the perfect freelancer for your project.' },
              { step: '03', icon: '🚀', title: 'Collaborate & Pay Securely', desc: 'Work together, track milestones, and release funds only when you\'re 100% satisfied.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
                <div style={{ width: 64, height: 64, background: 'var(--grad-primary)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 1.25rem', boxShadow: 'var(--shadow-glow)' }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Step {item.step}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div className="section-heading">
            <div className="section-tag">💬 Success Stories</div>
            <h2>Trusted by Thousands</h2>
            <p>Real results from real people using FreelanceHub</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card testimonial-card card-shine">
                <div style={{ fontSize: '3rem', color: 'var(--primary)', opacity: 0.4, lineHeight: 1, marginBottom: '0.5rem' }}>"</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div style={{ width: 44, height: 44, background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'white' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'var(--accent)' }}>{'★'.repeat(t.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 3rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="section-tag" style={{ margin: '0 auto 1.5rem' }}>🎯 Ready to Start?</div>
              <h2 style={{ fontSize: '2.8rem', marginBottom: '1rem', color: 'white' }}>
                Join <span className="grad-text">50,000+</span> professionals
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: 480, margin: '0 auto 2.5rem' }}>
                Whether you're a client or freelancer, FreelanceHub is the platform built for you.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/signup" className="btn btn-primary btn-xl">🚀 Sign Up Free</Link>
                <Link to="/jobs" className="btn btn-outline btn-xl">Browse Projects</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
