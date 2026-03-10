import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, showDetailsBtn = true }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="m-0 text-lg font-bold text-gray-900">{job.title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          job.status === 'open' ? 'bg-green-100 text-green-800' :
          job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {job.status.toUpperCase()}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <div>
          <strong>Budget:</strong> ${job.budget}
        </div>
        <div>
          <strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
        </div>
      </div>
      
      {showDetailsBtn && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Link to={`/jobs/${job.job_id}`} className="btn btn-outline text-sm">
            View Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobCard;
