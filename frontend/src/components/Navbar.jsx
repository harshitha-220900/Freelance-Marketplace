import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" style={{textDecoration:'none'}}>
          <div className="brand-icon">⚡</div>
          <span>Freelance<span className="grad-text">Hub</span></span>
        </Link>

        {/* Nav Links */}
        <div className="navbar-links">
          <Link to="/jobs" className={`navbar-link ${isActive('/jobs') ? 'active' : ''}`}>Explore Projects</Link>
          {user && (
            <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          )}
          {user?.role === 'client' && (
            <Link to="/jobs/new" className={`navbar-link ${isActive('/jobs/new') ? 'active' : ''}`}>Post a Job</Link>
          )}
          {user?.role === 'freelancer' && (
            <Link to="/jobs" className={`navbar-link ${isActive('/jobs') && false ? 'active' : ''}`}>Find Work</Link>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              {user.role === 'client' && (
                <Link to="/jobs/new" className="btn btn-primary btn-sm">
                  + Post a Project
                </Link>
              )}
              <div className="nav-avatar" title={user.name} onClick={() => navigate('/dashboard')}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
