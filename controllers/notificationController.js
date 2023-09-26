const Notification = require('../models/notificationModel');

const createNotification = async(req, res) => {
    const {reservedAccommodation, guestId, hostId} = req.body

    try{
        let notification = await Notification.create({
            reservedAccommodation,
            guestId: req.user._id,
            hostId
        })

        notification = await notification.populate("reservedAccommodation")
        notification = await notification.populate("guestId")
        notification = await notification.populate("hostId")

        res.status(200).json(notification)
    } catch(error){
        res.status(500).json({error: error.message})
    }
}

module.exports = {createNotification}