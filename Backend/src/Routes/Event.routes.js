const express = require('express');
const router = express.Router();
const EventService = require('../Services/EventService');
const verifyToken = require('../Middlewares/authMiddleware');
const authorizeRoles = require('../Middlewares/roleMiddleware');
const UserRoles= require("../Models/enums/UserRoles");

router.use(verifyToken);
// Create new event
router.post('/',authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER]), async (req, res) => {
  try {
    const event = await EventService.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/',authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER]),  async (req, res) => {
  try {
    // Extract query params with defaults
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      title,
      location,
      eventType,
      status,
      organizer
    } = req.query;

    // Build filters object
    const filters = {};
    if (title) filters.title = title;
    if (location) filters.location = location;
    if (eventType) filters.eventType = eventType;
    if (status) filters.status = status;
    if (organizer) filters.organizer = organizer;

    // Call service with parameters
    const events = await EventService.getAllEvents({
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
      filters
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// Get event by id
router.get('/:id', authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER]), async (req, res) => {
  try {
    const event = await EventService.getById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update event by id
router.put('/:id',authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER]),  async (req, res) => {
  try {
    const updatedEvent = await EventService.update(req.params.id, req.body);
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete event by id
router.delete('/:id',authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER]),  async (req, res) => {
  try {
    const deleteEvent= await EventService.delete(req.params.id);
    res.json(deleteEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
