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
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchJobData = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      else setRefreshing(true);

      setError(null);
      const jobRes = await api.get(`/jobs/${id}`);
      const fetchedJob = jobRes.data;
      setJob(fetchedJob);

      // Only fetch bids if client owner or if you're a freelancer
      if (user?.role === 'freelancer' || user?.user_id === fetchedJob.client_id) {
        const bidsRes = await api.get(`/bids/job/${id}`);
        setBids(bidsRes.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to load job details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.user_id, user?.role]);

  const handleAcceptBid = async (bidId) => {
    try {
      await api.put(`/bids/${bidId}/accept`);
      await api.post(`/projects`, { job_id: job.job_id });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.detail || 'Error accepting bid');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative shadow-sm" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
        <div className="mt-4">
          <button onClick={() => fetchJobData()} className="text-red-700 underline font-semibold hover:text-red-800">Try Again</button>
        </div>
      </div>
    );
  }

  if (!job) return <div className="text-center py-12 text-gray-500 font-medium text-lg">Job not found</div>;

  const isClientOwner = user?.role === 'client' && user?.user_id === job.client_id;
  const isFreelancer = user?.role === 'freelancer';
  const hasBid = bids.some(b => b.freelancer_id === user?.user_id);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <Link to="/jobs" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors w-fit">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Jobs
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-8 border border-gray-100">
        <div className="p-6 lg:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{job.title}</h1>
              <div className="text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2 items-center font-medium">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Posted: {new Date(job.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Client #{job.client_id}
                </span>
              </div>
            </div>
            <span className={`px-4 py-1.5 text-sm lg:text-base rounded-full font-bold shadow-sm whitespace-nowrap ${job.status === 'open' ? 'bg-green-100 text-green-800 border border-green-200' :
                job.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
              {job.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-6 flex flex-col justify-center">
              <div className="text-sm text-blue-600 font-bold mb-2 flex items-center gap-2 tracking-wide">
                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ESTIMATED BUDGET
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900">${job.budget}</div>
            </div>
            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-6 flex flex-col justify-center">
              <div className="text-sm text-purple-600 font-bold mb-2 flex items-center gap-2 tracking-wide">
                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                PROJECT DEADLINE
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{new Date(job.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              Project Description
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50/80 p-6 lg:p-8 rounded-2xl border border-gray-100 text-lg">
              {job.description}
            </div>
          </div>

          {isFreelancer && job.status === 'open' && !hasBid && (
            <div className="border-t border-gray-100 pt-8 flex justify-end">
              <Link to={`/jobs/${job.job_id}/bid`} className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-lg font-semibold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 gap-2 w-full sm:w-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Submit a Proposal
              </Link>
            </div>
          )}

          {isFreelancer && hasBid && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-5 rounded-xl flex items-center gap-4 bg-opacity-50">
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="font-medium text-lg">You have successfully submitted a proposal for this job. You can track it in your dashboard.</span>
            </div>
          )}

          {isClientOwner && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-5 rounded-xl flex items-center gap-4 mt-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span className="font-medium text-lg">You posted this job. Review the actively submitted proposals below.</span>
            </div>
          )}
        </div>
      </div>

      {(isClientOwner || isFreelancer) && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              Proposals
              {bids.length > 0 && <span className="bg-blue-100 text-blue-800 text-sm font-bold py-1 px-3 rounded-full ml-3">{bids.length}</span>}
            </h2>
            <button
              onClick={() => fetchJobData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 bg-white border border-gray-200 hover:border-blue-300 px-3 py-1.5 rounded-lg shadow-sm"
              title="Refresh proposals"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {bids.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-16 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No proposals yet</h3>
              <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
                {isClientOwner
                  ? "Freelancers haven't submitted any proposals for your job yet. Check back soon!"
                  : "Be the first to submit a proposal for this job and stand out to the client."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {bids.map(bid => (
                <div key={bid.bid_id} className="transition-all hover:-translate-y-1 hover:shadow-lg duration-200">
                  <BidCard
                    bid={bid}
                    onAccept={handleAcceptBid}
                    isJobOpen={job.status === 'open'}
                    jobOwnerId={job.client_id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
