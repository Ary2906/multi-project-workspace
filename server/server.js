const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import route modules
const tagRoutes = require('./tag');
const projectRoutes = require('./project');
const categoryRoutes = require('./category');
const taskRoutes = require('./task');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
