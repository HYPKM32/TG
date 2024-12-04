const express = require('express');
const router = express.Router();
const fridgeController = require('../controllers/fridgeController');


router.get('/:fridgeName',fridgeController.get_fridgeinfo)


module.exports = router;