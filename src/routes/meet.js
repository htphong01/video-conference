const express = require('express');
const router = express.Router();
const meetController = require('../app/controllers/MeetController');

router.get('/', meetController.index);
router.post('/', meetController.create);
router.get('/whiteboard', meetController.whiteboard);
router.get('/:id', meetController.show);
router.post('/invite', meetController.invite);
router.post('/check-owner', meetController.checkOwner);


module.exports = router;
