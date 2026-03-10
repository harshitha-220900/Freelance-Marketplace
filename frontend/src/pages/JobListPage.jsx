import React, { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs?status=open');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Open Jobs</h1>
      </div>
      
      {jobs.length === 0 ? (
        <div className="card text-center p-8 text-gray-500">
          No open jobs available right now. Check back later!
        </div>
      ) : (
        <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-4" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem'}}>
          {jobs.map(job => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListPage;
