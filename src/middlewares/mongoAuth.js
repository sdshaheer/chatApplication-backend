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
            return res.status(httpStatus.NOT_FOUND).json({ error: `${user?.user_id} not found in users collection` });
        }

        req.mongoUser = mongouser
        next();
    } catch (error) {
        logger.error('Error in mongoAuth :', error);
        return res.status(httpStatus.NOT_FOUND).json({ error: `${user?.user_id} not found in users collection` });
    }
}

module.exports = mongoAuthMiddleware;
