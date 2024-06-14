
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    // res.locals.errorMessage = err.message;

    let response = {
        code: statusCode,
        message,
    };

    if (err.details) {
        response = {
            ...err.details,
            message: err.details?.message || message,
        };
    }
    logger.error(err)
    res.status(statusCode).send(response);
};

module.exports = {
    errorHandler,
};
