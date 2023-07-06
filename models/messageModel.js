const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
}, {timestamps: true})

module.exports = mongoose.model('Message', messageSchema) 