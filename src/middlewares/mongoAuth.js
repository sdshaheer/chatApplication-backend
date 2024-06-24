const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const { getUserWithUuidFromMongo } = require('../services/mongo.service')

// Middleware function to check Firebase ID token validation
async function mongoAuthMiddleware(req, res, next) {
    try {
        const user = req.user
        const mongouser = await getUserWithUuidFromMongo(user?.user_id)
        if (!mongouser) {
            throw new ApiError(httpStatus.NOT_FOUND, `user with ${user?.user_id} not found in mongo`);
        }

        req.mongoUser = mongouser
        next();
    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        logger.error(`error in mongoAuthMiddleware : ${error}`)
        throw new ApiError(status, details);
    }
}

module.exports = mongoAuthMiddleware;
