const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const chatService = require('../services/chat.service')

const accessChat = catchAsync(async (req, res) => {
    const result = await chatService.accessChat(req);
    res.status(httpStatus.OK).send(result);
});

const getAllChats = catchAsync(async (req, res) => {
    const result = await chatService.getAllChats(req);
    res.status(httpStatus.OK).send(result);
});

const createGroupChat = catchAsync(async (req, res) => {
    const result = await chatService.createGroupChat(req);
    res.status(httpStatus.OK).send(result);
});

const renameGroupChat = catchAsync(async (req, res) => {
    const result = await chatService.renameGroupChat(req);
    res.status(httpStatus.OK).send(result);
});

const addUserToGroupChat = catchAsync(async (req, res) => {
    const result = await chatService.addUserToGroupChat(req);
    res.status(httpStatus.OK).send(result);
});

const removeUserFromGroupChat = catchAsync(async (req, res) => {
    const result = await chatService.removeUserFromGroupChat(req);
    res.status(httpStatus.OK).send(result);
});

const updateGroupChat = catchAsync(async (req, res) => {
    const result = await chatService.updateGroupChat(req);
    res.status(httpStatus.OK).send(result);
});

module.exports = {
    accessChat,
    getAllChats,
    createGroupChat,
    renameGroupChat,
    addUserToGroupChat,
    removeUserFromGroupChat,
    updateGroupChat
}