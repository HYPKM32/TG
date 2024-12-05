const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/info/:userId/:fridgeName', calendarController.get_fridgeinfo)

module.exports = router;