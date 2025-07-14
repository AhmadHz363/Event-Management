const express = require('express');
const router = express.Router();
const RegistrationService = require('../Services/RegistrationService');

// Create new registration
router.post('/', async (req, res) => {
  try {
    const registration = await RegistrationService.create(req.body);
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get registration by id
router.get('/:id', async (req, res) => {
  try {
    const registration = await RegistrationService.getById(req.params.id);
    res.json(registration);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update registration by id
router.put('/:id', async (req, res) => {
  try {
    const updatedRegistration = await RegistrationService.update(req.params.id, req.body);
    res.json(updatedRegistration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete registration by id
router.delete('/:id', async (req, res) => {
  try {
    await RegistrationService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
