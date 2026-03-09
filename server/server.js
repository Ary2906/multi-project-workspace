const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Tag = require('./models/Tag');
const Category = require('./models/Category');

// Import route modules
const tagRoutes = require('./tag');
const projectRoutes = require('./project');
const categoryRoutes = require('./category');
const taskRoutes = require('./task');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/multi-project';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    seedDatabase();
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Seed default data
const seedDatabase = async () => {
  try {
    // Check if categories exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: 'frontend', description: '', color: '#FF6B6B' },
        { name: 'backend', description: '', color: '#4ECDC4' },
        { name: 'database', description: '', color: '#45B7D1' },
        { name: 'api', description: '', color: '#FFA07A' },
        { name: 'testing', description: '', color: '#98D8C8' },
        { name: 'documentation', description: '', color: '#F7DC6F' },
        { name: 'devops', description: '', color: '#BB8FCE' },
        { name: 'design', description: '', color: '#F8B88B' },
        { name: 'mobile', description: '', color: '#85C1E2' },
        { name: 'other', description: '', color: '#D5D8DC' }
      ];
      await Category.insertMany(defaultCategories);
      console.log('Default categories seeded');
    }

    // Check if tags exist
    const tagCount = await Tag.countDocuments();
    if (tagCount === 0) {
      const defaultTags = [
        { name: 'urgent', description: '', color: '#FF0000' },
        { name: 'high-priority', description: '', color: '#FF6B35' },
        { name: 'medium-priority', description: '', color: '#FFA500' },
        { name: 'low-priority', description: '', color: '#90EE90' },
        { name: 'frontend', description: '', color: '#FF6B6B' },
        { name: 'backend', description: '', color: '#4ECDC4' },
        { name: 'database', description: '', color: '#45B7D1' },
        { name: 'api', description: '', color: '#FFA07A' },
        { name: 'testing', description: '', color: '#98D8C8' },
        { name: 'documentation', description: '', color: '#F7DC6F' },
        { name: 'bug-fix', description: '', color: '#FF1493' },
        { name: 'feature', description: '', color: '#32CD32' },
        { name: 'enhancement', description: '', color: '#00CED1' },
        { name: 'refactoring', description: '', color: '#9370DB' },
        { name: 'important', description: '', color: '#DC143C' },
        { name: 'critical', description: '', color: '#8B0000' }
      ];
      await Tag.insertMany(defaultTags);
      console.log('Default tags seeded');
    }
  } catch (error) {
    console.log('Error seeding database:', error.message);
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the AI Image Generator API');
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Route modules
app.use('/api/tags', tagRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
