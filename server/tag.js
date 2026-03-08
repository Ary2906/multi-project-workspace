// Tag management module
const express = require('express');
const router = express.Router();

let tags = [
  'urgent', 'high-priority', 'medium-priority', 'low-priority',
  'frontend', 'backend', 'database', 'api', 'testing',
  'documentation', 'bug-fix', 'feature', 'enhancement', 'refactoring',
  'important', 'critical'
];

// Get all tags
router.get('/', (req, res) => {
  res.json(tags);
});

// Add a new tag
router.post('/', (req, res) => {
  console.log(req.body);
  let newTag = req.body.tag;
  console.log('Received new tag:', newTag);
  if (newTag && !tags.includes(newTag)) {
    tags.push(newTag);
    res.status(201).json({ message: 'Tag added successfully', tags });
  } else {
    res.status(400).json({ message: 'Tag already exists or is invalid' });
  }
});

// Delete a tag
router.delete('/:tag', (req, res) => {
  const { tag } = req.params;
  const index = tags.indexOf(tag);
  if (index !== -1) {
    tags.splice(index, 1);
    res.json({ message: 'Tag deleted successfully', tags });
  } else {
    res.status(404).json({ message: 'Tag not found' });
  }
});

// Update a tag
router.put('/:oldTag', (req, res) => {
  const { oldTag } = req.params;
  console.log('Received old tag:', oldTag);
  let newTag = req.body.tag;
  const index = tags.indexOf(oldTag);
  if (index !== -1 && newTag && !tags.includes(newTag)) {
    tags[index] = newTag;
    res.json({ message: 'Tag updated successfully', tags });
  } else {
    res.status(400).json({ message: 'Tag not found, new tag is invalid, or new tag already exists' });
  }
});

module.exports = router;
