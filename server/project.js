// Project management module
const express = require('express');
const router = express.Router();

let projects = [];

// Get all projects
router.get('/', (req, res) => {
  res.json(projects);
});

// Get a specific project by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.project_id === parseInt(id));
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

// Create a new project
router.post('/', (req, res) => {
  console.log('Received new project:', req.body);
  const { project_name, description, category, budget, tasks, tags, project_status, due_date } = req.body;
  
  if (!project_name || !description) {
    return res.status(400).json({ message: 'Project name and description are required' });
  }

  const newProject = {
    project_id: projects.length > 0 ? Math.max(...projects.map(p => p.project_id)) + 1 : 1,
    project_name,
    description,
    category: category || 'uncategorized',
    budget: budget || 0,
    tasks: tasks || [],
    tags: tags || [],
    project_status: project_status || 'pending',
    due_date: due_date || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  projects.push(newProject);
  res.status(201).json({ message: 'Project created successfully', project: newProject });
});

// Update a project
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.project_id === parseInt(id));
  
  if (projectIndex === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const { project_name, description, category, budget, tasks, tags, project_status, due_date } = req.body;
  
  projects[projectIndex] = {
    ...projects[projectIndex],
    ...(project_name && { project_name }),
    ...(description && { description }),
    ...(category && { category }),
    ...(budget !== undefined && { budget }),
    ...(tasks && { tasks }),
    ...(tags && { tags }),
    ...(project_status && { project_status }),
    ...(due_date && { due_date }),
    updated_at: new Date().toISOString()
  };

  res.json({ message: 'Project updated successfully', project: projects[projectIndex] });
});

// Delete a project
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.project_id === parseInt(id));
  
  if (projectIndex === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const deletedProject = projects.splice(projectIndex, 1);
  res.json({ message: 'Project deleted successfully', project: deletedProject[0] });
});

module.exports = router;
