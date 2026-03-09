// Tag management module
const express = require('express');
const router = express.Router();
const Tag = require('./models/Tag');

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tags', error: err.message });
  }
});

// Get a specific tag by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findById(id);
    if (tag) {
      res.json(tag);
    } else {
      res.status(404).json({ message: 'Tag not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tag', error: err.message });
  }
});

// Add a new tag
router.post('/', async (req, res) => {
  try {
    console.log('Received new tag:', req.body);
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const newTag = new Tag({
      name,
      description: description || '',
      color: color || '#000000'
    });

    await newTag.save();
    res.status(201).json({ message: 'Tag added successfully', tag: newTag });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Tag already exists' });
    } else {
      res.status(500).json({ message: 'Error creating tag', error: err.message });
    }
  }
});

// Delete a tag
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    if (tag) {
      res.json({ message: 'Tag deleted successfully', tag });
    } else {
      res.status(404).json({ message: 'Tag not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting tag', error: err.message });
  }
});

// Update a tag
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (color) updateData.color = color;
    updateData.updated_at = new Date();

    const tag = await Tag.findByIdAndUpdate(id, updateData, { new: true });
    if (tag) {
      res.json({ message: 'Tag updated successfully', tag });
    } else {
      res.status(404).json({ message: 'Tag not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating tag', error: err.message });
  }
});

module.exports = router;
