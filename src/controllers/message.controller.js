const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const messageService = require('../services/message.service')

const sendMessage = catchAsync(async (req, res) => {
    const result = await messageService.sendMessage(req);
    res.status(httpStatus.OK).send(result);
});

const getAllMessagesOfChat = catchAsync(async (req, res) => {
    const result = await messageService.getAllMessagesOfChat(req);
    res.status(httpStatus.OK).send(result);
});

module.exports = {
    sendMessage,
    getAllMessagesOfChat
}