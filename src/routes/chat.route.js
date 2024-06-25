const express = require('express');

const chatController = require('../controllers/chat.controller');

const router = express.Router();

router.post('/accessChat', chatController.accessChat);
router.get('/getAllChats', chatController.getAllChats);
router.post('/createGroupChat', chatController.createGroupChat);
router.put('/renameGroupChat', chatController.renameGroupChat);
router.put('/addUserToGroupChat', chatController.addUserToGroupChat);
router.put('/removeUserFromGroupChat', chatController.removeUserFromGroupChat);
router.put('/updateGroupChat', chatController.updateGroupChat);
router.post('/exitGroup', chatController.exitGroup);



module.exports = router;
