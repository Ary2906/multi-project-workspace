// Project management module
const express = require('express');
const router = express.Router();
const Project = require('./models/Project');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
});

// Get a specific project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    console.log('Received new project:', JSON.stringify(req.body, null, 2));
    const { project_name, description, category, budget, tasks, tags, project_status, due_date } = req.body;
    
    if (!project_name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const newProject = new Project({
      project_name,
      description: description || '',
      category: category || 'uncategorized',
      budget: budget || 0,
      tasks: tasks || [],
      tags: tags || [],
      project_status: project_status || 'pending',
      due_date: due_date || null
    });

    console.log('Project object created:', newProject);
    await newProject.save();
    console.log('Project saved successfully:', newProject._id);
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (err) {
    console.error('Error creating project:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { project_name, description, category, budget, tasks, tags, project_status, due_date } = req.body;
    
    const updateData = {};
    if (project_name) updateData.project_name = project_name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (budget !== undefined) updateData.budget = budget;
    if (tasks) updateData.tasks = tasks;
    if (tags) updateData.tags = tags;
    if (project_status) updateData.project_status = project_status;
    if (due_date) updateData.due_date = due_date;
    updateData.updated_at = new Date();

    const project = await Project.findByIdAndUpdate(id, updateData, { new: true });
    if (project) {
      res.json({ message: 'Project updated successfully', project });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating project', error: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (project) {
      res.json({ message: 'Project deleted successfully', project });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
});

module.exports = router;
