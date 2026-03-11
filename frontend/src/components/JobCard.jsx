import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, showDetailsBtn = true }) => {
  return (
    <article className="card job-card">
      <div className="job-card-header">
        <Link to={`/jobs/${job.job_id}`} className="job-title-link">
          {job.title}
        </Link>
        <div className="job-budget">
          <span className="budget-value">${job.budget}</span>
          <span className="budget-type">avg bid</span>
        </div>
      </div>
      
      <div className="job-meta">
        <span className="badge badge-open">{job.status}</span>
        <span className="meta-sep">&#8226;</span>
        <span className="meta-item">{new Date(job.deadline).toLocaleDateString()} left</span>
      </div>
      
      <p className="job-description">
        {job.description}
      </p>
      
      <div className="job-footer">
        <div className="job-skills">
          <span className="skill-tag">Web Scraping</span>
          <span className="skill-tag">Python</span>
          <span className="skill-tag">Data Processing</span>
        </div>
        
        {showDetailsBtn && (
          <Link to={`/jobs/${job.job_id}`} className="btn btn-primary btn-sm btn-bid">
            Bid Now
          </Link>
        )}
      </div>
    </article>
  );
};

export default JobCard;
