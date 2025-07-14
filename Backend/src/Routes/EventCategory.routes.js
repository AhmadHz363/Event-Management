const express = require('express');
const router = express.Router();
const EventCategoryService = require('../Services/EventCategoryServices');

// Create new category
router.post('/', async (req, res) => {
  try {
    const category = await EventCategoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get category by id
router.get('/:id', async (req, res) => {
  try {
    const category = await EventCategoryService.getById(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update category by id
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await EventCategoryService.update(req.params.id, req.body);
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete category by id
router.delete('/:id', async (req, res) => {
  try {
    await EventCategoryService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
