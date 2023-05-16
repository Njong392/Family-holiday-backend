const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accommodationSchema = new Schema({
    country:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    description:[
        {
            rooms:{
                type: Number,
                required: true
            },
            beds:{
                type: Number,
                required: true
            },
            bathrooms:{
                type: Number,
                required: true
            }
        }
    ],
    maxOfGuests: {
        type: Number,
        required: true
    },
    durationOfStay:{
        type: Date,
        required: true
    },
    houseRules: {
        type: [String],
        required: true
    },
    amenities: [
        {
            type: Object
        }
    ],
    pricePerNight:{
        type: Number,
        //required: true
    },
    user_id: {
        type: String,
        required: true
    }

}, {timestamps: true})

module.exports = mongoose.model('Accommodation',accommodationSchema )