import React from 'react';
import { Link } from 'react-router-dom';

const ProjectSection = ({ projects, searchQuery }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold">Your Active Projects</h2>
        <span className="results-count">{projects.length} in progress</span>
      </div>
      
      {projects.length === 0 ? (
        <div className="card empty-state">
          <p className="text-lg font-medium">No projects found</p>
          <p>{searchQuery ? 'Adjust your search' : 'Start a new project to see it here'}</p>
        </div>
      ) : (
        <div className="jobs-container">
          {projects.map(project => (
            <article key={project.project_id} className="card job-card">
              <div className="job-card-header">
                <Link to={`/projects/${project.project_id}`} className="job-title-link">
                  Project #{project.project_id}
                </Link>
                <span className={`badge ${
                  project.status === 'completed' ? 'badge-completed' : 'badge-progress'
                }`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <div className="job-footer">
                <p className="text-sm text-muted">Reference Job #{project.job_id}</p>
                <Link to={`/projects/${project.project_id}`} className="btn btn-outline btn-sm">
                  View Project
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectSection;
