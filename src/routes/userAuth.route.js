const express = require('express');

const userAuthController = require('../controllers/userAuth.controller');

const router = express.Router();

router.post('/createUser', userAuthController.createUser);

module.exports = router;
