import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ProjectDashboard = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get('/projects');
      const found = res.data.find(p => p.project_id === parseInt(id));
      if (found) setProject(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      if (confirm('Are you sure you want to approve this work? This cannot be undone.')) {
        await api.put(`/projects/${id}/approve`);
        fetchProject();
        alert('Work approved successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Error approving work');
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found or unauthorized.</div>;

  const isClient = user.role === 'client' && user.user_id === project.client_id;
  const isFreelancer = user.role === 'freelancer' && user.user_id === project.freelancer_id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/dashboard" className="text-blue-500 hover:text-blue-700">← Back to Dashboard</Link>
      </div>
      
      <div className="card p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Project Workspace #{project.project_id}</h1>
          <span className={`px-4 py-2 rounded-full font-bold text-sm ${
            project.status === 'active' ? 'bg-blue-100 text-blue-800' :
            project.status === 'work_submitted' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {project.status.toUpperCase()}
          </span>
        </div>

        <div className="grid md-grid-cols-2 gap-6 mb-8 border-b pb-8" style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem'}}>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-500 text-sm mb-2">PROJECT DETAILS</h3>
            <p><strong>Job Reference:</strong> #{project.job_id}</p>
            <p><strong>Started:</strong> {new Date(project.start_date).toLocaleDateString()}</p>
            {project.end_date && <p><strong>Ended:</strong> {new Date(project.end_date).toLocaleDateString()}</p>}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-500 text-sm mb-2">PARTICIPANTS</h3>
            <p><strong>Client:</strong> User #{project.client_id}</p>
            <p><strong>Freelancer:</strong> User #{project.freelancer_id}</p>
          </div>
        </div>

        {project.work_notes && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Submitted Work Notes</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="whitespace-pre-wrap">{project.work_notes}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 border-t pt-6 justify-end">
          {/* Freelancer actions */}
          {isFreelancer && project.status === 'active' && (
            <Link to={`/projects/${project.project_id}/submit`} className="btn btn-primary font-bold">
              Submit Work
            </Link>
          )}

          {/* Client actions */}
          {isClient && project.status === 'active' && (
            <Link to={`/projects/${project.project_id}/payment`} className="btn btn-primary font-bold">
              Fund Escrow
            </Link>
          )}

          {isClient && project.status === 'work_submitted' && (
            <button onClick={handleApprove} className="btn btn-primary font-bold bg-green-600 hover:bg-green-700">
              Approve Work
            </button>
          )}

          {/* Shared actions when completed */}
          {(project.status === 'completed' || project.status === 'approved') && (
            <Link to={`/projects/${project.project_id}/review`} className="btn btn-primary font-bold bg-yellow-500 hover:bg-yellow-600 border-none">
              Leave a Review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
