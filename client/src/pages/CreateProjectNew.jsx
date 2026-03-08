import { useState, useEffect } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import './CreateProjectNew.css';

export const CreateProjectNew = ({ onProjectCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    tags: [],
    dueDate: '',
    totalBudgetGoal: 0,
    phases: [{ id: 1, name: 'Phase 1', tasks: [], total: 0 }],
    customTagInput: '',
    dropdownValue: ''
  });

  const [expandedPhase, setExpandedPhase] = useState(0);
  const [phaseIdCounter, setPhaseIdCounter] = useState(2);
  const [taskIdCounter, setTaskIdCounter] = useState(1);

  // Load dynamic data from localStorage
  const [projectTags, setProjectTags] = useState([
    'urgent', 'high-priority', 'medium-priority', 'low-priority',
    'frontend', 'backend', 'database', 'api', 'testing',
    'documentation', 'bug-fix', 'feature', 'enhancement', 'refactoring',
    'important', 'critical'
  ]);

  useEffect(() => {
    
    const savedTags = JSON.parse(localStorage.getItem('projectTags')) || [];
    if (savedTags.length > 0) {
      setProjectTags(savedTags);
    }
  }, []);

  // Calculate allocated budget
  const allocatedBudget = formData.phases.reduce((sum, phase) => sum + phase.total, 0);

  // Calculate active task count
  const activeTaskCount = formData.phases.reduce((sum, phase) => {
    const activeTasks = phase.tasks.filter(t => t.status === 'Active').length;
    return sum + activeTasks;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagFromDropdown = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        dropdownValue: ''
      }));
    }
  };

  const handleAddCustomTag = () => {
    const customTag = formData.customTagInput.trim();
    if (customTag && !formData.tags.includes(customTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag],
        customTagInput: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Phase Management
  const addPhase = () => {
    const newPhase = {
      id: phaseIdCounter,
      name: `Phase ${phaseIdCounter}`,
      tasks: [],
      total: 0
    };
    setPhaseIdCounter(phaseIdCounter + 1);
    setFormData(prev => ({
      ...prev,
      phases: [...prev.phases, newPhase]
    }));
  };

  const deletePhase = (phaseIndex) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.filter((_, i) => i !== phaseIndex)
    }));
  };

  const updatePhase = (phaseIndex, field, value) => {
    setFormData(prev => {
      const newPhases = [...prev.phases];
      newPhases[phaseIndex] = {
        ...newPhases[phaseIndex],
        [field]: value
      };
      return { ...prev, phases: newPhases };
    });
  };

  // Task Management
  const addTask = (phaseIndex) => {
    const newTask = {
      id: taskIdCounter,
      name: '',
      cost: 0,
      status: 'Active'
    };
    setTaskIdCounter(taskIdCounter + 1);
    setFormData(prev => {
      const newPhases = [...prev.phases];
      // Create a copy of the phase and tasks to avoid mutation
      newPhases[phaseIndex] = {
        ...newPhases[phaseIndex],
        tasks: [...newPhases[phaseIndex].tasks, newTask]
      };
      newPhases[phaseIndex].total = newPhases[phaseIndex].tasks.reduce(
        (sum, t) => sum + parseFloat(t.cost || 0), 0
      );
      return { ...prev, phases: newPhases };
    });
  };

  const deleteTask = (phaseIndex, taskIndex) => {
    setFormData(prev => {
      const newPhases = [...prev.phases];
      newPhases[phaseIndex].tasks.splice(taskIndex, 1);
      newPhases[phaseIndex].total = newPhases[phaseIndex].tasks.reduce((sum, t) => sum + parseFloat(t.cost || 0), 0);
      return { ...prev, phases: newPhases };
    });
  };

  const updateTask = (phaseIndex, taskIndex, field, value) => {
    setFormData(prev => {
      const newPhases = [...prev.phases];
      newPhases[phaseIndex].tasks[taskIndex] = {
        ...newPhases[phaseIndex].tasks[taskIndex],
        [field]: value
      };
      newPhases[phaseIndex].total = newPhases[phaseIndex].tasks.reduce((sum, t) => sum + parseFloat(t.cost || 0), 0);
      return { ...prev, phases: newPhases };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onProjectCreate({
        ...formData,
        allocatedBudget,
        activeTaskCount
      });
      setFormData({
        name: '',
        tags: [],
        dueDate: '',
        totalBudgetGoal: 0,
        phases: [{ id: 1, name: 'Phase 1', tasks: [], total: 0 }],
        customTagInput: '',
        dropdownValue: ''
      });
      setPhaseIdCounter(2);
      setTaskIdCounter(1);
    }
  };

  return (
    <div className="create-project-container-new">
      <div className="create-project-header">
        <h1>CONFIGURE NEW PROJECT WORKSPACE</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-layout">
          {/* LEFT SIDEBAR - PROJECT BASICS */}
          <div className="left-sidebar">
            <div className="form-card">
              <h3 className="card-title">PROJECT BASICS</h3>

              <div className="form-group">
                <label htmlFor="name">Project Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Zenith Product Launch"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tag</label>
                <select
                  value={formData.dropdownValue}
                  onChange={(e) => handleTagFromDropdown(e.target.value)}
                  className="tag-dropdown"
                >
                  <option value="">Add Tag...</option>
                  {projectTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                {formData.tags.length > 0 && (
                  <div className="selected-tags">
                    {formData.tags.map(tag => (
                      <span key={tag} className="tag-badge">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="tag-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Overall Project Deadline</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* CENTER - TASK-BASED BUDGETING */}
          <div className="center-content">
            <div className="form-card">
              <h3 className="card-title">TASK-BASED BUDGETING & CONFIGURATION</h3>
              <p className="card-subtitle">HIERARCHICAL TASK BREAKDOWN & COST ALLOCATION</p>

              <div className="phases-container">
                {formData.phases.map((phase, phaseIndex) => (
                  <div key={phase.id} className="phase-section">
                    <div
                      className="phase-header"
                      onClick={() => setExpandedPhase(expandedPhase === phaseIndex ? -1 : phaseIndex)}
                    >
                      <div className="phase-title-section">
                        {expandedPhase === phaseIndex ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                        <input
                          type="text"
                          className="phase-name-input"
                          value={phase.name}
                          onChange={(e) => updatePhase(phaseIndex, 'name', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="phase-info">
                        <span className="phase-total">Total: ${phase.total.toLocaleString()}</span>
                        {phaseIndex > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePhase(phaseIndex);
                            }}
                            className="btn-delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {expandedPhase === phaseIndex && (
                      <div className="phase-content">
                        <div className="tasks-table-header">
                          <span>Name</span>
                          <span>Estimated Cost</span>
                          <span>Status</span>
                          <span></span>
                        </div>

                        {phase.tasks.map((task, taskIndex) => (
                          <div key={task.id} className="task-row">
                            <input
                              type="text"
                              placeholder="Task name"
                              value={task.name}
                              onChange={(e) => updateTask(phaseIndex, taskIndex, 'name', e.target.value)}
                              className="task-input"
                            />
                            <input
                              type="number"
                              placeholder="0"
                              value={task.cost}
                              onChange={(e) => updateTask(phaseIndex, taskIndex, 'cost', parseFloat(e.target.value) || 0)}
                              className="task-cost"
                            />
                            <select
                              value={task.status}
                              onChange={(e) => updateTask(phaseIndex, taskIndex, 'status', e.target.value)}
                              className="task-status"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Completed">Completed</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => deleteTask(phaseIndex, taskIndex)}
                              className="btn-task-delete"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addTask(phaseIndex)}
                          className="btn-add-task"
                        >
                          <Plus size={16} /> Add Task to Phase
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={addPhase} className="btn-add-phase">
                <Plus size={16} /> Add Milestone/Phase
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR - BUDGET SUMMARY */}
          <div className="right-sidebar">
            <div className="form-card">
              <h3 className="card-title">PROJECT BUDGET ALLOCATION<br/>SUMMARY</h3>

              <div className="summary-item">
                <label>Total Overall Project Goal</label>
                <span className="summary-label">(optional)</span>
                <input
                  type="number"
                  name="totalBudgetGoal"
                  value={formData.totalBudgetGoal}
                  onChange={handleChange}
                  placeholder="0"
                  className="summary-input"
                />
              </div>

              <div className="summary-item">
                <label>Allocated Budget (Sum of Tasks)</label>
                <div className="budget-bar-container">
                  <div className="budget-bar">
                    <div
                      className="budget-fill"
                      style={{
                        width: formData.totalBudgetGoal
                          ? `${Math.min((allocatedBudget / formData.totalBudgetGoal) * 100, 100)}%`
                          : '0%'
                      }}
                    />
                  </div>
                  <span className="budget-text">
                    ${allocatedBudget.toLocaleString()} / ${formData.totalBudgetGoal ? formData.totalBudgetGoal.toLocaleString() : '0'}
                  </span>
                </div>
              </div>

              <div className="summary-item">
                <label>Planned Cost Allocation</label>
                <span className="summary-value">${allocatedBudget.toLocaleString()}</span>
                <span className="summary-detail">${allocatedBudget.toLocaleString()} planned</span>
              </div>

              <div className="summary-item">
                <label>Active Task Count</label>
                <span className="summary-value">{activeTaskCount} Active, {formData.phases.reduce((sum, phase) => sum + (phase.tasks.length - (phase.tasks.filter(t => t.status === 'Active').length)), 0)} Inactive (prominent)</span>
              </div>

              <div className="summary-item">
                <label>Estimated Deadline</label>
                <span className="summary-detail">Calculated from task deadlines if added</span>
              </div>

              <button type="submit" className="btn-create-project">
                Create Project
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
