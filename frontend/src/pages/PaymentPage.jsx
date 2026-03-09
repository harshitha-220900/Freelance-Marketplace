import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PaymentPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // We need to find the project to get the job_id, then get the job to get the budget
    const fetchBudget = async () => {
      try {
        const projRes = await api.get('/projects');
        const project = projRes.data.find(p => p.project_id === parseInt(id));
        if (project) {
          const jobRes = await api.get(`/jobs/${project.job_id}`);
          setJob(jobRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBudget();
  }, [id]);

  const handleFundEscrow = async () => {
    if (!job) return;
    setLoading(true);
    try {
      await api.post('/payments', {
        project_id: parseInt(id),
        amount: job.budget
      });
      alert('Funds deposited successfully!');
      navigate(`/projects/${id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error funding escrow');
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div>Loading payment portal...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Fund Project Escrow</h1>
      <div className="card p-8">
        <div className="text-center mb-8">
          <p className="text-gray-500 mb-2">Total Amount Due</p>
          <div className="text-5xl font-bold text-gray-900">${job.budget}</div>
          <p className="text-sm border bg-red-50 text-red-600 rounded mt-4 p-2">
            This is a simulated payment system. Do not enter real credit card info.
          </p>
        </div>
        
        <div className="space-y-4 mb-8 text-center" style={{padding: '0 2rem'}}>
          <p className="text-sm text-gray-600 border-t pt-4">By clicking "Fund Now", the amount will be securely held in escrow until you approve the final work delivery.</p>
        </div>
        
        <button 
          onClick={handleFundEscrow} 
          className="btn btn-primary w-full py-3 text-lg font-bold" 
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Fund Now'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
