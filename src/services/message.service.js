const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger')
const Message = require('../models/message.model')
const { ObjectId } = require('mongodb');
const Chat = require('../models/chat.model');


const sendMessage = async (req) => {
    try {
        const { mongoUser } = req
        const { content, chatId } = req?.body

        const message = new Message({
            sender: mongoUser?._id,
            content: content,
            chat: chatId
        })

        let newMessage = await message.save()
        newMessage = await newMessage.populate('sender')
        newMessage = await newMessage.populate({
            path: 'chat',
            populate: {
                path: 'users',
                model: 'User'
            }
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id })
        return newMessage

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
}

const getAllMessagesOfChat = async (req) => {
    try {
        const { chatId } = req?.query

        const messages = await Message.find({ chat: chatId })
            .populate('sender')
            .populate('chat')

        return messages


    } catch (error) {
        console.log(error)
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
}

module.exports = {
    sendMessage,
    getAllMessagesOfChat
}