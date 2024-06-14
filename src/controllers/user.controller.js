const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service')

const searchUsers = catchAsync(async (req, res) => {
    const result = await userService.searchUsers(req);
    res.status(httpStatus.OK).send(result);
});

module.exports = { searchUsers }