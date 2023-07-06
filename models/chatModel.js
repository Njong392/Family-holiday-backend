const mongoose = require('mongoose');

const Schema = mongoose.Schema

const chatSchema = new Schema({
    chatName: {
        type: String,
        trim: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
}, {timestamps: true})

module.exports = mongoose.model('Chat', chatSchema)