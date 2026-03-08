import { useState, useEffect } from 'react';
import './Settings.css';
import { CRUDSection } from './CRUDSection';

export const Settings = () => {
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    accentColor: localStorage.getItem('accentColor') || '#4CAF50',
    defaultProjectTag: localStorage.getItem('defaultProjectTag') || '',
    requireProjectDeadline: localStorage.getItem('requireProjectDeadline') === 'true',
    defaultTaskStatus: localStorage.getItem('defaultTaskStatus') || ''
  });

  // CRUD State for project and task configurations
  const [projectCategories, setProjectCategories] = useState(
    JSON.parse(localStorage.getItem('projectCategories')) || []
  );
  const [projectTags, setProjectTags] = useState(
    JSON.parse(localStorage.getItem('projectTags')) || []
  );
  const [projectStatus, setProjectStatus] = useState(
    JSON.parse(localStorage.getItem('projectStatus')) || []
  );
  const [taskStatus, setTaskStatus] = useState(
    JSON.parse(localStorage.getItem('taskStatus')) || []
  );

  // Input states for CRUD forms
  const [inputValues, setInputValues] = useState({
    projectCategories: '',
    projectTags: '',
    projectStatus: '',
    taskStatus: ''
  });

  // Edit mode states
  const [editMode, setEditMode] = useState({
    projectCategories: null,
    projectTags: null,
    projectStatus: null,
    taskStatus: null
  });

  const [editValues, setEditValues] = useState({
    projectCategories: '',
    projectTags: '',
    projectStatus: '',
    taskStatus: ''
  });

  const ACCENT_COLORS = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FF5722', // Red
    '#FF9800', // Orange
    '#FFC107', // Amber
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
  ];

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    
    // Save all settings to localStorage
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('accentColor', settings.accentColor);
    localStorage.setItem('defaultProjectTag', settings.defaultProjectTag);
    localStorage.setItem('requireProjectDeadline', settings.requireProjectDeadline);
    localStorage.setItem('defaultTaskStatus', settings.defaultTaskStatus);
  }, [settings]);

  // Save CRUD items to localStorage
  useEffect(() => {
    localStorage.setItem('projectCategories', JSON.stringify(projectCategories));
    localStorage.setItem('projectTags', JSON.stringify(projectTags));
    localStorage.setItem('projectStatus', JSON.stringify(projectStatus));
    localStorage.setItem('taskStatus', JSON.stringify(taskStatus));
  }, [projectCategories, projectTags, projectStatus, taskStatus]);

  const handleThemeChange = (theme) => {
    setSettings(prev => ({
      ...prev,
      theme
    }));
  };

  const handleAccentColorChange = (color) => {
    setSettings(prev => ({
      ...prev,
      accentColor: color
    }));
  };

  const handleToggleDeadline = () => {
    setSettings(prev => ({
      ...prev,
      requireProjectDeadline: !prev.requireProjectDeadline
    }));
  };

  const handleSelectChange = (e, key) => {
    setSettings(prev => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  // CRUD Helper Functions
  const getCRUDList = (listName) => {
    const lists = {
      projectCategories,
      projectTags,
      projectStatus,
      taskStatus
    };
    return lists[listName] || [];
  };

  const setCRUDList = (listName, newList) => {
    if (listName === 'projectCategories') setProjectCategories(newList);
    else if (listName === 'projectTags') setProjectTags(newList);
    else if (listName === 'projectStatus') setProjectStatus(newList);
    else if (listName === 'taskStatus') setTaskStatus(newList);
  };

  const addItem = (listName) => {
    const value = inputValues[listName].trim();
    if (!value) return;
    setCRUDList(listName, [...getCRUDList(listName), value]);
    setInputValues(prev => ({ ...prev, [listName]: '' }));
  };

  const deleteItem = (listName, index) => {
    setCRUDList(listName, getCRUDList(listName).filter((_, i) => i !== index));
  };

  const startEdit = (listName, index, currentValue) => {
    setEditMode(prev => ({ ...prev, [listName]: index }));
    setEditValues(prev => ({ ...prev, [listName]: currentValue }));
  };

  const cancelEdit = (listName) => {
    setEditMode(prev => ({ ...prev, [listName]: null }));
    setEditValues(prev => ({ ...prev, [listName]: '' }));
  };

  const updateItem = (listName, index) => {
    const newValue = editValues[listName].trim();
    if (!newValue) return;
    const list = getCRUDList(listName);
    setCRUDList(listName, list.map((item, i) => i === index ? newValue : item));
    cancelEdit(listName);
  };

  const handleInputChange = (e, listName) => {
    setInputValues(prev => ({ ...prev, [listName]: e.target.value }));
  };

  const handleEditValueChange = (e, listName) => {
    setEditValues(prev => ({ ...prev, [listName]: e.target.value }));
  };

  return (
    <div className="settings-container">
      {/* Left Column - Appearance & Interface */}
      <div className="settings-card">
        <h2>Appearance & Interface</h2>
        
        <div className="settings-group">
          <label className="setting-label">Theme</label>
          <div className="theme-buttons">
            <button
              type="button"
              className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              ☀️ Light
            </button>
            <button
              type="button"
              className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              🌙 Dark
            </button>
            <button
              type="button"
              className={`theme-btn ${settings.theme === 'system' ? 'active' : ''}`}
              onClick={() => handleThemeChange('system')}
            >
              ⚙️ System
            </button>
          </div>
        </div>

        <div className="settings-group">
          <label className="setting-label">Accent Color</label>
          <div className="color-palette">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-btn ${settings.accentColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleAccentColorChange(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Workspace & Projects */}
      <div className="settings-column">
        <div className="settings-card">
          <h2>Workspace & Projects</h2>
          
          <div className="settings-group">
            <label className="setting-label">Default Project Tag</label>
            <select 
              value={settings.defaultProjectTag}
              onChange={(e) => handleSelectChange(e, 'defaultProjectTag')}
              className="settings-select"
            >
              <option value="">Select a tag</option>
              {projectTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="settings-group toggle-group">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.requireProjectDeadline}
                onChange={handleToggleDeadline}
              />
              <span>Require Project Deadline</span>
            </label>
          </div>

          <CRUDSection
            label="Define Project Categories"
            items={projectCategories}
            inputValue={inputValues.projectCategories}
            editMode={editMode.projectCategories}
            editValue={editValues.projectCategories}
            listName="projectCategories"
            onInputChange={handleInputChange}
            onEditValueChange={handleEditValueChange}
            onAdd={addItem}
            onDelete={deleteItem}
            onStartEdit={startEdit}
            onUpdateItem={updateItem}
            onCancelEdit={cancelEdit}
          />

          <CRUDSection
            label="Define Custom Tags"
            items={projectTags}
            inputValue={inputValues.projectTags}
            editMode={editMode.projectTags}
            editValue={editValues.projectTags}
            listName="projectTags"
            onInputChange={handleInputChange}
            onEditValueChange={handleEditValueChange}
            onAdd={addItem}
            onDelete={deleteItem}
            onStartEdit={startEdit}
            onUpdateItem={updateItem}
            onCancelEdit={cancelEdit}
          />

          <CRUDSection
            label="Define Project Status"
            items={projectStatus}
            inputValue={inputValues.projectStatus}
            editMode={editMode.projectStatus}
            editValue={editValues.projectStatus}
            listName="projectStatus"
            onInputChange={handleInputChange}
            onEditValueChange={handleEditValueChange}
            onAdd={addItem}
            onDelete={deleteItem}
            onStartEdit={startEdit}
            onUpdateItem={updateItem}
            onCancelEdit={cancelEdit}
          />
        </div>

        <div className="settings-card">
          <h2>Task & Workflow</h2>
          
          <div className="settings-group">
            <label className="setting-label">Default Task Status</label>
            <select 
              value={settings.defaultTaskStatus}
              onChange={(e) => handleSelectChange(e, 'defaultTaskStatus')}
              className="settings-select"
            >
              <option value="">Select a status</option>
              {taskStatus.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <CRUDSection
            label="Define Task Statuses"
            items={taskStatus}
            inputValue={inputValues.taskStatus}
            editMode={editMode.taskStatus}
            editValue={editValues.taskStatus}
            listName="taskStatus"
            onInputChange={handleInputChange}
            onEditValueChange={handleEditValueChange}
            onAdd={addItem}
            onDelete={deleteItem}
            onStartEdit={startEdit}
            onUpdateItem={updateItem}
            onCancelEdit={cancelEdit}
          />
        </div>
      </div>
    </div>
  );
};
