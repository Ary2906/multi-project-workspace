import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import './ProjectDetails.css';

export const ProjectDetails = ({ projects, updateProject }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const found = projects.find(p => p.id === parseInt(projectId));
    if (found) {
      setProject(found);
      setFormData({
        name: found.name || '',
        tags: found.tags || [],
        dueDate: found.dueDate || '',
        totalBudgetGoal: found.totalBudgetGoal || 0,
        phases: found.phases || []
      });
    } else {
      navigate('/projects/all');
    }
  }, [projectId, projects, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalBudgetGoal' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePhaseChange = (phaseIndex, field, value) => {
    setFormData(prev => {
      const newPhases = [...prev.phases];
      newPhases[phaseIndex] = {
        ...newPhases[phaseIndex],
        [field]: value
      };
      return { ...prev, phases: newPhases };
    });
  };

  const handleTaskChange = (phaseIndex, taskIndex, field, value) => {
    setFormData(prev => {
      const newPhases = [...prev.phases];
      newPhases[phaseIndex].tasks[taskIndex] = {
        ...newPhases[phaseIndex].tasks[taskIndex],
        [field]: field === 'cost' ? parseFloat(value) || 0 : value
      };
      newPhases[phaseIndex].total = newPhases[phaseIndex].tasks.reduce(
        (sum, t) => sum + parseFloat(t.cost || 0), 0
      );
      return { ...prev, phases: newPhases };
    });
  };

  const handleSave = () => {
    const allocatedBudget = formData.phases.reduce((sum, phase) => sum + phase.total, 0);
    const activeTaskCount = formData.phases.reduce((sum, phase) => {
      const activeTasks = phase.tasks.filter(t => t.status === 'Active').length;
      return sum + activeTasks;
    }, 0);

    updateProject(parseInt(projectId), {
      ...formData,
      allocatedBudget,
      activeTaskCount
    });
    setEditMode(false);
  };

  if (!project) {
    return <div className="loading">Loading project...</div>;
  }

  const allocatedBudget = formData.phases?.reduce((sum, phase) => sum + (phase.total || 0), 0) || 0;
  const activeTaskCount = formData.phases?.reduce((sum, phase) => {
    const activeTasks = phase.tasks?.filter(t => t.status === 'Active').length || 0;
    return sum + activeTasks;
  }, 0) || 0;

  return (
    <div className="project-details-container">
      <div className="details-header">
        <button onClick={() => navigate('/projects/all')} className="btn-back">
          <ArrowLeft size={20} /> Back to Projects
        </button>
        <h1>{project.name}</h1>
        <div className="header-actions">
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="btn-edit-mode">
              Edit Project
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="btn-save">
                Save Changes
              </button>
              <button onClick={() => setEditMode(false)} className="btn-cancel">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="details-layout">
        {/* LEFT SIDEBAR */}
        <div className="details-sidebar">
          <div className="details-card">
            <h3>PROJECT INFORMATION</h3>

            <div className="detail-item">
              <label>Project Name</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="detail-input"
                />
              ) : (
                <p>{formData.name}</p>
              )}
            </div>

            <div className="detail-item">
              <label>Tags</label>
              <div className="tags-display">
                {formData.tags?.map(tag => (
                  <span key={tag} className="tag-badge">{tag}</span>
                ))}
                {formData.tags?.length === 0 && <span className="no-data">No tags</span>}
              </div>
            </div>

            <div className="detail-item">
              <label>Due Date</label>
              {editMode ? (
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="detail-input"
                />
              ) : (
                <p>{formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}</p>
              )}
            </div>

            <div className="detail-item">
              <label>Total Budget Goal</label>
              {editMode ? (
                <input
                  type="number"
                  name="totalBudgetGoal"
                  value={formData.totalBudgetGoal}
                  onChange={handleChange}
                  className="detail-input"
                  placeholder="0"
                />
              ) : (
                <p>${formData.totalBudgetGoal?.toLocaleString() || '0'}</p>
              )}
            </div>
          </div>
        </div>

        {/* CENTER - PHASES & TASKS */}
        <div className="details-content">
          <div className="details-card">
            <h3>PHASES & TASKS</h3>

            <div className="phases-list">
              {formData.phases?.map((phase, phaseIndex) => (
                <div key={phase.id} className="phase-item">
                  <div
                    className="phase-header-detail"
                    onClick={() => setExpandedPhase(expandedPhase === phaseIndex ? -1 : phaseIndex)}
                  >
                    <div className="phase-title">
                      {expandedPhase === phaseIndex ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                      {editMode ? (
                        <input
                          type="text"
                          value={phase.name}
                          onChange={(e) => handlePhaseChange(phaseIndex, 'name', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="phase-name-input"
                        />
                      ) : (
                        <span>{phase.name}</span>
                      )}
                    </div>
                    <span className="phase-total">Total: ${phase.total?.toLocaleString() || '0'}</span>
                  </div>

                  {expandedPhase === phaseIndex && (
                    <div className="phase-tasks">
                      {phase.tasks?.map((task, taskIndex) => (
                        <div key={task.id} className="task-item-detail">
                          <div className="task-info">
                            {editMode ? (
                              <>
                                <input
                                  type="text"
                                  placeholder="Task name"
                                  value={task.name}
                                  onChange={(e) => handleTaskChange(phaseIndex, taskIndex, 'name', e.target.value)}
                                  className="task-name-input"
                                />
                                <input
                                  type="number"
                                  placeholder="Cost"
                                  value={task.cost}
                                  onChange={(e) => handleTaskChange(phaseIndex, taskIndex, 'cost', e.target.value)}
                                  className="task-cost-input"
                                />
                                <select
                                  value={task.status}
                                  onChange={(e) => handleTaskChange(phaseIndex, taskIndex, 'status', e.target.value)}
                                  className="task-status-input"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </>
                            ) : (
                              <>
                                <span className="task-name">{task.name}</span>
                                <span className="task-cost">${parseFloat(task.cost || 0).toLocaleString()}</span>
                                <span className={`task-status-badge ${task.status?.toLowerCase()}`}>
                                  {task.status}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - SUMMARY */}
        <div className="details-sidebar">
          <div className="details-card">
            <h3>BUDGET SUMMARY</h3>

            <div className="summary-stat">
              <label>Allocated Budget</label>
              <p className="stat-value">${allocatedBudget.toLocaleString()}</p>
            </div>

            <div className="summary-stat">
              <label>Budget Goal</label>
              <p className="stat-value">${formData.totalBudgetGoal?.toLocaleString() || '0'}</p>
            </div>

            {formData.totalBudgetGoal > 0 && (
              <div className="budget-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min((allocatedBudget / formData.totalBudgetGoal) * 100, 100)}%`
                    }}
                  />
                </div>
                <span className="progress-text">
                  {Math.round((allocatedBudget / formData.totalBudgetGoal) * 100)}%
                </span>
              </div>
            )}

            <div className="summary-stat">
              <label>Total Tasks</label>
              <p className="stat-value">
                {formData.phases?.reduce((sum, phase) => sum + (phase.tasks?.length || 0), 0) || 0}
              </p>
            </div>

            <div className="summary-stat">
              <label>Active Tasks</label>
              <p className="stat-value">{activeTaskCount}</p>
            </div>

            <div className="summary-stat">
              <label>Phases</label>
              <p className="stat-value">{formData.phases?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
