const mongoose = require("mongoose");

const Schema = mongoose.Schema

const reservationSchema = new Schema({
    users: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
    ],
    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    status:{
        type: String,
        enum: ["pending","incomplete", "accepted", "rejected", "cancelled"],
        default: "pending"
    },
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accommodation",
    },
    arrivalDate:{
        type: Date
    },
    departureDate:{
        type: Date
    },
    pricePerNight:{
        type: Number
    },
    adultCount:{
        type: Number
    },
    childrenCount:{
        type: Number
    },
    infantCount:{
        type: Number
    }
})

module.exports = mongoose.model("Reservation", reservationSchema)