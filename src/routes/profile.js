const express = require('express');
const router = express.Router();
const profileController = require('../app/controllers/ProfileController');

router.put('/', profileController.update);
router.get('/', profileController.index);

module.exports = router;
