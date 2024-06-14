const User = require('../models/user.model')

const getUserWithUuidFromMongo = async (uuid) => {
    try {
        const user = await User.findOne({ uuid })
        return user
    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
}

const getUserInformation = async (id) => {
    try {
        const user = await User.findById(id)
        return user
    } catch (error) {
        const status = error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const details = error?.message || 'something went wrong';
        throw new ApiError(status, details);
    }
}

module.exports = {
    getUserWithUuidFromMongo,
    getUserInformation
}
