import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await api.get('/projects');
        setProjects(projRes.data);

        // Fetch user specific items: jobs for clients, bids for freelancers
        // Note: the backend doesn't have a direct /jobs/my or /bids/my endpoint,
        // so we'll fetch all and filter in frontend (or extend backend, but let's filter for now)
        if (user.role === 'client') {
          const jobRes = await api.get('/jobs');
          setItems(jobRes.data.filter(j => j.client_id === user.user_id));
        } else {
          // Freelancers have to fetch jobs they bid on or projects they own.
          // Since project lists are available, we focus there.
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        {user.role === 'client' && <Link to="/jobs/new" className="btn btn-primary">Post New Job</Link>}
      </div>

      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500 capitalize">{user.role}</p>
          <p className="mt-1">{user.bio || 'No bio provided.'}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 border-b pb-2">Your Active Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500 mb-8 p-4 bg-gray-50 rounded text-center">No active projects right now.</p>
      ) : (
        <div className="grid md-grid-cols-2 gap-4 mb-8">
          {projects.map(p => (
            <div key={p.project_id} className="card">
              <div className="flex justify-between">
                <h3 className="font-bold">Project #{p.project_id}</h3>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">{p.status.toUpperCase()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Job Reference: #{p.job_id}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 right">
                <Link to={`/projects/${p.project_id}`} className="btn btn-outline text-sm">Open Workspace</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {user.role === 'client' && (
        <>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Your Posted Jobs</h2>
          {items.length === 0 ? (
            <p className="text-gray-500 p-4 bg-gray-50 rounded text-center">You haven't posted any jobs yet.</p>
          ) : (
            <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-4" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
              {items.map(job => (
                <JobCard key={job.job_id} job={job} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
