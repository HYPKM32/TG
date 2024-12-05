const express = require('express');
const router = express.Router();
const fridgeController = require('../controllers/fridgeController');


router.get('/info/:userId/:fridgeName',fridgeController.get_fridgeinfo)
router.post('/add/:userId', fridgeController.add_fridge)
router.get('/list/:userId', fridgeController.list_fridge)


module.exports = router;