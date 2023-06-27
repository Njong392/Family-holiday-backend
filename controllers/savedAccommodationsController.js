const savedAccommodation = require('../models/savedAccommodationsModel')
const mongoose = require('mongoose')


//create a saved profile
const createSavedAccommodation = async(req,res) => {
    const {accommodation} = req.body
    const user_id = req.user._id

    try{
        const savedAcc = await savedAccommodation.create({accommodation, user_id})

        res.status(200).json(savedAcc)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete a saved profile
const deleteSavedAccommodation = async(req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No saved accommodation with that id'})
    }

    try{
        const deletedAcc = await savedAccommodation.findOneAndDelete({_id: id})
        res.status(200).json(deletedAcc)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    createSavedAccommodation,
    deleteSavedAccommodation
}