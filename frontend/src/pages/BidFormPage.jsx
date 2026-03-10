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

  if (!job) return <div>Loading job details...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Submit Proposal for: {job.title}</h1>
      <div className="card p-8">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label className="form-label font-bold text-gray-700">Proposal Details</label>
            <textarea 
              name="proposal_text" 
              className="form-input py-2" 
              rows="6"
              value={formData.proposal_text} 
              onChange={handleChange} 
              placeholder="Why are you the best fit for this role?"
              required 
            ></textarea>
          </div>
          <div className="form-group mb-8">
            <label className="form-label font-bold text-gray-700">Bid Amount ($)</label>
            <input 
              name="bid_amount" 
              type="number" 
              min="1" 
              step="0.01" 
              className="form-input py-2 md-w-1/2" 
              style={{width: '50%'}}
              value={formData.bid_amount} 
              onChange={handleChange} 
              required 
            />
            <p className="text-xs text-gray-500 mt-2">Client budget is ${job.budget}</p>
          </div>
          <div className="border-t border-gray-100 pt-6 flex justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline py-2 border-gray-300 text-gray-700 hover-bg-gray-50">Cancel</button>
            <button type="submit" className="btn btn-primary py-2 px-8 font-bold" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidFormPage;
