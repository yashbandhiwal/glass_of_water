const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
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
        required:[true,'Please add Slag']
    },
    emoji:{
        type:String,
        required:false
    },
    emojiIs:{
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

module.exports = mongoose.model('messages',MessageSchema)