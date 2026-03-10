import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);

      const requests = [api.get('/projects')];
      if (user?.role === 'client') {
        requests.push(api.get('/jobs'));
      }

      const responses = await Promise.all(requests);
      setProjects(responses[0].data);

      if (user?.role === 'client') {
        const allJobs = responses[1].data;
        setJobs(allJobs.filter(job => job.client_id === user.user_id));
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchDashboardData();
    }
  }, [user]);

  // Derived state for Search & Stats
  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.status.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.project_id?.toString().includes(searchQuery) ||
      p.job_id?.toString().includes(searchQuery)
    );
  }, [projects, searchQuery]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(j =>
      (j.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (j.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const stats = useMemo(() => ({
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    inProgressProjects: projects.filter(p => p.status === 'in_progress').length,
    totalJobs: jobs.length
  }), [projects, jobs]);

  // Helpers
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">{error}</p>
        <button 
          onClick={() => fetchDashboardData(false)} 
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">{currentDate}</p>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {getGreeting()}, <span className="text-blue-600">{user.name.split(' ')[0]}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className={`px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium flex items-center justify-center gap-2 flex-1 md:flex-none ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          {user.role === 'client' && (
            <Link 
              to="/jobs/new" 
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Post Job
            </Link>
          )}
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">{stats.inProgressProjects}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completedProjects}</p>
        </div>
        {user.role === 'client' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
            <p className="text-sm font-medium text-gray-500 mb-1">Active Jobs Posted</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalJobs}</p>
          </div>
        )}
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium text-gray-700">Filter Overview</span>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors shadow-sm"
            placeholder="Search projects, statuses, or jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {/* Active Projects Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-sm font-bold ml-2">
              {filteredProjects.length}
            </span>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center text-gray-500 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-lg font-medium text-gray-900">No projects found</p>
              <p className="mt-1">{searchQuery ? 'Try adjusting your search criteria.' : 'Create a new job to start a project.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <article key={project.project_id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden group">
                  {/* Decorative accent top border depending on status */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${
                    project.status === 'completed' ? 'bg-green-500' :
                    project.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-yellow-400'
                  }`}></div>
                  
                  <div className="flex justify-between items-start mb-4 mt-2">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      Project #{project.project_id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${
                      project.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      project.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {project.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-grow my-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Job Reference</span>
                      <span className="font-medium text-gray-900 bg-gray-100 px-2 rounded">#{project.job_id}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <Link 
                      to={`/projects/${project.project_id}`} 
                      className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gray-50 text-gray-900 font-medium text-sm hover:bg-blue-600 hover:text-white rounded-lg transition-all border border-gray-200 hover:border-blue-600 group/btn"
                    >
                      Open Workspace 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Client Posted Jobs Section */}
        {user.role === 'client' && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Job Listings</h2>
              <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-sm font-bold ml-2">
                {filteredJobs.length}
              </span>
            </div>
            
            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center text-gray-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium text-gray-900">No jobs found</p>
                {searchQuery ? (
                  <p className="mt-1">Try adjusting your search criteria.</p>
                ) : (
                  <div className="mt-4">
                    <Link to="/jobs/new" className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors">
                      Post your first job
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <div key={job.job_id} className="transform transition-all duration-300 hover:-translate-y-1">
                     <JobCard job={job} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
