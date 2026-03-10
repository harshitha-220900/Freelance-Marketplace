import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewJobPage = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', budget: '', deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        budget: parseFloat(formData.budget)
      };
      const res = await api.post('/jobs', payload);
      navigate(`/jobs/${res.data.job_id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      <div className="card p-8">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label className="form-label font-bold text-gray-700">Job Title</label>
            <input 
              name="title" 
              type="text" 
              className="form-input py-2" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g. Build a specific website"
              required 
            />
          </div>
          
          <div className="form-group mb-6">
            <label className="form-label font-bold text-gray-700">Detailed Description</label>
            <textarea 
              name="description" 
              className="form-input py-2" 
              rows="6"
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Describe the requirements and responsibilities"
              required 
            ></textarea>
          </div>
          
          <div className="grid md-grid-cols-2 gap-4 mb-6" style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
            <div className="form-group m-0">
              <label className="form-label font-bold text-gray-700">Budget ($)</label>
              <input 
                name="budget" 
                type="number" 
                min="1" 
                step="0.01"
                className="form-input py-2" 
                value={formData.budget} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group m-0">
              <label className="form-label font-bold text-gray-700">Deadline</label>
              <input 
                name="deadline" 
                type="date" 
                className="form-input py-2" 
                value={formData.deadline} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-100 pt-6">
            <button type="submit" className="btn btn-primary w-full py-3 text-lg font-bold" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewJobPage;
