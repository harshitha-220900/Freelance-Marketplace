const StatsCard = ({ label, value, icon, color }) => (
  <div className="card stats-card group overflow-hidden relative">
    <div className={`absolute top-0 left-0 w-1.5 h-full ${color}`}></div>
    <div className="flex items-center justify-between">
      <div>
        <p className="stats-label text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className="stats-value text-3xl font-black text-slate-900">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
        {icon}
      </div>
    </div>
  </div>
);

const StatsGrid = ({ stats, role }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatsCard 
        label="Total Projects" 
        value={stats.totalProjects} 
        color="bg-indigo-600"
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>}
      />
      <StatsCard 
        label="In Progress" 
        value={stats.inProgressProjects} 
        color="bg-amber-500"
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
      />
      <StatsCard 
        label="Completed" 
        value={stats.completedProjects} 
        color="bg-teal-500"
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
      />
      {role === 'client' && (
        <StatsCard 
          label="Job Listings" 
          value={stats.totalJobs} 
          color="bg-pink-500"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
        />
      )}
    </div>
  );
};

export default StatsGrid;
