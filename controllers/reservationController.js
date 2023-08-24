const User = require("../models/userModel");
const Accommodation = require("../models/accomodationModel");
const Reservation = require("../models/reservationModel");


const createReservation = async(req, res) =>{

    const {host,accommodation, arrivalDate, departureDate, pricePerNight, adults, children, infants} = req.body


    try{
        const reservation = await Reservation.create({
        host,
        guest: req.user._id,
        accommodation,
        arrivalDate,
        departureDate,
        pricePerNight,
        adults,
        children,
        infants
    })

    const reservationDetails = await reservation.populate("guest", "-password").populate("host", "-password").populate("accommodation")

    res.status(200).json(reservationDetails)
    } catch{
        res.status(500).json({error: "Oops. Some server error occurred. Please try again"})
    }
}

module.exports = {createReservation}