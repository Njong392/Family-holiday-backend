const Accommodation = require('../models/accomodationModel')
const mongoose = require('mongoose')

//create an accommodation
const createAccommodation = async(req, res) => {
    const {country, city, rooms, beds, bathrooms, maxOfGuests, durationOfStay, houseRules,pricePerNight} = req.body

    //add doc to db
    try{
        const user_id = req.user_id
        const accommodation = await Accommodation.create({
            country,
            city,
            description: [rooms, beds, bathrooms],
            maxOfGuests,
            durationOfStay,
            houseRules,
            pricePerNight,
            user_id
        })

        res.status(200).json(accommodation)
    } catch(error){
        res.status(400).json({error: error.message})
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