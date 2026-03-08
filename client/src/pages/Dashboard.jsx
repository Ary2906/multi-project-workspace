import { useMemo, useState, useEffect } from 'react';
import { Briefcase, DollarSign, Layers, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard = ({ projects = [], removeProject, updateProject, status = 'all' }) => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTag, setFilterTag] = useState('');

  // Fetch categories, project statuses, and tags from backend
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableStatuses, setAvailableStatuses] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5000/api/categories');
        if (categoriesResponse.ok) {
          const categories = await categoriesResponse.json();
          setAvailableCategories(categories);
        }

        // Fetch tags
        const tagsResponse = await fetch('http://localhost:5000/api/tags');
        if (tagsResponse.ok) {
          const tags = await tagsResponse.json();
          setAvailableTags(tags);
        }
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  // Get unique categories, statuses, and tags from projects
  const uniqueCategories = useMemo(() => {
    if (availableCategories.length > 0) {
      return availableCategories;
    }
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [projects, availableCategories]);

  const uniqueProjectStatuses = useMemo(() => {
    if (availableStatuses.length > 0) {
      return availableStatuses;
    }
    const statuses = new Set(projects.map(p => p.projectStatus).filter(Boolean));
    return Array.from(statuses).sort();
  }, [projects, availableStatuses]);

  const uniqueTags = useMemo(() => {
    if (availableTags.length > 0) {
      return availableTags;
    }
    const tags = new Set();
    projects.forEach(p => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [projects, availableTags]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    
    let filtered = projects;

    // Filter by archive status
    if (status === 'active') filtered = filtered.filter(p => !p.archived);
    if (status === 'archived') filtered = filtered.filter(p => p.archived);

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    // Filter by project status
    if (filterStatus) {
      filtered = filtered.filter(p => p.projectStatus === filterStatus);
    }

    // Filter by tag
    if (filterTag) {
      filtered = filtered.filter(p => p.tags && p.tags.includes(filterTag));
    }

    return filtered;
  }, [projects, status, filterCategory, filterStatus, filterTag]);

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

        {/* Filter Controls */}
        <div className="filter-controls">
          {uniqueCategories.length > 0 && (
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
              title="Filter by category"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          {uniqueProjectStatuses.length > 0 && (
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
              title="Filter by project status"
            >
              <option value="">All Statuses</option>
              {uniqueProjectStatuses.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          )}

          {uniqueTags.length > 0 && (
            <select 
              value={filterTag} 
              onChange={(e) => setFilterTag(e.target.value)}
              className="filter-select"
              title="Filter by tag"
            >
              <option value="">All Tags</option>
              {uniqueTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}

          {(filterCategory || filterStatus || filterTag) && (
            <button 
              onClick={() => {
                setFilterCategory('');
                setFilterStatus('');
                setFilterTag('');
              }}
              className="btn-clear-filters"
            >
              Clear Filters
            </button>
          )}
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
                  {project.category && (
                    <span className="badge badge-category">{project.category}</span>
                  )}
                  {project.projectStatus && (
                    <span className="badge badge-status">{project.projectStatus}</span>
                  )}
                  {project.taskStatus && (
                    <span className="badge badge-task-status">{project.taskStatus}</span>
                  )}
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="project-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="tag-label">{tag}</span>
                    ))}
                  </div>
                )}
                {project.dueDate && (
                  <div className="project-due-date">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </div>
                )}
                {(project.allocatedBudget || project.activeTaskCount !== undefined) && (
                  <div className="project-budget-stats">
                    {project.allocatedBudget !== undefined && (
                      <div className="budget-stat">
                        <DollarSign size={14} />
                        <span>${project.allocatedBudget?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    {project.activeTaskCount !== undefined && (
                      <div className="task-stat">
                        <Layers size={14} />
                        <span>{project.activeTaskCount} Tasks</span>
                      </div>
                    )}
                  </div>
                )}
                {project.phases && project.phases.length > 0 && (
                  <div className="phases-info">
                    Phase {project.phases.length > 1 ? `1-${project.phases.length}` : '1'}
                  </div>
                )}
                <div className="project-footer">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/edit-project/${project.id}`)}
                  >
                    <Edit2 size={16} /> View Details
                  </button>
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
                    <Trash2 size={16} />
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
