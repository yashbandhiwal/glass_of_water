const mongoose = require('mongoose');

const GlassSchema = new mongoose.Schema({
    createdTime:{
        type:Date,
        Default:Date.now(),
        required:true
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    count:{
        type:Number,
        default:0,
        required:[true,'Please give the count']
    }
})

module.exports = mongoose.model('glass',GlassSchema)