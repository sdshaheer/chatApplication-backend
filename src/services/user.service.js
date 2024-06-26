const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger')
const User = require('../models/user.model')

const searchUsers = async (req) => {
    try {
        const { searchValue } = req.query
        const { mongoUser } = req

        const users = await User.find({
            $and: [
                { _id: { $ne: mongoUser._id } },
                {
                    $or: [
                        { name: { $regex: searchValue, $options: "i" } },
                        { email: { $regex: searchValue, $options: "i" } }
                    ]
                }
            ]
        });

        return users

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};

const getUserDetails = async (req) => {
    try {
        const { mongoUser } = req
        return mongoUser

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};

const updateUser = async (req) => {
    try {
        const { data } = req?.body
        const { mongoUser } = req

        const response = await User.findByIdAndUpdate(mongoUser?._id, { ...data }, { new: true })
        return response

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
};

module.exports = { searchUsers, getUserDetails, updateUser }