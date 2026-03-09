// Category management module
const express = require('express');
const router = express.Router();
const Category = require('./models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
});

// Get a specific category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
});

// Add a new category
router.post('/', async (req, res) => {
  try {
    console.log('Received new category:', req.body);
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const newCategory = new Category({
      name,
      description: description || '',
      color: color || '#000000'
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Category already exists' });
    } else {
      res.status(500).json({ message: 'Error creating category', error: err.message });
    }
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (category) {
      res.json({ message: 'Category deleted successfully', category });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (color) updateData.color = color;
    updateData.updated_at = new Date();

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (category) {
      res.json({ message: 'Category updated successfully', category });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
});

module.exports = router;
