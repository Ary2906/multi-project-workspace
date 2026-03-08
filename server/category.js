// Category management module
const express = require('express');
const router = express.Router();

let categories = [
  'frontend',
  'backend',
  'database',
  'api',
  'testing',
  'documentation',
  'devops',
  'design',
  'mobile',
  'other'
];

// Get all categories
router.get('/', (req, res) => {
  res.json(categories);
});

// Add a new category
router.post('/', (req, res) => {
  console.log('Received new category:', req.body);
  let newCategory = req.body.category;
  console.log('New category:', newCategory);
  
  if (newCategory && !categories.includes(newCategory)) {
    categories.push(newCategory);
    res.status(201).json({ message: 'Category added successfully', categories });
  } else {
    res.status(400).json({ message: 'Category already exists or is invalid' });
  }
});

// Delete a category
router.delete('/:category', (req, res) => {
  const { category } = req.params;
  const index = categories.indexOf(category);
  
  if (index !== -1) {
    categories.splice(index, 1);
    res.json({ message: 'Category deleted successfully', categories });
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});

// Update a category
router.put('/:oldCategory', (req, res) => {
  const { oldCategory } = req.params;
  console.log('Received old category:', oldCategory);
  let newCategory = req.body.category;
  
  const index = categories.indexOf(oldCategory);
  if (index !== -1 && newCategory && !categories.includes(newCategory)) {
    categories[index] = newCategory;
    res.json({ message: 'Category updated successfully', categories });
  } else {
    res.status(400).json({ message: 'Category not found, new category is invalid, or new category already exists' });
  }
});

module.exports = router;
