import React, { useContext } from 'react';
import { Link, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import JobListPage from './pages/JobListPage';
import JobDetailsPage from './pages/JobDetailsPage';
import NewJobPage from './pages/NewJobPage';
import BidFormPage from './pages/BidFormPage';
import ProjectDashboard from './pages/ProjectDashboard';
import SubmitWorkPage from './pages/SubmitWorkPage';
import ReviewPage from './pages/ReviewPage';
import PaymentPage from './pages/PaymentPage';
import HomePage from './pages/HomePage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return (
    <div className="loading-page">
      <div className="spinner"></div>
      <p className="loading-text">Loading your workspace...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />

            {/* Protected */}
            <Route path="/dashboard"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/jobs/new"           element={<ProtectedRoute><NewJobPage /></ProtectedRoute>} />
            <Route path="/jobs/:id/bid"       element={<ProtectedRoute><BidFormPage /></ProtectedRoute>} />
            <Route path="/projects/:id"       element={<ProtectedRoute><ProjectDashboard /></ProtectedRoute>} />
            <Route path="/projects/:id/submit"  element={<ProtectedRoute><SubmitWorkPage /></ProtectedRoute>} />
            <Route path="/projects/:id/review"  element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
            <Route path="/projects/:id/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
