const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController');

router.get('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.post('/register', AuthController.register);

module.exports = router;
