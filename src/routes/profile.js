const express = require('express');
const router = express.Router();
const profileController = require('../app/controllers/ProfileController');

router.get('/', profileController.index);

module.exports = router;