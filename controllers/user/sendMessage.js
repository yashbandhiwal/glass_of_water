const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const moment = require('moment');
const SendMessage = require('../../models/SendMessage');
const Message = require('../../models/Message');
const User = require('../../models/User');


/**
 * @desc    Create
 * @route   POST - /api/v1/admin/sendmessage/create
 * @access  Private
 * @note
 */
exports.createMessage = asyncHandler(async(req,res,next) => {

    const {
        messageId,
        receiverId,
        emoji,
        message,
        title,
        slag
    } = req.body

    let messageExist = await Message.findById(messageId)
    if(messageExist){
        return next(new ErrorResponse("Message Don't Exist", 404));
    }

    let receiverExist = await User.findById(receiverId)
    if(receiverExist){
        return next(new ErrorResponse("Receiver Don't Exist", 404));
    }

    let create = await SendMessage.create({
        messageId,
        receiverId,
        senderId:req.user._id,
        emoji,
        message,
        title,
        slag
    })

    res.status(201).json({
        success:true,
        message:"Successfully created Message",
        body:create
    })

})