const ErrorResponse = require('../../utils/errorResponse');
const asyncHandler = require('../../middleware/async');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const moment = require('moment');
const User = require('../../models/User');
const Glass = require('../../models/Glass')


/**
 * @desc    Count up the glass of water
 * @route   GET - /api/v1/user/glass/countup
 * @access  Private
 * @note
 * 
 */
exports.countup = asyncHandler(async(req,res,next) => {

    let todaystart = moment().startOf('day');
    let todayend = moment(todaystart).endOf('day');

    let glassFind = await Glass.find({
        createdTime: { '$gte': todaystart, '$lte': todayend },
        userId:new ObjectId(req.user._id)
    })
    .sort({createdTime:-1})
    .limit(1)

    let glassCreate = await Glass.create({
        createdTime:Date.now(),
        userId:new ObjectId(req.user._id),
        count:glassFind[0]?(glassFind[0].count ? (glassFind[0].count + 1) : 1):1
    })

    res.status(200).json({
        success:true,
        message:"Glass is counted up",
        body:glassCreate
    })

})