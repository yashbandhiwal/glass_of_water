const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const moment = require('moment');
const Message = require('../../models/Message');


/**
 * @desc    Create
 * @route   POST - /api/v1/admin/message/create
 * @access  Private
 */
exports.createMessage = asyncHandler(async(req,res,next) => {

    const {
        message,
        title,
        slag,
        emoji,
        emojiIs
    } = req.body

    let create = await Message.create({
        message,
        title,
        slag,
        emoji,
        emojiIs
    })

    res.status(201).json({
        success:true,
        message:"Successfully created",
        body:create
    })

})