const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/date/:userId/:fridgeName', calendarController.get_dateinfo)
router.get('/list/:userId', calendarController.get_fridgelist)
router.get('/dayend/:userId', calendarController.get_dayend)

module.exports = router;