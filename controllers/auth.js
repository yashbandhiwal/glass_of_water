const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const { ObjectId } = require('mongodb');


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
 * @desc    Login User
 * @route   POST /api/v1/auth/login
 * @access  Public
 * @Note
 */
exports.login = asyncHandler(async(req,res,next) => {
    const { userName, password } = req.body;

    // Validate emil & password
    if (!userName || !password) {
        return next(new ErrorResponse('Please provide an username and password', 400));
    }

    // Check for user
    const user = await User.findOne({ userName }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
})


/**
 * @desc    Get Detail
 * @route   GET /api/v1/auth/getme
 * @access  Private
 * @Note
 */
exports.getme = asyncHandler(async(req,res,next) => {

    const user = await User.findById(req.user.id).lean().exec()

    res.status(200).json({
        success:true,
        body:user
    })
})


/**
 * @desc    Logout
 * @route   GET /api/v1/auth/logout
 * @access  Public
 * @Note
 */
exports.logout = asyncHandler(async(req,res,next) => {

    res.status(200).json({
        success:true,
        message:"Successfully Logout",
        body:{}
    })

})


/**
 * @desc    Update Detail
 * @route   PUT /api/v1/auth/updateDetail
 * @access  Private
 * @note
 */
exports.updateDetail = asyncHandler(async(req,res,next) => {

    let {
        name,
        avatar,
        emoji
    } = req.body

    let user = await User.findByIdAndUpdate({_id:new ObjectId(req.user.id)},{
        $set:{
            name,
            avatar,
            emoji
        }
    },
    {
        new:true,
        runValidators:true,
        returnNewDocument : true  
    })


    res.status(200).json({
        success:true,
        message:"Successfully Updated",
        body:user
    })

})


/**
 * @desc    Update Password
 * @route   PUT /api/v1/auth/updatePassword
 * @access  Private
 * @note
 */
exports.updatePassword = asyncHandler(async(req,res,next) => {

    const user = await User.findById(req.user.id).select('+password')

    if(!(await user.matchPassword(req.body.current))){
        return next(new ErrorResponse('Password is Incorrect',401))
    }

    user.password = req.body.new;
    await user.save()

    sendTokenResponse(user, 200, res)

})


/**
 * @desc    Forget Password
 * @route   POST /api/v1/auth/forgetPassword
 * @access  Public
 * @Note    
 */
exports.forgetPassword = asyncHandler(async(req,res,next) => {
    
    let user = await User.findOne({
        $or:[
            {userName:req.body.userName},
            {email:req.body.email}
        ]
    })

    if (!user) {
        return next(new ErrorResponse('There is no user with that email or username', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        // await sendEmail({
        //   email: user.email,
        //   subject: 'Password reset token',
        //   message
        // });
    
        res.status(200).json({ success: true, message,data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }

})


/**
 * @desc    Reset Password
 * @route   POST /api/v1/auth/resetPassword/:resettoken
 * @access  Public
 * @note    
 */
exports.resetPassword = asyncHandler(async(req,res,next) => {
    
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

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