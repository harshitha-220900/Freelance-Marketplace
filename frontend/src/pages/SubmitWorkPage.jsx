import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SubmitWorkPage = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/projects/${id}/submit-work`, { work_notes: notes });
      navigate(`/projects/${id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error submitting work');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Submit Work for Project #{id}</h1>
      <div className="card p-8">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label className="form-label font-bold text-gray-700">Work Delivery Notes</label>
            <textarea 
              className="form-input py-2" 
              rows="8"
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Provide a summary of your work, links to repositories, drive folders, or deployed sites."
              required 
            ></textarea>
            <p className="text-sm text-gray-500 mt-2">
              The client will review these notes to approve the project. Ensure all deliverables are accessible.
            </p>
          </div>
          
          <div className="border-t border-gray-100 pt-6 flex justify-end gap-4">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline text-gray-600 border-gray-300">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary font-bold" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Delivery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitWorkPage;
