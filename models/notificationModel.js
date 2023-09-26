const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    reservedAccommodation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accommodation",
    },
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
})

module.exports = mongoose.model("Notification", notificationSchema)