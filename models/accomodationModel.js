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
   
     bedrooms:{
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
    },
    maxOfGuests: {
        type: Number,
        required: true
    },   
    arrivalDate:{
        type: Date,
        required: true
    },
    departureDate:{
        type: Date,
        required: true
    },
    houseRules: {
        type: [String],
        required: true
    },
    // amenities: [
    //     {
    //         type: Object
    //     }
    // ],
    pricePerNight:{
        type: Number,
        required: true
    },
    image: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
     }
    ,
    user_id: {
        type: String,
        required: true
    }

}, {timestamps: true})

module.exports = mongoose.model('Accommodation',accommodationSchema )