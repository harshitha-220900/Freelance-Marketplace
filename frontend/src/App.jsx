import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
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

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/jobs/new" element={<ProtectedRoute><NewJobPage /></ProtectedRoute>} />
            <Route path="/jobs/:id/bid" element={<ProtectedRoute><BidFormPage /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDashboard /></ProtectedRoute>} />
            <Route path="/projects/:id/submit" element={<ProtectedRoute><SubmitWorkPage /></ProtectedRoute>} />
            <Route path="/projects/:id/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
            <Route path="/projects/:id/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
            
            <Route path="/" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
