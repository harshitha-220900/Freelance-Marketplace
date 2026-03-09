import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import BidCard from '../components/BidCard';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobRes = await api.get(`/jobs/${id}`);
        setJob(jobRes.data);
        
        // Only fetch bids if client owner or if you're a freelancer
        const bidsRes = await api.get(`/bids/job/${id}`);
        setBids(bidsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id]);

  const handleAcceptBid = async (bidId) => {
    try {
      await api.put(`/bids/${bidId}/accept`);
      await api.post(`/projects`, { job_id: job.job_id });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.detail || 'Error accepting bid');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  const isClientOwner = user?.role === 'client' && user?.user_id === job.client_id;
  const isFreelancer = user?.role === 'freelancer';
  const hasBid = bids.some(b => b.freelancer_id === user?.user_id);

  return (
    <div>
      <div className="mb-4">
        <Link to="/jobs" className="text-blue-500 hover:text-blue-700">← Back to Jobs</Link>
      </div>

      <div className="card lg:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="text-sm text-gray-500 flex gap-4">
              <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
              <span>Client #{job.client_id}</span>
            </div>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full font-bold ${
            job.status === 'open' ? 'bg-green-100 text-green-800' :
            job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.status.toUpperCase()}
          </span>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 mb-8 flex gap-8">
          <div>
            <div className="text-sm text-gray-500 font-bold mb-1">BUDGET</div>
            <div className="text-2xl font-bold">${job.budget}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 font-bold mb-1">DEADLINE</div>
            <div className="text-xl font-bold mt-1">{new Date(job.deadline).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Project Description</h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </div>
        </div>

        {isFreelancer && job.status === 'open' && !hasBid && (
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <Link to={`/jobs/${job.job_id}/bid`} className="btn btn-primary px-8 py-3 text-lg shadow-md hover:shadow-lg transition">
              Submit a Proposal
            </Link>
          </div>
        )}
        
        {isFreelancer && hasBid && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-center font-medium">
            You have already submitted a proposal for this job.
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Proposals ({bids.length})</h2>
        {bids.length === 0 ? (
          <p className="text-gray-500 bg-white p-6 rounded-lg border text-center">No proposals submitted yet.</p>
        ) : (
          <div className="grid gap-4">
            {bids.map(bid => (
              <BidCard 
                key={bid.bid_id} 
                bid={bid} 
                onAccept={handleAcceptBid}
                isJobOpen={job.status === 'open'}
                jobOwnerId={job.client_id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;
