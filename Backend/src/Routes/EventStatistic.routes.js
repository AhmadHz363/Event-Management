const express = require('express');
const router = express.Router();
const EventStatisticServices = require('../Services/EventStatisticServices');
const verifyToken = require('../Middlewares/authMiddleware'); 
const authorizeRoles= require('../Middlewares/roleMiddleware');
const UserRoles= require('../Models/enums/UserRoles');

router.use(verifyToken);

router.get('/events/count', authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER,UserRoles.PARTICIPANT]), async (req, res) => {
  try {
    const count = await EventStatisticServices.getEventCount();
    res.json({ totalEvents: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/events/status', authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER,UserRoles.PARTICIPANT]), async (req, res) => {
  try {
    const breakdown = await EventStatisticServices.getEventStatusBreakdown();
    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/registrations/trends', authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER,UserRoles.PARTICIPANT]), async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const trends = await EventStatisticServices.getRegistrationTrends({ fromDate, toDate });
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events/popular', authorizeRoles([UserRoles.ADMIN, UserRoles.ORGANIZER,UserRoles.PARTICIPANT]), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const popularEvents = await EventStatisticServices.getPopularEvents(limit);
    res.json(popularEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
