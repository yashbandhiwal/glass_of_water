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


/**
 * @desc    list of glass of water of day
 * @route   GET - /api/v1/user/glass/list
 * @access  Private
 * @note
 * 
 */
exports.listOfGlassDay = asyncHandler(async(req,res,next) => {
    let todaystart = moment().startOf('day');
    let todayend = moment(todaystart).endOf('day');

    let glassFind = await Glass.find({
        createdTime: { '$gte': todaystart, '$lte': todayend },
        userId:new ObjectId(req.user._id)
    })
    .sort({createdTime:-1})

    res.status(200).json({
        success:true,
        message:"List of Glass count in a Day",
        body:glassFind
    })

})


/**
 * @desc    detail of glass of water of day
 * @route   POST - /api/v1/user/glass/detail
 * @access  Private
 * @note
 * 
 */
exports.detail = asyncHandler(async(req,res,next) => {

    let getDetail = await Glass.findById({_id:new ObjectId(req.body.glassId)})

    res.status(200).json({
        success:true,
        message:"Detail of that Glass",
        body:getDetail
    })
})


/**
 * @desc    delete of glass of water of day
 * @route   DELETE - /api/v1/user/glass/delete
 * @access  Private
 * @note
 * 
 */
exports.deleteGlass = asyncHandler(async(req,res,next) => {

    let todaystart = moment().startOf('day');
    let todayend = moment(todaystart).endOf('day');

    let glassFind = await Glass.find({
        createdTime: { '$gte': todaystart, '$lte': todayend },
        userId:new ObjectId(req.user._id)
    })
    .sort({createdTime:-1})
    .limit(1)

    if(!glassFind[0]){
        return next(new ErrorResponse('Glass Does not exist', 404));
    }

    await Glass.deleteOne({_id:new ObjectId(glassFind[0]._id)})

    res.status(200).json({
        success:true,
        message:"Glass Deleted Successfully",
        body:{}
    })
})


/**
 * @desc    aggregate of glass of water per dat for week
 * @route   DELETE - /api/v1/user/glass/aggregateGlassData
 * @access  Private
 * @note    workable later to evolve more
 * 
 */
exports.aggregateGlassData = asyncHandler(async(req,res,next) => {

    let { aggregateTemp, startDate, endDate } = req.body;
    let aggregateFlag = {}

    let todaystart = moment(new Date(startDate)).startOf('day');
    let todayend = moment(new Date(endDate)).endOf('day');
    

    if(aggregateTemp == 'day'){
        aggregateFlag = { $dayOfMonth : "$createdTime" }
    }else if(aggregateTemp == 'week'){
        aggregateFlag = { $week : "$createdTime" }
    }else if(aggregateTemp == 'month'){
        aggregateFlag = { $month : "$createdTime" }
    }else if(aggregateTemp == 'year'){
        aggregateFlag = { $year : "$createdTime" }
    }

    let aggregateData = await Glass.aggregate([
        {
            $match:{
                userId:new ObjectId(req.user._id),
                createdTime: { '$gte': new Date(todaystart), '$lte': new Date(todayend) },
            }
        },
        {
            $group : {
                // _id :{ $dateToString: { format: "%Y-%m-%d", date: "$createdTime"} },
                _id :aggregateFlag,
                list: { $push: "$$ROOT" },
                count: { $sum: 1 }
             }
        }
    ])

    res.status(200).json({
        success:true,
        message:"Glass aggregation Successfully",
        body:aggregateData
    })

})