const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/searchUsers', userController.searchUsers);
router.get('/getUserDetails', userController.getUserDetails);
router.put('/updateUser', userController.updateUser);


module.exports = router;
