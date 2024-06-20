const express = require('express');

const messageController = require('../controllers/message.controller');

const router = express.Router();

router.post('/sendMessage', messageController.sendMessage);
router.get('/getAllMessagesOfChat', messageController.getAllMessagesOfChat);



module.exports = router;
