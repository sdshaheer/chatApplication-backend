const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger')
const User = require('../models/user.model')
const { getUserWithUuidFromMongo } = require('./mongo.service')

const createUser = async (req) => {
    try {
        const { uuid, name, email } = req.body
        const user = await getUserWithUuidFromMongo(uuid)

        if (user) {
            return 'user already exists'
        }

        const newUser = new User({
            uuid,
            name,
            email
        })
        const savedUser = await newUser.save()
        return savedUser

    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        logger.error(error);
        throw new ApiError(status, details);
    }
};

module.exports = { createUser }