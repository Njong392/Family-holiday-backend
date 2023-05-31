const Accommodation = require('../models/accomodationModel')
const mongoose = require('mongoose')
const { uploadToCloudinary } = require('../services/cloudinary')

//create an accommodation
const createAccommodation = async(req, res) => {
    const {country, city, bedrooms, beds, bathrooms, maxOfGuests, arrivalDate,departureDate,image, houseRules,pricePerNight} = req.body

    //add doc to db
    try{
        let imageData = {}

        if(image){
            const imageData = await uploadToCloudinary(image, 'family_accommodation')
            console.log(imageData)
        }

        const user_id = req.user._id
        const accommodation = await Accommodation.create({
            country,
            city,
            bedrooms, 
            beds, 
            bathrooms,
            maxOfGuests,
            arrivalDate,
            departureDate,
            houseRules,
            image: imageData,
            pricePerNight,
            user_id
        })

        res.status(200).json(accommodation)
        console.log(imageData)
    } catch(error){
        res.status(400).json({error: error.message})
        console.log(error)
    }
}

//get all accommodation
const getAccommodations = async (req, res) => {
    const user_id = req.user_id
    const accommodations = await Accommodation.find({user_id}).sort({createdAt: -1})

    res.status(200).json(accommodations)

}

//get single accommodation
const getAccommodation = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such id'})
    }

    const accomodation = await Accommodation.findById(id)

    if(!accomodation){
        return res.status(404).json({error: 'No such accommodation'})
    }

    res.status(200).json(accomodation)
}

//update an accommodation
const updateAccommodation = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such id'})
    }

    const accommodation = await Accommodation.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!accommodation){
        return res.status(400).json({error: 'No such accommodation'})
    }

    res.status(200).json(accommodation)
}

//delete an accommodation
const deleteAccommodation = async(req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such id'})
    }

    const accommodation = await Accommodation.findOneAndDelete({_id: id})

    if(!accommodation){
        return res.status(400).json({error: 'No such accommodation'})
    }

    res.status(200).json(accommodation)
}

module.exports = {
   createAccommodation,
   getAccommodations,
   getAccommodation,
   updateAccommodation,
   deleteAccommodation 
}