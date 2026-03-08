const Tag = require('./models/Tag');

module.exports = (app) => {
  // Seed default tags if database is empty
  const seedTags = async () => {
    try {
      const count = await Tag.countDocuments();
      if (count === 0) {
        const defaultTags = [
          'urgent', 'high-priority', 'medium-priority', 'low-priority',
          'frontend', 'backend', 'database', 'api', 'testing',
          'documentation', 'bug-fix', 'feature', 'enhancement', 'refactoring',
          'important', 'critical'
        ];
        await Tag.insertMany(defaultTags.map(name => ({ name })));
        console.log('Default tags seeded');
      }
    } catch (error) {
      console.error('Error seeding tags:', error);
    }
  };
  seedTags();

  app.get('/api/tags', async (req, res) => {
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ tags: tags.map(t => t.name) });
  });

  app.post('/api/tags', async (req, res) => {
    const { tag } = req.body;
    if (tag) {
      const exists = await Tag.findOne({ name: tag });
      if (!exists) {
        await Tag.create({ name: tag });
      }
    }
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ tags: tags.map(t => t.name) });
  });

  app.delete('/api/tags/:tag', async (req, res) => {
    const tagToDelete = req.params.tag;
    await Tag.deleteOne({ name: tagToDelete });
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ tags: tags.map(t => t.name) });
  });
};
