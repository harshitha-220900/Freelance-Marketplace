import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const BidFormPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    proposal_text: '', bid_amount: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(console.error);
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        job_id: parseInt(id),
        proposal_text: formData.proposal_text,
        bid_amount: parseFloat(formData.bid_amount)
      };
      await api.post('/bids', payload);
      navigate(`/jobs/${id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error submitting bid');
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium text-lg">Loading job details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Submit Proposal
        </h1>
        <p className="text-lg text-gray-600">
          For: <span className="font-semibold text-gray-800">{job.title}</span>
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Proposal Details</h2>
          <p className="text-sm text-gray-500 mt-1">Provide your bid and explain why you're a great fit for this project.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="proposal_text" className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Letter / Proposal
              </label>
              <textarea 
                id="proposal_text"
                name="proposal_text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm outline-none bg-gray-50 focus:bg-white resize-y" 
                rows="6"
                value={formData.proposal_text} 
                onChange={handleChange} 
                placeholder="Why are you the best fit for this role? Detail your relevant experience and approach..."
                required 
              ></textarea>
            </div>

            <div>
              <label htmlFor="bid_amount" className="block text-sm font-semibold text-gray-700 mb-2">
                Bid Amount
              </label>
              <div className="relative rounded-xl shadow-sm sm:w-1/2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-500 sm:text-lg font-medium">$</span>
                </div>
                <input 
                  id="bid_amount"
                  name="bid_amount" 
                  type="number" 
                  min="1" 
                  step="0.01" 
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm outline-none bg-gray-50 focus:bg-white text-gray-900 font-medium" 
                  value={formData.bid_amount} 
                  onChange={handleChange} 
                  placeholder="0.00"
                  required 
                />
              </div>
              <p className="text-sm text-gray-500 mt-3 flex items-center">
                <svg className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Client budget is <span className="font-semibold text-gray-700 ml-1"> ${job.budget}</span>
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center shadow-md hover:shadow-lg" 
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidFormPage;