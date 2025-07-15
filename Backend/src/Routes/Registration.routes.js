const express = require('express');
const router = express.Router();
const RegistrationService = require('../Services/RegistrationService');
const verifyToken = require('../Middlewares/authMiddleware');
const authorizeRoles= require('../Middlewares/roleMiddleware');
const UserRoles= require('../Models/enums/UserRoles');

router.use(verifyToken);

// Create new registration
router.post('/', authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER,UserRoles.PARTICIPANT]),async (req, res) => {
  try {
    const registration = await RegistrationService.create(req.body);
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/',authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER]), async (req, res) => {
  try {
    // Extract query parameters for pagination, sorting, and filtering
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId,
      eventId,
      status,
      fromDate,
      toDate,
    } = req.query;

    const result = await RegistrationService.getAll({
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
      filters: {
        userId,
        eventId,
        status,
        fromDate,
        toDate,
      },
    });

    res.status(200).json(result); // ✅ 200 OK for successful GET
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get registration by id
router.get('/:id',authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER,UserRoles.PARTICIPANT]), async (req, res) => {
  try {
    const registration = await RegistrationService.getById(req.params.id);
    res.json(registration);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update registration by id
router.put('/:id',authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER,UserRoles.PARTICIPANT]), async (req, res) => {
  try {
    const updatedRegistration = await RegistrationService.update(req.params.id, req.body);
    res.json(updatedRegistration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete registration by id
router.delete('/:id',authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER,UserRoles.PARTICIPANT]), async (req, res) => {
  try {
  const deleteRegistration=  await RegistrationService.delete(req.params.id);
    res.send(deleteRegistration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
