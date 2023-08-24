const mongoose = require("mongoose");

const Schema = mongoose.Schema

const reservationSchema = new Schema({
    guest:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    host:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    status:{
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled"],
        default: "pending"
    },
    accommodation:{
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
    adults:{
        type: Number
    },
    children:{
        type: Number
    },
    infants:{
        type: Number
    }
})

module.exports = mongoose.model("Reservation", reservationSchema)