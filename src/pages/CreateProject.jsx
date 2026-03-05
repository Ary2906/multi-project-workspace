import { useState } from 'react';
import './CreateProject.css';

export const CreateProject = ({ onProjectCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    tags: [],
    customTagInput: '',
    dropdownValue: ''
  });

  const PREDEFINED_TAGS = ['corporate', 'public', 'personal', 'internship', 'commercial', 'retail'];
  
  const DROPDOWN_TAGS = [
    'urgent',
    'high-priority',
    'medium-priority',
    'low-priority',
    'frontend',
    'backend',
    'database',
    'api',
    'testing',
    'documentation',
    'bug-fix',
    'feature',
    'enhancement',
    'refactoring',
    'important',
    'critical'
  ];

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

  const handleTagToggle = (tag) => {
    setFormData(prev => {
      const isSelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isSelected 
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      };
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onProjectCreate(formData);
      setFormData({ name: '', description: '', dueDate: '', category: '', tags: [], customTagInput: '', dropdownValue: '' });
    }
  };

   

  return (
    <div className="create-project-container">
      <div className="create-project-card">
        <h2>Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className='category'>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" onChange={handleChange}>
                <option value="">Select category</option>
                <option value="Marketing">Marketing</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Research">Research</option>
              </select>
            </div>
          </div>

          <div className='tags'>
            <div className="form-group">
              <label>Tags</label>
              
              <div className="tags-section">
                {/* Dropdown Tag Selection */}
                <div className="dropdown-tag-section">
                  <label className="tags-label">Quick Select Tags:</label>
                  <select
                    value={formData.dropdownValue}
                    onChange={(e) => handleTagFromDropdown(e.target.value)}
                    className="tag-dropdown"
                  >
                    <option value="">Choose a tag from list...</option>
                    {DROPDOWN_TAGS.map(tag => (
                      <option key={tag} value={tag} style={formData.tags.includes(tag) ? { backgroundColor: 'lightgray', color: 'black' } : {}}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Tag Input */}
                <div className="custom-tag-input">
                  <label className="tags-label">Add Custom Tag:</label>
                  <div className="input-group">
                    <input
                      type="text"
                      value={formData.customTagInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, customTagInput: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                      placeholder="Type custom tag and press Enter"
                      className="custom-tag-input-field"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="btn-add-tag"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Selected Tags Display */}
                {formData.tags.length > 0 && (
                  <div className="selected-tags-display">
                    <label className="tags-label">Selected Tags:</label>
                    <div className="selected-tags">
                      {formData.tags.map(tag => (
                        <div key={tag} className="tag-chip">
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="btn-remove-tag"
                            aria-label={`Remove ${tag}`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-submit">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};
