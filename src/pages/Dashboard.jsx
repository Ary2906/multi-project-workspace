import { useMemo } from 'react';
import { Briefcase, DollarSign, Layers } from 'lucide-react';
import './Dashboard.css';

export const Dashboard = ({ projects = [], removeProject, updateProject, status = 'all' }) => {
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (status === 'all') return projects;
    if (status === 'active') return projects.filter(p => !p.archived);
    if (status === 'archived') return projects.filter(p => p.archived);
    return projects;
  }, [projects, status]);

  const stats = useMemo(() => {
    return {
      totalWorkspaces: projects.length,
      totalTasks: projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0),
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    };
  }, [projects]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon workspace">
            <Briefcase size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Workspace</p>
            <p className="stat-value">{stats.totalWorkspaces}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon task">
            <Layers size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Task</p>
            <p className="stat-value">{stats.totalTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon budget">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Budget Allocation</p>
            <p className="stat-value">${stats.totalBudget.toLocaleString('en-US')}</p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="projects-section">
        <div className="projects-header">
          <h2 className="projects-title">
            {status === 'all' && 'All Projects'}
            {status === 'active' && 'Active Projects'}
            {status === 'archived' && 'Archived Projects'}
          </h2>
          <p className="projects-count">{filteredProjects.length} projects</p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <p>No projects found</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <h3>{project.name}</h3>
                  <span className={`status ${project.archived ? 'archived' : 'active'}`}>
                    {project.archived ? 'Archived' : 'Active'}
                  </span>
                </div>
                {project.description && (
                  <p className="project-description">{project.description}</p>
                )}
                <div className="project-meta">
                  <span className="category">{project.category}</span>
                  <span className="priority">{project.priority}</span>
                </div>
                <div className="project-footer">
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      updateProject(project.id, { archived: !project.archived })
                    }
                  >
                    {project.archived ? 'Restore' : 'Archive'}
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => removeProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
