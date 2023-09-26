const User = require("../models/userModel");
const Accommodation = require("../models/accomodationModel");
const Reservation = require("../models/reservationModel");


const createReservation = async(req, res) =>{

    const {hostId,id, arrivalDate, departureDate, pricePerNight, adultCount, childrenCount, infantCount} = req.body


    try{
        let reservation = await Reservation.create({
        users: [req.user._id, hostId],
        guest: req.user._id,
        id,
        arrivalDate,
        departureDate,
        pricePerNight,
        adultCount,
        childrenCount,
        infantCount
    })

    reservation = await reservation.populate("users", "-password")
    reservation =  await reservation.populate("id")

    res.status(200).json(reservation)
    } catch(error){
        res.status(500).json({error: error.message })
    }
}

const acceptReservation = async (req, res) => {
    const {id} = req.body
    
    try{
        const reservation = await reservation.findOneAndUpdate({_id: id}, {
            status: 'incomplete'
        })

        res.status(200).json(reservation)

    }catch(error){
         res.status(500).json({ error: error.message });
    }
}

module.exports = {createReservation, acceptReservation}