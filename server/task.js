// Task management module
const express = require('express');
const router = express.Router();

let taskStatuses = [
  'Active',
  'Inactive',
  'Blocked',
  'Done'
];

// Get all task statuses
router.get('/statuses', (req, res) => {
  res.json(taskStatuses);
});

// Add a new task status
router.post('/statuses', (req, res) => {
  console.log('Received new task status:', req.body);
  let newStatus = req.body.status;
  console.log('New task status:', newStatus);
  
  if (newStatus && !taskStatuses.includes(newStatus)) {
    taskStatuses.push(newStatus);
    res.status(201).json({ message: 'Task status added successfully', taskStatuses });
  } else {
    res.status(400).json({ message: 'Task status already exists or is invalid' });
  }
});

// Delete a task status
router.delete('/statuses/:status', (req, res) => {
  const { status } = req.params;
  const index = taskStatuses.indexOf(status);
  
  if (index !== -1) {
    taskStatuses.splice(index, 1);
    res.json({ message: 'Task status deleted successfully', taskStatuses });
  } else {
    res.status(404).json({ message: 'Task status not found' });
  }
});

// Update a task status
router.put('/statuses/:oldStatus', (req, res) => {
  const { oldStatus } = req.params;
  console.log('Received old task status:', oldStatus);
  let newStatus = req.body.status;
  
  const index = taskStatuses.indexOf(oldStatus);
  if (index !== -1 && newStatus && !taskStatuses.includes(newStatus)) {
    taskStatuses[index] = newStatus;
    res.json({ message: 'Task status updated successfully', taskStatuses });
  } else {
    res.status(400).json({ message: 'Task status not found, new status is invalid, or new status already exists' });
  }
});

module.exports = router;
