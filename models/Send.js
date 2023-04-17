const mongoose = require('mongoose');

const SendSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    MesaageId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Message',
        required: true
    },
    seen:{
        type:Boolean,
        default:false
    },
    actionTaken:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        Default:Date.now()
    },
    updateAt:{
        type:Date,
        Default:Date.now()
    }
})

module.exports = mongoose.model('send',SendSchema)