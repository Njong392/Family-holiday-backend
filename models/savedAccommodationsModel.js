const mongoose = require('mongoose')

const Schema = mongoose.Schema

const savedAccommodationSchema= new Schema({
    accommodation:{
        type: Object,
    },
    user_id:{
        type: String,
    }
})

module.exports = mongoose.model('savedAccommodation', savedAccommodationSchema)