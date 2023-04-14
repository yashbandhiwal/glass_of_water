const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');


/**
 * @desc    Registration User
 * @route   POST /api/v1/auth/register
 * @access  Public
 * @Note
 */
exports.register = asyncHandler(async(req,res,next) => {
    const {
        name,
        email,
        userName,
        password,
        avatar,
        emoji
    } = req.body

    // create User
    const user = await User.create({
        name,
        email,
        userName,
        password,
        avatar,
        emoji
    })

    sendTokenResponse(user, 200, res);
})

/**
 * token from model
 * create cookie
 * send response
 */
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}