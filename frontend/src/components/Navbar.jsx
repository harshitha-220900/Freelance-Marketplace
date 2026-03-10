import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          FreelanceHub
        </Link>
        <div className="navbar-links">
          <Link to="/jobs" className="navbar-link">Browse Jobs</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              {user.role === 'client' && (
                <Link to="/jobs/new" className="btn btn-primary ml-2">Post Job</Link>
              )}
              <div className="user-profile">
                <span className="user-name">{user.name} ({user.role})</span>
                <button onClick={handleLogout} className="btn btn-outline ml-2">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="btn btn-primary ml-2">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
