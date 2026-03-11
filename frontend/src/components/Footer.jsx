import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col">
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
            <div className="brand-icon" style={{width:32,height:32,background:'linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.875rem'}}>⚡</div>
            <span style={{fontSize:'1.25rem',fontWeight:900,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Freelance<span style={{background:'linear-gradient(90deg,#818cf8,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Hub</span></span>
          </div>
          <p style={{color:'var(--text-dim)',fontSize:'0.875rem',lineHeight:1.7,maxWidth:260}}>
            Connect talented freelancers with innovative clients. Build amazing things together.
          </p>
          <div className="social-links">
            {['𝕏','in','𝔾','🐙'].map((icon,i) => (
              <a key={i} href="#" className="social-link">{icon}</a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/jobs">Browse Projects</Link></li>
            <li><Link to="/signup">Post a Job</Link></li>
            <li><Link to="/signup">Find Freelancers</Link></li>
            <li><a href="#">How It Works</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="#">Web Development</a></li>
            <li><a href="#">Design & UI/UX</a></li>
            <li><a href="#">AI & Machine Learning</a></li>
            <li><a href="#">Content Writing</a></li>
            <li><a href="#">Mobile Apps</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 FreelanceHub. Built with ❤️ for the future of work.</p>
        <p style={{color:'var(--text-dim)'}}>Connecting talent with opportunity worldwide 🌍</p>
      </div>
    </div>
  </footer>
);

export default Footer;
