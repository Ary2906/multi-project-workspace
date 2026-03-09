// Task management module
const express = require('express');
const router = express.Router();
const Task = require('./models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('project_id');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('project_id');
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task', error: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    console.log('Received new task:', req.body);
    const { title, description, project_id, status, assignee, priority, due_date } = req.body;
    
    if (!title || !project_id) {
      return res.status(400).json({ message: 'Title and project_id are required' });
    }

    const newTask = new Task({
      title,
      description: description || '',
      project_id,
      status: status || 'Active',
      assignee: assignee || null,
      priority: priority || 'Medium',
      due_date: due_date || null
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignee, priority, due_date } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (assignee !== undefined) updateData.assignee = assignee;
    if (priority) updateData.priority = priority;
    if (due_date) updateData.due_date = due_date;
    updateData.updated_at = new Date();

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (task) {
      res.json({ message: 'Task updated successfully', task });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (task) {
      res.json({ message: 'Task deleted successfully', task });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});

// Get all task statuses (reference data)
router.get('/statuses/list', (req, res) => {
  const taskStatuses = ['Active', 'Inactive', 'Blocked', 'Done'];
  res.json(taskStatuses);
});

module.exports = router;
