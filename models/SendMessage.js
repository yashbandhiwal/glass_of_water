const mongoose = require('mongoose');

const SendMessageSchema = new mongoose.Schema({
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
    message:{
        type: String,
        required:false
    },
    title:{
        type: String,
        required:[true,'Please add Title']
    },
    slag:{
        type:String,
        unique:true,
        required:[true,'Please add Slag']
    },
    emoji:{
        type:String,
        required:false
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

module.exports = mongoose.model('SendMessage',SendMessageSchema)