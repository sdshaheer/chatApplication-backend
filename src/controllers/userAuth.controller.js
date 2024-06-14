const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userAuthService = require('../services/userAuth.service')

const createUser = catchAsync(async (req, res) => {
    const result = await userAuthService.createUser(req);
    res.status(httpStatus.OK).send(result);
});

module.exports = { createUser }