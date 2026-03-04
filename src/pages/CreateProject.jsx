import { useState } from 'react';
import './CreateProject.css';

export const CreateProject = ({ onProjectCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onProjectCreate(formData);
      setFormData({ name: '', description: '', dueDate: '',category: '' });
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
              <label htmlFor="tags">Tags</label>
              <select 
  id="tags" 
  name="tags" 
  multiple 
  value={formData.tags} // Array of strings
  onChange={(e) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, tags: values });
  }}
  className="form-control"
>
  <option value="work">work</option>
  <option value="chill">chill</option>
  <option value="no work">no work</option>
  <option value="no chill">no chill</option>
  <option value="chill chill">chill chill</option>
  <option value="work work">work work</option>
</select>
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
