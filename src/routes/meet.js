const express = require('express');
const router = express.Router();
const meetController = require('../app/controllers/MeetController');

router.get('/', meetController.index);

router.get('/whiteboard', meetController.whiteboard);

module.exports = router;
