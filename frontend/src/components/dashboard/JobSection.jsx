import React from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../JobCard';

const JobSection = ({ jobs, searchQuery }) => {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold">Your Job Listings</h2>
        <span className="results-count">{jobs.length} projects posted</span>
      </div>
      
      {jobs.length === 0 ? (
        <div className="card empty-state">
          <p className="text-lg font-medium">No jobs found</p>
          <Link to="/jobs/new" className="btn btn-secondary btn-sm mt-4">Post your first project</Link>
        </div>
      ) : (
        <div className="jobs-container">
          {jobs.map(job => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
};

export default JobSection;
