const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger')
const User = require('../models/user.model')
const Chat = require('../models/chat.model')
const { ObjectId } = require('mongodb');
const { getUserInformation } = require('./mongo.service')


const accessChat = async (req) => {
    try {
        const { userId } = req.body
        const { mongoUser } = req

        // check other user exists
        const user = await getUserInformation(new ObjectId(userId))
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, `user with ${userId} not found`)
        }

        let chat = await Chat.findOne({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: new ObjectId(mongoUser?._id) } } }
            ]
        })
            .populate('users')
            .populate({
                path: 'latestMessage',
                populate: {
                    path: 'sender',
                    model: 'User'
                }
            });

        // chat = await User.populate(chat, {
        //     path: 'latestMessage.sender',
        // })

        if (chat) {
            return chat
        }

        const chatData = {
            chatName: '',
            users: [mongoUser?._id, userId]
        }

        const newChat = new Chat({ ...chatData })
        const savedChat = (await newChat.save()).populate('users')
        return savedChat

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
}

const getAllChats = async (req) => {
    try {
        const { mongoUser } = req
        const chats = await Chat.find({ users: { $elemMatch: { $eq: mongoUser?._id } } })
            .populate('users')
            .populate('groupAdmin')
            .populate({
                path: 'latestMessage',
                populate: {
                    path: 'sender',
                    model: 'User'
                }
            })
            .sort({ updatedAt: -1 })

        return chats

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
}


const createGroupChat = async (req) => {
    try {
        const { mongoUser } = req
        const { groupName, users } = req.body

        if (users.length === 0) {
            throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'atleast one user was required for group chat')
        }

        // check users available in userInfo
        const promises = users.map(async (userId) => {
            const userInfo = await getUserInformation(userId)
            if (!userInfo) {
                throw new ApiError(httpStatus.NOT_FOUND, `user with ${userId} not found`)
            }
            return userInfo
        })

        await Promise.all(promises)

        const chatData = {
            chatName: groupName,
            users: [...users, mongoUser?._id],
            isGroupChat: true,
            groupAdmin: mongoUser?._id
        }

        const newChat = new Chat({ ...chatData })
        const savedChat = (await (await newChat.save()).populate('users')).populate('groupAdmin')
        return savedChat

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};

const renameGroupChat = async (req) => {
    try {
        const { chatId, groupName } = req.body

        const updatedChat = await Chat.findByIdAndUpdate(
            new ObjectId(chatId),
            { chatName: groupName },
            { new: true }
        ).populate('users').populate('groupAdmin')

        if (!updatedChat) {
            throw new ApiError(httpStatus.NOT_FOUND, `chat with ${chatId} not found`)
        }

        return updatedChat

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};

const addUserToGroupChat = async (req) => {
    try {
        const { chatId, users } = req.body

        if (users?.length === 0) {
            throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'add atleast one user')
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $addToSet: { users: { $each: users } } },
            { new: true }
        ).populate('users').populate('groupAdmin')

        if (!updatedChat) {
            throw new ApiError(httpStatus.NOT_FOUND, `chat with ${chatId} not found`)
        }

        return updatedChat

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};

const removeUserFromGroupChat = async (req) => {
    try {
        const { chatId, user } = req.body

        const updatedChat = await Chat.findByIdAndUpdate(
            new ObjectId(chatId),
            { $pull: { users: user } },
            { new: true }
        ).populate('users').populate('groupAdmin')

        if (!updatedChat) {
            throw new ApiError(httpStatus.NOT_FOUND, `chat with ${chatId} not found`)
        }

        return updatedChat

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};

const updateGroupChat = async (req) => {
    try {
        const { data, chatId } = req.body

        const response = await Chat.findByIdAndUpdate(chatId, { ...data }, { new: true })
        console.log(response)
        return response

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};


const exitGroup = async (req) => {
    try {
        const { chatId } = req?.body
        const { mongoUser } = req

        const updatedChat = await Chat.findByIdAndUpdate(
            new ObjectId(chatId),
            { $pull: { users: mongoUser?._id } },
            { new: true }
        ).populate('users')

        if (!updatedChat) {
            throw new ApiError(httpStatus.NOT_FOUND, `chat with ${chatId} not found`)
        }

        return updatedChat

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};

module.exports = {
    accessChat,
    getAllChats,
    createGroupChat,
    renameGroupChat,
    addUserToGroupChat,
    removeUserFromGroupChat,
    updateGroupChat,
    exitGroup
}